/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
*/

const PRECACHE = "taras-v7";
const RUNTIME = "runtime-v1";
const PRECACHE_URLS = [
	"./",
	"./build/three.js",
	"./js/loaders/ColladaLoader.js",
	"./js/controls/OrbitControls.js",
	"./js/Detector.js",
	"./js/libs/stats.min.js",
	"/14all/js/14all.js",
	"/14all/js/ajax.js",
	"/14all/css/home.svg",
	"/14all/css/14all.css",
	"/14all/css/mdb.min.css",
	"/14all/strony/todo/index.css",
	"/14all/strony/todo/index.html",
	"/14all/strony/todo/bundle.js",
	"/14all/strony/todo/base.js",
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
