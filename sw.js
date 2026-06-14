const CACHE_NAME = "photo-calendar-v1";

const FILES_TO_CACHE = [
  "/Photo-calender-/",
  "/Photo-calender-/index.html",
  "/Photo-calender-/style.css",
  "/Photo-calender-/script.js",
  "/Photo-calender-/manifest.json",
  "/Photo-calender-/quotes.json",
  "/Photo-calender-/images/icon-192.png",
  "/Photo-calender-/images/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
