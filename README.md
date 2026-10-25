<div align="center">

# XB-41 · MDtoPDF

**Typeset-quality PDFs from Markdown — in under a second, 100% local, no LaTeX, no bundled browser.**

[![GitHub stars](https://img.shields.io/github/stars/xavbal/XB-41_MDTOPDF?style=flat&logo=github)](https://github.com/xavbal/XB-41_MDTOPDF/stargazers)
[![License: MIT](https://img.shields.io/github/license/xavbal/XB-41_MDTOPDF)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/xavbal/XB-41_MDTOPDF)](https://github.com/xavbal/XB-41_MDTOPDF/commits/main)
[![Node.js](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)](https://nodejs.org)

![Drop a Markdown file, switch typeface and theme, export a PDF](docs/demo.gif)

[English](README.md) | [Español](README.es.md) | [Català](README.ca.md) | [Deutsch](README.de.md) | [日本語](README.ja.md)

</div>

---

## Quickstart

```bash
git clone https://github.com/xavbal/XB-41_MDTOPDF.git && cd XB-41_MDTOPDF && npm install && npm start
```

Then open **http://localhost:4141**, drop a `.md` and click **Export PDF**.
On Windows you can also double-click **`XB-41 MDtoPDF.bat`**.

## Why it's fast and light

Most Markdown→PDF tools either download their own Chromium or need a full TeX distribution.
XB-41 prints through the **Chromium-based Edge that already ships with Windows**, so there is nothing heavy to install.

| | XB-41 | md-to-pdf (Puppeteer) | Pandoc + LaTeX |
|---|---|---|---|
| Time per PDF (2-page doc) | **~0.7 s** | ~2.1 s warm · ~10 s first run | not measured |
| Install footprint | **1.7 MB** of npm deps | 36.5 MB deps + ~1.2 GB browser cache | ~1 GB (MiKTeX) |
| Live preview | ✅ same engine as the PDF | ❌ | ❌ |
| Runs offline | ✅ | ✅ | ✅ |

<sub>Measured on one Windows 11 machine with the same 2-page Markdown file (`promo/demo/demo.md`), 3 runs each, Oct 2026.
XB-41 time is the `/api/convert` round-trip with the server already running.
The md-to-pdf cache size is the whole Puppeteer cache on that machine and may include more than one browser build.</sub>

## Features

- **Real typography** — curly quotes, proper dashes, hyphenation, page numbers.
- **Three themes** — Light, Dark and Sepia, printed full-bleed. [See an example PDF](docs/example-sepia.pdf).
- **15 typefaces** — Georgia, Garamond, Cambria, Segoe UI, Consolas, Yu Gothic, Noto Sans JP…
- **Export without emojis** — one click for formal documents.
- **PDF, HTML and TXT** export with a native "Save as" dialog.
- **A4 / Letter / Legal**, adjustable font size and margins.
- **UI in 5 languages** — English, Español, Català, Deutsch, 日本語.

## Privacy

Everything runs on your machine: no cloud, no account, no telemetry.

## Requirements

- Node.js 18+
- Microsoft Edge (preinstalled on Windows 11) or Chrome/Chromium. Set `CHROME_BIN` for a custom path.

| Platform | Status |
|---|---|
| Windows 11 | ✅ Tested |
| Linux | ⚠️ Experimental (Chromium, used by the CI container) |
| macOS | ⚠️ Experimental (looks for Edge/Chrome in `/Applications`) |

## How it works

| File | Role |
|---|---|
| `src/converter.mjs` | Markdown → HTML with `markdown-it` (typographer) + parametrised print CSS |
| `src/server.mjs` | Zero-framework Node HTTP server; prints with headless Chromium, isolated profile per conversion |
| `src/public/` | The UI — plain HTML/CSS/JS, no frontend dependencies |

## Roadmap

- [ ] CLI: `npx xb41 report.md --theme sepia --font Georgia`
- [ ] Local images next to the `.md`
- [ ] Docker image

Ideas and PRs welcome — [open an issue](https://github.com/xavbal/XB-41_MDTOPDF/issues).

## License

MIT © Xavier Ballester. If XB-41 saved you a LaTeX install, a ⭐ helps others find it.
