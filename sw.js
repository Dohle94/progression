// Minimaler Service Worker: legt die App-Dateien im Cache ab, damit sie offline startet.
// Bei jeder Änderung an den Dateien die Versionsnummer unten erhöhen, sonst bleibt die alte Version im Cache.
const CACHE = "progression-v4";
const FILES = ["./", "./index.html", "./manifest.webmanifest"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
