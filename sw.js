const CACHE_NAME = 'skiftkalkyl-cache-v2';
const ASSETS = [
  './',
  './index.html'
];

// Installera service worker och cache-lagra resurser
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Använd relative paths för att undvika problem med underkataloger
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Aktivera service worker
self.addEventListener('activate', (e) => {
  self.clients.claim();
});

// Interceptera nätverksanrop (Cache First)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).catch(() => {
        // Om nätverket är nere och det är en navigering, returnera cachead index.html
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
