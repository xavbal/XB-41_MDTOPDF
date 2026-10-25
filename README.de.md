# XB-41 · MDtoPDF (Deutsch)

[Español](README.md) | [English](README.en.md) | [Català](README.ca.md) | [Deutsch](README.de.md) | [日本語](README.ja.md)

---

Konvertiert **Markdown → PDF** in veröffentlichungsreifer Qualität mit Drag & Drop-Oberfläche, anpassbarer Typografie und der Option, Dokumente ohne Emojis zu exportieren.

## Starten

Doppelklick auf **`XB-41 MDtoPDF.bat`** (installiert Abhängigkeiten beim ersten Start, öffnet den Browser unter `http://localhost:4141` und lässt den Server im Hintergrund laufen).

Oder über das Terminal:

```bash
git clone https://github.com/xavbal/XB-41_MDTOPDF.git
cd XB-41_MDTOPDF
npm install   # nur beim ersten Mal
npm start
```

## Verwendung

1. Ziehe eine `.md`-Datei in das Drop-Feld (oder klicke auf "auswählen").
2. Passe **Schriftart**, Größe, Seitenformat und Seitenränder an — die Vorschau aktualisiert sich automatisch.
3. Klicke auf **PDF exportieren** oder **PDF ohne Emojis**. Die PDF-Datei wird heruntergeladen.

## Funktionen

- Drag & Drop für `.md`-, `.markdown`- und `.txt`-Dateien.
- Mehrsprachige Benutzeroberfläche (**Deutsch**, **Katalanisch**, **Spanisch**, **Japanisch**, **Englisch**).
- Schriftartenauswahl (Segoe UI, Georgia, Garamond, Yu Gothic, Meiryo usw.).
- **Designs**: Hell, Dunkel und Sepia (vollflächiger Hintergrunddruck).
- Einstellbare Schriftgrößen, Seitenformate (A4, Letter, Legal) und Ränder.
- Export als **PDF**, **PDF ohne Emojis**, **HTML** und **TXT**.
- Echte Drucktypografie: typografische Anführungszeichen und Gedankenstriche (`typographer`), automatische Seitennummerierung.

## Architektur

- **`src/converter.mjs`** — Markdown→HTML mit `markdown-it` + parametrisiertes Druck-CSS und CJK/Japanisch-Unterstützung.
- **`src/server.mjs`** — Nativer Node.js-HTTP-Server (ohne schwere Frameworks). Druckt mit **Microsoft Edge / Chromium headless**.
- **`src/public/`** — Schnelle, reaktive Web-Benutzeroberfläche mit i18n-Unterstützung.

## Lizenz

Veröffentlicht unter der MIT-Lizenz. Weitere Informationen finden Sie in `LICENSE`.
