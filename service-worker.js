// Nome della cache
const CACHE_NAME = 'cs-laurentum-cache-v1';

// File da mettere in cache
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/icon.png',  // Aggiungi l'icona se la usi
  '/manifest.json'
];

// Evento di installazione del service worker
self.addEventListener('install', (event) => {
  // Pre-cache dei file
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aperta e file aggiunti');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento di attivazione del service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            // Elimina le cache obsolete
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento di recupero delle richieste (fetch)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Rispondi dalla cache se disponibile, altrimenti dalla rete
        return cachedResponse || fetch(event.request);
      })
  );
});
