// Between Web Service Worker
const CACHE_NAME = 'between-cache-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Let network handle WebRTC and normal asset requests
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
