// Minimal service worker for offline PWA
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open('dice-v1').then(cache =>
      cache.addAll(['index.html', 'dice.png'])
    )
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
