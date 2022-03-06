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
                    "./js/indexedDb.js"
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
          return key.indexOf(application);
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
        caches.match(e.request)
            .then(res=>{
                console.log("FOund the request")
                return res || e.request
            })
    )
})