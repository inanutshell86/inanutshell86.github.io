const cacheName = "v2";

// Call Install Event
self.addEventListener("install", e => {
  console.log("Service Worker: Installed");
});

// Call Activate Event
self.addEventListener("activate", e => {
  console.log("Service Worker: Activated");
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
// self.addEventListener("fetch", e => {
//   console.log("Service Worker: Fetching");
//   e.respondWith(
//     fetch(e.request)
//       .then(res => {
//         // Make copy/clone of response
//         const resClone = res.clone();
//         // Open cahce
//         caches.open(cacheName).then(cache => {
//           // Add response to cache
//           cache.put(e.request, resClone);
//         });
//         return res;
//       })
//       .catch(err => caches.match(e.request).then(res => res))
//   );
// });

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(e.request).then(response => {
        return (
          response ||
          fetch(e.request).then(response => {
            const responseClone = response.clone();
            cache.put(e.request, responseClone);
          })
        );
      });
    })
  );
});
