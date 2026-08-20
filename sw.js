/* Offline-Helfer für Questlog.
   Erst das Netz fragen (dann sind Änderungen sofort da), bei fehlender
   Verbindung aus dem Zwischenspeicher liefern. Deine Quests liegen NICHT
   hier drin, sondern im Speicher des Browsers — die fasst diese Datei nie an. */

const SPEICHER = "questlog-2026-08-20s";
const DATEIEN = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(SPEICHER)
      .then(c => c.addAll(DATEIEN))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys()
      .then(namen => Promise.all(namen.filter(n => n !== SPEICHER).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e=>{
  if(e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(antwort => {
        const kopie = antwort.clone();
        caches.open(SPEICHER).then(c => c.put(e.request, kopie)).catch(()=>{});
        return antwort;
      })
      .catch(() =>
        caches.match(e.request).then(treffer => treffer || caches.match("./index.html"))
      )
  );
});
