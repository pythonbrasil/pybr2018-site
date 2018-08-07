importScripts("/precache-manifest.fba9df16dd7955334f908402f0415dd6.js", "https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

const CACHE_VERSION = 'v6';
const initialCache = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css?family=Advent+Pro:500,600,700',
  'https://fonts.googleapis.com/css?family=Nunito:300,400,600,700',
].concat(self.__precacheManifest.map(item => item.url));

function onInstall(event) {
  console.log('Service Worker registered');
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      cache.addAll(initialCache);
    })
  );
}

self.addEventListener('install', onInstall);

function onFetch(event) {
  const isFileResource = /(\.[a-z]*$)/;
  event.respondWith(
    caches.open(CACHE_VERSION).then(cache => {
      if (event.request.url.match(isFileResource) || event.request.url.contains('fonts')) {
        return retrieveFromCache({ event, cache })
          .catch(fetchAndCache)
      }
      return fetchAndCache({ event, cache })
        .catch((() => retrieveFromCache({ event, cache })));
    })
  )
}

function fetchAndCache({ event, cache }) {
  console.log(`Adding resource ${event.request.url} to the cache.`);
  return fetch(event.request)
    .then(response => {
      if (response.ok) {
        cache.add(event.request);
        return response;
      }
      console.log(`Fetch for resource ${event.request.url} was not 200 OK`);
      return Promise.reject()
    });
}

function retrieveFromCache({ event, cache }) {
  return cache.match(event.request).then(request => {
    if (request) {
      console.log(`Resource ${request.url} retrieved from cache`);
      return request;
    }

    console.log(`Resource ${event.request.url} not in cache.`);
    return Promise.reject({ event, cache });
  })
}

self.addEventListener('fetch', onFetch);

