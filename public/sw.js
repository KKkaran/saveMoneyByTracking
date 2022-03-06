console.log("SW file linked nows!!!")
const app = 'Budget Tracker';     
const version = 'v1';
const cacheName = app + version;

self.addEventListener("install",e=>{
    e.waitUntil(
        caches.open(version)
            .then(cache=>{
                cache.addAll([
                    "/",
                    "./index.html",
                    "./js/index.js",
                    "./js/indexedDb.js",
                    "./css/styles.css",
                    "./icons/icon-72x72.png",
                    "./icons/icon-96x96.png",
                    "./icons/icon-128x128.png",
                    "./icons/icon-144x144.png",
                    "./icons/icon-152x152.png",
                    "./icons/icon-192x192.png",
                    "./icons/icon-384x384.png",
                    "./icons/icon-512x512.png"
                ])
                console.log("assets cached")
            })
            .catch(er=>{
                console.log("Some error installing SW")
            })
    )
})

//service worker getting activated
self.addEventListener('activate', function (e) {
    e.waitUntil(
      caches.keys().then(function (list) {
        let cacheKeeplist = list.filter(function (key) {
          return key.indexOf(app);
        });
            cacheKeeplist.push(cacheName);
            // returns a promise that resolves once all old versions of the cache have been deleted 
            return Promise.all(list.map(function (key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                console.log('deleting cache : ' + list[i] );
                return caches.delete(list[i]);
                }
            })
        );
    })
    )
  });

//service worker intercepting fetch requests
self.addEventListener("fetch",e=>{
    console.log("intercepted")

    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { 
              console.log('responding with cache : ' + e.request.url)
              return request
            } else {    
              console.log('file is not cached, fetching : ' + e.request.url)
              return fetch(e.request)
            }
    )
})