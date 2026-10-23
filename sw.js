
const CACHE = 'ome-mobile-0f2a6d6017aecbf1';
const ROOT = new URL('./', self.location.href);
const ASSETS = ["index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","assets/index-B63S8iUZ.js","assets/index-izQNCPQW.css"].map(path => new URL(path, ROOT).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('ome-mobile-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== ROOT.origin || request.headers.has('Authorization')) return;
  if (ASSETS.includes(url.href)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(request)).then(cached => cached || fetch(request)));
  } else if (request.mode === 'navigate' && url.pathname.startsWith(ROOT.pathname)) {
    event.respondWith(fetch(request).catch(() => caches.open(CACHE).then(cache => cache.match(new URL('index.html', ROOT).href))));
  }
});
