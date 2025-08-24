const CACHE_NAME = "dice-app-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/dice.js",
  "/assets/logo.png",
  "https://unpkg.com/three@0.152.2/build/three.min.js"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});
