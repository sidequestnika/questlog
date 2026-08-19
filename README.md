# Questlog

Ein Tagesplaner fürs iPhone, gebaut um ADHS herum — mit einer Mainquest, drei
Sidequests und ein paar Botengängen pro Tag. Mehr passt bewusst nicht rein.

**Hier liegt nur der Bauplan der App.** Quests, Gefährten und Geburtstage werden
niemals hierher hochgeladen — die bleiben im Speicher des Telefons.

## Was drin steckt

| Datei | wofür |
|---|---|
| `index.html` | die ganze App: Aufbau, Aussehen, Verhalten |
| `sw.js` | Offline-Helfer — lässt die App ohne Internet starten |
| `manifest.webmanifest` | Name, Farben und Symbol fürs Home-Bildschirm-Symbol |
| `icon-*.png` | das Symbol, aus `symbol.js` gemalt |

## Leitplanken

Die Gestaltung folgt ein paar Regeln, die nicht aus Geschmack kommen, sondern aus
dem, was bei ADHS nachweislich hilft — beim Weiterbauen also nicht aus Versehen
kippen:

- **Kein Rot, keine Überfälligkeits-Zähler, keine Serien**, die reißen können.
- **Harte Obergrenze pro Tag**: 1 Mainquest, 3 Sidequests, 5 Botengänge.
  Was nicht reinpasst, wird nicht klein angezeigt, sondern gar nicht.
- **Sortiert wird nach Gefühl, nicht nach Wichtigkeit** (🔥 / 😐 / 🧱),
  und nie zwei zähe Sachen hintereinander.
- **Belohnung sofort**: Gold nach jeder Quest, gelegentlich ein Bonuswurf,
  einlösbar gegen den eigenen Proviant.
- **Der Abend zeigt zuerst das Geschaffte**, nie das Liegengebliebene.
- **Geburtstage brauchen Vorlauf** (14 / 3 / 0 Tage) — am Tag selbst ist es zu spät.

## Sicherung

Im *Rastplatz* gibt es „Alles kopieren". Der Text, der dabei entsteht, ist die
komplette Sicherung und lässt sich über „Sicherung einspielen" zurückholen.
