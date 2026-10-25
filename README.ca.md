# XB-41 · MDtoPDF (Català)

[Español](README.md) | [English](README.en.md) | [Català](README.ca.md) | [Deutsch](README.de.md) | [日本語](README.ja.md)

---

Converteix fitxers **Markdown → PDF** amb qualitat de publicació, interfície d'arrossegar i deixar anar (*drag & drop*), tipografia configurable i opció d'exportar sense emojis.

## Com engegar

Doble clic a **`XB-41 MDtoPDF.bat`** (instal·la dependències la primera vegada, obre el navegador a `http://localhost:4141` i deixa el servidor en funcionament).

O clonant el repositori:

```bash
git clone https://github.com/xavbal/XB-41_MDTOPDF.git
cd XB-41_MDTOPDF
npm install   # només la primera vegada
npm start
```

## Ús

1. Arrossega un fitxer `.md` a la zona de drop (o prem "selecciona'l").
2. Ajusta la **tipografia**, mida, pàgina i marges — la vista prèvia s'actualitza automàticament.
3. Prem **Exportar PDF** o **PDF sense emojis**. El PDF es descarrega a l'instant.

## Funcionalitats

- Suport d'arrossegar i deixar anar per a `.md`, `.markdown` i `.txt`.
- Selector d'idioma a la interfície (**Català**, **Castellà**, **Alemany**, **Japonès**, **Anglès**).
- Selector de tipografia (Segoe UI, Georgia, Cambria, Garamond, Yu Gothic, Meiryo, etc.).
- **Temes**: Clar, Fosc i Sèpia (s'imprimeixen a sang completa).
- Mida de font, format de pàgina (A4 / Carta / Legal) i marges personalitzables.
- Exportació a **PDF**, **PDF sense emojis**, **HTML** i **TXT**.
- Tipografia editorial: cometes i guions corbats (`typographer`), numeració de pàgines automàtica.

## Arquitectura

- **`src/converter.mjs`** — Motor Markdown→HTML amb `markdown-it` (typographer) + CSS d'impressió parametritzat i compatibilitat amb CJK (japonès).
- **`src/server.mjs`** — Servidor HTTP natiu en Node.js (sense frameworks feixucs). Genera PDFs amb **Microsoft Edge / Chromium headless**.
- **`src/public/`** — Interfície web minimalista i reactiva amb suport multilingüe.

## Llicència

Distribuït sota la Llicència MIT. Consulta `LICENSE` per a més informació.
