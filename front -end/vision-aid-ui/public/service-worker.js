/* eslint-disable no-restricted-globals */

// ─── Noop Service Worker ───────────────────────────────────────────────────────
// This service worker intentionally does nothing.
// It exists only to replace and deactivate any previously cached versions.

const CACHE_NAME = 'vision-aid-v3';

// Install: skip waiting immediately so this SW takes control fast
self.addEventListener('install', () => {
    self.skipWaiting();
});

// Activate: delete ALL old caches and take control of all clients
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(names.map(name => caches.delete(name)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: pass ALL requests straight to the network — no caching, no offline fallback
self.addEventListener('fetch', event => {
    event.respondWith(fetch(event.request));
});
