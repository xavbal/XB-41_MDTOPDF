#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { mdToHtml, FONT_NAMES, THEME_NAMES } from "../src/converter.mjs";
import { findEdge, edgePrintToPdf } from "../src/pdf.mjs";

const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const THEME_ALIASES = { light: "claro", dark: "oscuro", sepia: "sepia" };
const PAGE_SIZES = { a4: "A4", letter: "letter", legal: "legal" };
const MARGINS = { normal: "24mm 22mm 22mm", narrow: "15mm 15mm", wide: "32mm 30mm" };

const HELP = `mdfolio ${pkg.version} — Markdown to typeset PDF

Usage:
  mdfolio <file.md> [more.md ...] [options]

Options:
  -o, --out <path>     Output file (one input) or directory (several inputs).
                       Default: next to each input, same name with .pdf
  -t, --theme <name>   light | dark | sepia                 (default: light)
  -f, --font <name>    Typeface, e.g. Georgia, Garamond     (default: "Segoe UI")
  -s, --size <pt>      Font size in points                  (default: 11)
  -p, --page <size>    a4 | letter | legal                  (default: a4)
  -m, --margins <m>    normal | narrow | wide               (default: normal)
      --no-emoji       Strip emojis before rendering
      --fonts          List available typefaces
  -h, --help           Show this help
  -v, --version        Show version

Examples:
  mdfolio README.md
  mdfolio notes.md --theme sepia --font Georgia
  mdfolio docs/*.md --out pdf/
`;

function fail(msg, code = 2) {
  console.error(`mdfolio: ${msg}`);
  process.exit(code);
}

let parsed;
try {
  parsed = parseArgs({
    allowPositionals: true,
    options: {
      out: { type: "string", short: "o" },
      theme: { type: "string", short: "t", default: "light" },
      font: { type: "string", short: "f", default: "Segoe UI" },
      size: { type: "string", short: "s", default: "11" },
      page: { type: "string", short: "p", default: "a4" },
      margins: { type: "string", short: "m", default: "normal" },
      "no-emoji": { type: "boolean", default: false },
      fonts: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });
} catch (e) {
  fail(`${e.message}\nRun "mdfolio --help" for usage.`);
}

const { values: opt, positionals: inputs } = parsed;

if (opt.help) { process.stdout.write(HELP); process.exit(0); }
if (opt.version) { console.log(pkg.version); process.exit(0); }
if (opt.fonts) { console.log(FONT_NAMES.join("\n")); process.exit(0); }
if (inputs.length === 0) { process.stdout.write(HELP); process.exit(2); }

const theme = THEME_ALIASES[opt.theme.toLowerCase()] ??
  (THEME_NAMES.includes(opt.theme) ? opt.theme : fail(`unknown theme "${opt.theme}" (light, dark, sepia)`));
const font = FONT_NAMES.find((f) => f.toLowerCase() === opt.font.toLowerCase()) ??
  fail(`unknown font "${opt.font}". Run "mdfolio --fonts" to list them.`);
const fontSize = Number(opt.size);
if (!(fontSize >= 6 && fontSize <= 36)) fail(`invalid --size "${opt.size}" (6–36)`);
const pageSize = PAGE_SIZES[opt.page.toLowerCase()] ?? fail(`unknown page size "${opt.page}" (a4, letter, legal)`);
const margins = MARGINS[opt.margins.toLowerCase()] ?? fail(`unknown margins "${opt.margins}" (normal, narrow, wide)`);

if (!findEdge()) {
  fail("no Chromium-based browser found. Install Microsoft Edge or Chrome, or set CHROME_BIN.", 1);
}

function outputPath(input) {
  const name = path.basename(input).replace(/\.(md|markdown|txt)$/i, "") + ".pdf";
  if (!opt.out) return path.join(path.dirname(input), name);
  if (inputs.length === 1 && opt.out.toLowerCase().endsWith(".pdf")) return opt.out;
  return path.join(opt.out, name);
}

let failed = 0;
for (const input of inputs) {
  const t0 = performance.now();
  try {
    const markdown = fs.readFileSync(input, "utf8");
    const html = mdToHtml(markdown, { font, fontSize, theme, pageSize, margins, noEmojis: opt["no-emoji"] });
    const pdf = await edgePrintToPdf(html);
    const out = outputPath(input);
    fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
    fs.writeFileSync(out, pdf);
    const secs = ((performance.now() - t0) / 1000).toFixed(1);
    console.log(`✔ ${out}  (${(pdf.length / 1024).toFixed(0)} KB, ${secs} s)`);
  } catch (e) {
    failed++;
    console.error(`✘ ${input}: ${e.message}`);
  }
}
process.exit(failed ? 1 : 0);
