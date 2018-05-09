const CACHE_VERSION = '1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => {
        return cache.add('/index.html');
      })
  )
});

function onFetchRequest(event) {
    caches.open(CACHE_VERSION).then(cache => {
      cache.match(event.request).then(response => {
        if (response) {
          return response;
        }
        cache.add(event.request);
        return fetch(event.request);
      })
    })
}

self.addEventListener('fetch', onFetchRequest);