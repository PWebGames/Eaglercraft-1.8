// service-worker.js

const CACHE_NAME = "eaglercraft-static-cache-v1";
const STATIC_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Cache only static files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve static files from cache, let everything else go to network
self.addEventListener("fetch", (event) => {
  if (STATIC_FILES.includes(new URL(event.request.url).pathname)) {
    event.respondWith(
      caches.match(event.request).then((resp) => resp || fetch(event.request))
    );
  } else {
    // For all other requests (like .pack.gz), just go to network
    event.respondWith(fetch(event.request));
  }
});
