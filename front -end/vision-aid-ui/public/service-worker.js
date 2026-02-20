/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'vision-aid-v2';
const OFFLINE_URL = '/offline.html';

const PRECACHE = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    '/favicon.svg',
];

// ─── Install: precache core shell ─────────────────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
    );
    self.skipWaiting();
});

// ─── Activate: clear old caches ───────────────────────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(names
                .filter(n => n !== CACHE_NAME)
                .map(n => caches.delete(n))
            )
        )
    );
    self.clients.claim();
});

// ─── Fetch: network-first for navigation, cache-first for assets ──────────────
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const { request } = event;
    const isNavigation = request.mode === 'navigate';

    if (isNavigation) {
        // Network-first, fall back to offline.html
        event.respondWith(
            fetch(request).catch(() =>
                caches.match(OFFLINE_URL)
            )
        );
        return;
    }

    // Cache-first with network fallback for static assets
    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;
            return fetch(request).then(response => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(c => c.put(request, clone));
                }
                return response;
            }).catch(() => caches.match(OFFLINE_URL));
        })
    );
});
