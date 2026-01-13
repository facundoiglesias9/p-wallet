// Minimal Service Worker for PWA compliance
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// We don't fetch anything to avoid interfering with auth or external scripts
self.addEventListener('fetch', () => {
    // Do nothing, let the browser handle it
});
