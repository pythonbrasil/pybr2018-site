const CACHE_VERSION = 'v10';
const initialCache = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css?family=Advent+Pro:500,600,700',
  'https://fonts.googleapis.com/css?family=Nunito:300,400,600,700',
]
.concat(self.__precacheManifest.map(item => item.url))
.map(url => new Request(url, { redirect: 'follow' }));

const isAsset = url => url.match(/(\/assets\/.*$|fonts\.(googleapis|gstatic))|\.css$|\.js$/);
const isDocument = url => url.match(/\/documents\//);
const isGoogleResource = url => url.match(/fonts|google/);
const isTemplate = url =>
  !isDocument(url) && !isAsset(url) && !isGoogleResource(url)
  && !url.endsWith('/') && !url.endsWith('.json') && !url.toLowerCase().endsWith('.md');

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
      if (isAsset(event.request.url)) {
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
  let url = event.request.url;
  if (isTemplate(url)) {
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
  let request = event.request;
  if (isTemplate(event.request.url)) {
    const url = event.request.url + '/';

    request = new Request(
      url,
      {credentials: !url.includes('fonts') ? event.request.credentials : 'omit', redirect: 'follow' }
    );
  }

  return cache.match(request).then(request => {
    if (request) {
      console.log(`Resource ${request.url} retrieved from cache`);
      return request;
    }

    console.log(`Resource ${event.request.url} not in cache.`);
    return Promise.reject({ event, cache });
  })
}

self.addEventListener('fetch', onFetch);
