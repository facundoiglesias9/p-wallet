self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Solo necesitamos que exista el service worker para cumplir los criterios de PWA
    event.respondWith(fetch(event.request));
});
