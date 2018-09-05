importScripts("/precache-manifest.8bbf4207907a60065b95388b0f6c06de.js", "https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

const CACHE_VERSION = 'v10';
const initialCache = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css?family=Advent+Pro:500,600,700',
  'https://fonts.googleapis.com/css?family=Nunito:300,400,600,700',
]
.concat(self.__precacheManifest.map(item => item.url))
.map(url => new Request(url, { redirect: 'follow' }));

const isFileResource = /(\.[a-z]*$)/;

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
  event.respondWith(
    caches.open(CACHE_VERSION).then(cache => {
      if (!event.request.url.endsWith('bundle.js')) {
        if (event.request.url.match(isFileResource) || event.request.url.includes('fonts')) {
          return retrieveFromCache({ event, cache })
            .catch(fetchAndCache)
        }
      }
      return fetchAndCache({ event, cache })
        .catch((() => retrieveFromCache({ event, cache })));
    })
  )
}

function fetchAndCache({ event, cache }) {
  console.log(`Adding resource ${event.request.url} to the cache.`);
  let url = event.request.url;
  if (!url.match(isFileResource) && !url.endsWith('/') && !url.includes('google') && !event.request.url.includes('fonts')) {
    url = url.concat('/');
  }
  const request = new Request(
    url,
    {credentials: !url.includes('fonts') ? event.request.credentials : 'omit', redirect: 'follow' }
  );
  return fetch(request)
    .then(response => {
      if (response.ok) {
        cache.add(request);
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

