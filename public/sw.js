// Minimalistic Service Worker for Zero Latency
// Satisfies PWA installation without intercepting traffic
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('fetch', (event) => {
    // We do NOT call event.respondWith() 
    // This allows the browser to handle all requests at native speed
});
