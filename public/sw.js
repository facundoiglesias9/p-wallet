// Minimal Service Worker to enable PWA without interfering with Auth
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // We strictly pass through all requests. 
    // Samsung/Chrome only check if a fetch handler exists.
    // We do NOT use event.respondWith() unless absolutely necessary 
    // to avoid breaking authentication redirects.
});
