"use strict";
const cachNR = 6;
var PRECACHE = 'pre_14all_'+(cachNR+0);
var RUNTIME  = 'off_14all_'+(cachNR+1);
//console.log(PRECACHE,RUNTIME);
const PRECACHE_URLS = [
	"./build/three.js",
	"./js/loaders/ColladaLoader.js",
	"./js/controls/OrbitControls.js",
	"./js/Detector.js",
	"./js/libs/stats.min.js",
	"./js/14all.js",
	"./js/ajax.js",
	"./css/14all.css",
	"./css/mdb.min.css",
	"./models/altanka.dae",
	"./models/Skrzynia.dae",
	"./models/Grill.dae",
	"./img/3d.png",
	"./img/3d-32.png",
	"./img/3d-72.png",
	"./img/3d-96.png",	
	"./img/3d-128.png",
	"./img/3d-144.png",
	"./img/3d-256.png",
	"./img/3d-512.png",
	"https://fonts.googleapis.com/css?family=Roboto:100,300,400,400i,900,900i&amp;subset=latin-ext"
	
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
