const CACHE = 'jc-nutrition-v1-3';
const ASSETS = [
  './app.js',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon.svg',
  './index.html',
  './nutrition_v1_2.css','./nutrition_v1_2.js','./nutrition_v1_3.css','./nutrition_v1_3.js','./manifest.json',
  './nutrition_v1.css',
  './nutrition_v1.js',
  './styles.css',
  './sw.js',
  './v10.css',
  './v10.js',
  './v10_2.css',
  './v10_2.js',
  './v10_3.css',
  './v10_3.js',
  './v10_4.css',
  './v10_4.js',
  './v10_5.css',
  './v10_5.js',
  './v10_6.css',
  './v10_6.js',
  './v10_7.css',
  './v10_7.js',
  './v11.css',
  './v11.js',
  './v3.css',
  './v3.js',
  './v4.css',
  './v4.js',
  './v4_1.css',
  './v4_1.js',
  './v4_2.css',
  './v4_2.js',
  './v5.css',
  './v5.js',
  './v6.css',
  './v6.js',
  './v7.css',
  './v7.js',
  './v7_1.css',
  './v7_1.js',
  './v8.js',
  './v9.css',
  './v9.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // HTML: red primero para no quedarse atrapado en una versión antigua.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Resto: caché primero, después red.
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
