const VERSION = "v2";

self.addEventListener("install", event =>
  event.waitUntil(installServiceWorker())
);

async function installServiceWorker() {
  log("Service Worker installation started ");
  const cache = await caches.open(getCacheName());
  return cache.addAll([
    "/",
    "/index.html",
    "/about.html",
    "/css/style.css",
    "/images/icons/icon-32.png",
    "/images/icons/icon-64.png",
    "/images/icons/icon-128.png",
    "/images/icons/icon-256.png",
    "/images/icons/icon-512.png",
    "/js/main.js",
    "/manifest.json"
  ]);
}

self.addEventListener("activate", () => activateSW());

async function activateSW() {
  log("Service Worker activated");
  const cacheKeys = await caches.keys();
  cacheKeys.forEach(cacheKey => {
    if (cacheKey !== getCacheName()) {
      caches.delete(cacheKey);
    }
  });
}

self.addEventListener("fetch", event =>
  event.respondWith(cacheThenNetwork(event))
);

async function cacheThenNetwork(event) {
  const cache = await caches.open(getCacheName());
  const cachedResponse = await cache.match(event.request);
  if (cachedResponse) {
    log("Serving From Cache: " + event.request.url);
    return cachedResponse;
  }
  const networkResponse = await fetch(event.request);
  log("Calling network: " + event.request.url);
  return networkResponse;
}

function getCacheName() {
  return "app-cache-" + VERSION;
}

function log(message, ...data) {
  if (data.length > 0) {
    console.log(VERSION, message, data);
  } else {
    console.log(VERSION, message);
  }
}
