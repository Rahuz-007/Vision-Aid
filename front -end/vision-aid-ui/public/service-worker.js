/* eslint-disable no-restricted-globals */
// ─── Vision Aid Service Worker — Full PWA with Offline Support ────────────────
// Strategy: Cache-First for static assets, Network-First for API calls,
//           Offline fallback for navigation requests.

const CACHE_NAME = 'vision-aid-v4';
const STATIC_CACHE = 'vision-aid-static-v4';
const API_CACHE = 'vision-aid-api-v4';

// Core app shell — always cache these first
const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html',
    '/favicon.svg',
    '/colors.csv',
];

// Routes that should work offline (show cached version)
const OFFLINE_ROUTES = [
    '/color-test',
    '/simulator',
    '/color-picker',
    '/checker',
    '/palette-checker',
    '/palette-generator',
    '/color-psychology',
    '/color-history',
];

// ── Install: pre-cache the app shell ─────────────────────────────────────────
self.addEventListener('install', event => {
    console.log('[SW] Installing Vision Aid Service Worker v4');
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            console.log('[SW] Pre-caching app shell');
            return cache.addAll(APP_SHELL).catch(err => {
                console.warn('[SW] Some app shell files failed to cache:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener('activate', event => {
    console.log('[SW] Activating Vision Aid Service Worker v4');
    const currentCaches = [CACHE_NAME, STATIC_CACHE, API_CACHE];
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames
                    .filter(name => !currentCaches.includes(name))
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            )
        ).then(() => self.clients.claim())
    );
});

// ── Fetch: smart caching strategy ────────────────────────────────────────────
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and browser extension requests
    if (request.method !== 'GET') return;
    if (!url.protocol.startsWith('http')) return;

    // ── API calls: Network-first, fall back to cache ─────────────────────────
    if (url.pathname.startsWith('/api/') || url.port === '3001' || url.port === '8000') {
        event.respondWith(networkFirstStrategy(request, API_CACHE, 5000));
        return;
    }

    // ── Static JS/CSS/fonts: Cache-first ─────────────────────────────────────
    if (
        request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'font' ||
        url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/)
    ) {
        event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
        return;
    }

    // ── Images: Cache-first with 7-day expiry ────────────────────────────────
    if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
        event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
        return;
    }

    // ── Navigation (HTML pages): Network-first, offline fallback ─────────────
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Cache a fresh copy of the page
                    const cloned = response.clone();
                    caches.open(STATIC_CACHE).then(cache => cache.put(request, cloned));
                    return response;
                })
                .catch(async () => {
                    // Offline: try cache, then offline.html
                    const cached = await caches.match(request);
                    if (cached) return cached;
                    const indexCached = await caches.match('/index.html');
                    if (indexCached) return indexCached;
                    return caches.match('/offline.html');
                })
        );
        return;
    }

    // ── Everything else: try cache then network ───────────────────────────────
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
});

// ── Cache-First Strategy ──────────────────────────────────────────────────────
async function cacheFirstStrategy(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        return new Response('Offline — resource not cached', { status: 503 });
    }
}

// ── Network-First Strategy ────────────────────────────────────────────────────
async function networkFirstStrategy(request, cacheName, timeout = 5000) {
    const cache = await caches.open(cacheName);

    // Race: fetch vs timeout
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) cache.put(request, response.clone());
        return response;
    });

    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), timeout)
    );

    try {
        return await Promise.race([fetchPromise, timeoutPromise]);
    } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        return new Response(
            JSON.stringify({ error: 'Offline', message: 'Network unavailable and no cached data.' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// ── Background Sync: retry failed POST requests when back online ──────────────
self.addEventListener('sync', event => {
    if (event.tag === 'vision-test-sync') {
        event.waitUntil(syncVisionTests());
    }
});

async function syncVisionTests() {
    const cache = await caches.open('vision-aid-pending-sync');
    const keys = await cache.keys();
    for (const request of keys) {
        const cachedResponse = await cache.match(request);
        const body = await cachedResponse.json();
        try {
            await fetch('/api/vision-test/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            await cache.delete(request);
        } catch {
            // Will retry next sync event
        }
    }
}

// ── Push Notifications (future) ───────────────────────────────────────────────
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    event.waitUntil(
        self.registration.showNotification(data.title || 'Vision Aid', {
            body: data.body || 'New update available',
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            data: { url: data.url || '/' }
        })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/')
    );
});
