/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
*/

const PRECACHE = "taras-v1";
const RUNTIME = "runtime";
const PRECACHE_URLS = [
	".",
	"index.html",
	"build/three.js",
	"js/loaders/ColladaLoader.js",
	"js/controls/OrbitControls.js",
	"js/Detector.js",
	"js/libs/stats.min.js",
	"models/altanka.dae",
	"models/Skrzynia.dae",
	"img/3d.png",
	"img/3d3d-32.png",
	"img/3d3d-128.png",
	"img/3d3d-144.png",
	"img/3d3d-512.png"
	
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
