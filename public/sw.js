self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// fetch handler is MANDATORY for PWA installation
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
