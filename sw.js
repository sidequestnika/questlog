/* Offline-Helfer für Questlog.
   Erst das Netz fragen (dann sind Änderungen sofort da), bei fehlender
   Verbindung aus dem Zwischenspeicher liefern. Deine Quests liegen NICHT
   hier drin, sondern im Speicher des Browsers — die fasst diese Datei nie an. */

const SPEICHER = "questlog-2026-08-22b";
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

/* Erst das Netz, aber nicht endlos.

   Vorher galt: fragen, und nur wenn fetch SCHEITERT, den Zwischenspeicher
   nehmen. Der schlimme Fall ist aber nicht "kein Netz" — da scheitert fetch
   sofort. Der schlimme Fall ist schwacher Empfang: dann haengt fetch auf dem
   iPhone gern zwanzig Sekunden, bevor es aufgibt, und solange steht die App
   weiss da. Genau dann ist ein Planer am wenigsten wert.

   Also ein Wettlauf: antwortet das Netz binnen NETZ_GEDULD nicht, gewinnt der
   Zwischenspeicher. Die frische Fassung wird trotzdem abgelegt, sobald sie
   ankommt — der naechste Start hat sie dann. Bei gutem Netz aendert sich
   nichts: eine Ruecksprache mit GitHub dauert ein paar hundert Millisekunden,
   Aenderungen sind also weiterhin sofort da. */
const NETZ_GEDULD = 1500;

function ausSpeicher(anfrage){
  return caches.match(anfrage).then(treffer => treffer || caches.match("./index.html"));
}

self.addEventListener("fetch", e=>{
  if(e.request.method !== "GET") return;
  e.respondWith(new Promise(fertig=>{
    let raus = false;
    const gib = antwort => { if(!raus){ raus = true; fertig(antwort); } };

    /* Wenn nichts im Speicher liegt (allererster Start), NICHT antworten —
       dann muss der Wettlauf weiterlaufen, bis das Netz liefert. */
    const uhr = setTimeout(()=>{
      ausSpeicher(e.request).then(treffer => { if(treffer) gib(treffer); }).catch(()=>{});
    }, NETZ_GEDULD);

    fetch(e.request).then(antwort=>{
      clearTimeout(uhr);
      /* Nur Gelungenes ablegen: ein 404 im Zwischenspeicher haelt sich sonst
         hartnaeckiger als der Fehler, der ihn ausgeloest hat. */
      if(antwort && antwort.ok){
        const kopie = antwort.clone();
        caches.open(SPEICHER).then(c => c.put(e.request, kopie)).catch(()=>{});
      }
      gib(antwort);
    }).catch(()=>{
      clearTimeout(uhr);
      ausSpeicher(e.request).then(treffer => gib(treffer || Response.error())).catch(()=> gib(Response.error()));
    });
  }));
});
