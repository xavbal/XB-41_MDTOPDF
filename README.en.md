# XB-41 · MDtoPDF (English)

[Español](README.md) | [English](README.en.md) | [Català](README.ca.md) | [Deutsch](README.de.md) | [日本語](README.ja.md)

---

Convert **Markdown → PDF** with publication-level quality, intuitive drag & drop interface, configurable typography, and clean emoji-free export.

## Quick Start

Double-click **`XB-41 MDtoPDF.bat`** (installs dependencies on first launch, opens browser at `http://localhost:4141` and runs the server).

Or from terminal:

```bash
git clone https://github.com/xavbal/XB-41_MDTOPDF.git
cd XB-41_MDTOPDF
npm install   # first time only
npm start
```

## Usage

1. Drag a `.md` file into the drop zone (or click "browse file").
2. Adjust **typography**, font size, page size, and margins — the live preview updates automatically.
3. Click **Export PDF** or **PDF without emojis**. Your document downloads immediately.

## Features

- Drag & drop support for `.md`, `.markdown`, and `.txt`.
- Multilingual interface (**English**, **Catalan**, **German**, **Japanese**, **Spanish**).
- Typography selector with international & Japanese font support (Segoe UI, Georgia, Garamond, Yu Gothic, Meiryo, etc.).
- **Themes**: Light, Dark, and Sepia (full-bleed background printing).
- Adjustable page size (A4, Letter, Legal) and margins.
- Export to **PDF**, **PDF without emojis**, **HTML**, and **TXT**.
- Editorial typography: curved quotes, em-dashes (`typographer`), automatic page numbering.

## Architecture

- **`src/converter.mjs`** — Markdown→HTML engine with `markdown-it` (typographer) + parametrized print CSS and CJK typography support.
- **`src/server.mjs`** — Native Node.js HTTP server. Generates PDFs via **headless Microsoft Edge / Chromium**.
- **`src/public/`** — Fast, frameworkless web interface with full i18n support.

## License

Distributed under the MIT License. See `LICENSE` for more information.
