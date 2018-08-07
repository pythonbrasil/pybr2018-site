importScripts("/precache-manifest.e652450b7014ba89683d3dad8eb9877f.js", "https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

const CACHE_VERSION = 'v4';
const initialCache = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css?family=Advent+Pro:500,600,700',
  'https://fonts.googleapis.com/css?family=Nunito:300,400,600,700',
].concat(self.__precacheManifest.map(item => item.url));

function onInstall(event) {
  console.log('deu bom');
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      cache.addAll(initialCache);
    })
  );
}

self.addEventListener('install', onInstall);

function onFetch(event) {
  event.respondWith(
    caches.open(CACHE_VERSION).then(cache => (
      cache.match(event.request).then(request => {
        if (request) {
          console.log(`Resource ${request.url} retrieved from cache`);
          return request;
        }
        console.log(`Resource ${event.request.url} not in cache. going to add it now`);
        cache.add(event.request);
        return fetch(event.request);
      })
    )
  ))
}

self.addEventListener('fetch', onFetch);

