
const CACHE = 'jc-nutrition-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json?v=6',
  './style.css',
  './app.js',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => Promise.all(
      ASSETS.map(u => cache.add(u).catch(()=>null))
    ))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;

  const url = new URL(req.url);

  // Always try network first for page navigation and core JS/CSS so updates win.
  if(req.mode === 'navigate' || /\/(index\.html|app\.js|style\.css)(\?|$)/.test(url.pathname + url.search)) {
    event.respondWith((async()=>{
      try{
        const fresh = await fetch(req, {cache:'no-store'});
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone()).catch(()=>{});
        return fresh;
      }catch(e){
        return (await caches.match(req)) || (await caches.match('./index.html'));
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cached = await caches.match(req);
    if(cached) return cached;
    try{
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone()).catch(()=>{});
      return fresh;
    }catch(e){
      return Response.error();
    }
  })());
});
