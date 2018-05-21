"use strict";
const cachNR = 38;
var PRECACHE = 'pre_14all_'+(cachNR+0);
var RUNTIME  = 'off_14all_'+(cachNR+1);
//console.log(PRECACHE,RUNTIME);
const PRECACHE_URLS = [
	"/14all/index.html",
	"/14all/strony/3d/index.html",
	"/14all/strony/pogoda/index.html",
	"/14all/strony/radio/index.html",
	"/14all/strony/links/index.html",
	"/14all/strony/todo/index.html",
	"/14all/strony/todo/index.css",
	"/14all/strony/todo/bundle.js",
	"/14all/strony/todo/base.js",
	"/14all/strony/todo/base.css",
	"/14all/strony/3d/js/build/three.js",
	"/14all/strony/3d/js/loaders/ColladaLoader.js",
	"/14all/strony/3d/js/controls/OrbitControls.js",
	"/14all/strony/3d/js/Detector.js",
	"/14all/strony/3d/js/libs/stats.min.js",
	"/14all/js/14all.js",
	"/14all/js/ajax.js",
	"/14all/css/14all.css",
	"/14all/css/layout.css",
	"/14all/css/mdb.min.css",
	"/14all/css/home.svg",
	"/14all/css/pogoda.svg",
	"/14all/css/radio.svg",
	"/14all/css/todo.svg",
	"/14all/css/links.svg",
	"/14all/css/3d.svg",
	"/14all/strony/3d/models/altanka.dae",
	"/14all/strony/3d/models/kosiarka.dae",
	"/14all/strony/3d/models/Skrzynia.dae",
	"/14all/strony/3d/models/Grill.dae",
	"/14all/strony/3d/models/Skrzynia/Drewno.jpg",
	"/14all/strony/3d/models/altanka/Roofing_Shingles_GAF_Estates.jpg",
	"https://znakzorro.github.io/14all/img/3d.png",
	"/14all/img/3d.png",
	"/14all/img/3d-32.png",
	"/14all/img/3d-72.png",
	"/14all/img/3d-96.png",	
	"/14all/img/3d-128.png",
	"/14all/img/3d-144.png",
	"/14all/img/3d-256.png",
	"/14all/img/3d-512.png",
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
