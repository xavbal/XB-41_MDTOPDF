# Release notes — v2.0 🚀

> "Write in Markdown. Ship a PDF that looks typeset."

mdfolio turns plain `.md` files into **print-quality PDFs** — locally, in seconds, with real typography.

## What's new ✨

- Three themes: *Light*, *Dark* and *Sepia* — the background prints full-bleed.
- Curly quotes and proper dashes -- automatically.
- One click to export **without emojis** 🧹 for clients who hate them.
- Page numbers, A4 / Letter / Legal, adjustable margins.

## Export formats

| Format          | Use it for                     |
|-----------------|--------------------------------|
| PDF             | Clients, print, archive        |
| PDF, no emojis  | Formal documents               |
| HTML            | Web, email                     |
| TXT             | Plain-text pipelines           |

## Under the hood

```js
import { mdToHtml } from "./converter.mjs";

const html = mdToHtml(markdown, { font: "Georgia", theme: "sepia" });
// Chromium headless prints it to PDF — no cloud, no account.
```

## Why it exists 💡

Most Markdown-to-PDF tools give you either *ugly defaults* or a *LaTeX install*. mdfolio sits in between: drop a file, pick a typeface, export.

---

MIT licensed · 100% local · github.com/xavbal/mdfolio ⭐
