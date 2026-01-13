self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Required for PWA to be installable: respondWith must be called
    event.respondWith(
        fetch(event.request).catch(() => {
            // Fallback or just let it fail if offline, 
            // but the call to respondWith is what triggers the PWA criteria
            return new Response("Offline");
        })
    );
});
