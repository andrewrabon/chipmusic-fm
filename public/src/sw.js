/* eslint no-restricted-globals: [0] */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/style.css',
      '/app.js',
    ])),
  );
});
