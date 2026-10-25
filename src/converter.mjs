import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";

const EMOJI_RE =
  /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE00}-\u{FE0F}\u{200D}\u{2122}\u{2139}\u{2328}\u{23E9}-\u{23FA}\u{24C2}\u{25AA}-\u{25FE}]/gu;

export function stripEmojis(text) {
  return text
    .replace(EMOJI_RE, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/^([ \t]*[-*])[ \t]+/gm, "$1 ");
}

const FONT_STACKS = {
  "Segoe UI": '"Segoe UI", Helvetica, Arial, sans-serif',
  Calibri: 'Calibri, "Segoe UI", sans-serif',
  Arial: "Arial, Helvetica, sans-serif",
  Verdana: "Verdana, Geneva, sans-serif",
  "Trebuchet MS": '"Trebuchet MS", Helvetica, sans-serif',
  Georgia: 'Georgia, "Times New Roman", serif',
  Cambria: 'Cambria, Georgia, serif',
  "Times New Roman": '"Times New Roman", Times, serif',
  Garamond: 'Garamond, "Book Antiqua", serif',
  "Book Antiqua": '"Book Antiqua", Palatino, serif',
  Consolas: 'Consolas, "Courier New", monospace',
  "Courier New": '"Courier New", Courier, monospace',
  "Yu Gothic": '"Yu Gothic", "YuGothic", "Meiryo", sans-serif',
  Meiryo: 'Meiryo, "Yu Gothic", sans-serif',
  "Noto Sans JP": '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif',
};

export const FONT_NAMES = Object.keys(FONT_STACKS);

const THEMES = {
  claro: {
    page: "#ffffff", text: "#1c1e21", heading: "#111111", h3: "#2a2d31",
    border: "#d8dadd", rule: "#d8dadd", quoteBg: "#f6f8fa", quoteBar: "#8b949e",
    quoteText: "#2d3338", codeBg: "#eceef0", preBg: "#f6f8fa", link: "#0b5fd1",
    thBg: "#f0f2f4", marker: "#6b7280", pageNum: "#999999",
  },
  oscuro: {
    page: "#0f1115", text: "#e6e8ec", heading: "#ffffff", h3: "#c7ccd6",
    border: "#2a2f3a", rule: "#2a2f3a", quoteBg: "#1a2030", quoteBar: "#4c8dff",
    quoteText: "#c8cfdb", codeBg: "#1e222b", preBg: "#171a21", link: "#79b8ff",
    thBg: "#1e222b", marker: "#8b93a3", pageNum: "#7d8694",
  },
  sepia: {
    page: "#f4ecd8", text: "#4a3f2f", heading: "#3a2f1f", h3: "#574832",
    border: "#d8c8a0", rule: "#d8c8a0", quoteBg: "#ece0c4", quoteBar: "#b08d57",
    quoteText: "#5a4d38", codeBg: "#e7dcc2", preBg: "#ece0c4", link: "#8a5a2b",
    thBg: "#e7dcc2", marker: "#917a4f", pageNum: "#9a865d",
  },
};

export const THEME_NAMES = Object.keys(THEMES);

function resolveFont(name) {
  return FONT_STACKS[name] || FONT_STACKS["Segoe UI"];
}

function resolveTheme(name) {
  return THEMES[name] || THEMES.claro;
}

export function mdToHtml(markdown, opts = {}) {
  const {
    font = "Segoe UI",
    fontSize = 11,
    noEmojis = false,
    pageSize = "A4",
    margins = "24mm 22mm 22mm",
    theme = "claro",
    title,
    lang = "es",
  } = opts;

  let src = String(markdown ?? "");
  if (noEmojis) src = stripEmojis(src);

  const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
  md.use(anchor, { tabIndex: false });

  const body = md.render(src);
  const docTitle =
    (title || src.match(/^#\s+(.+)$/m)?.[1] || "documento").replace(/[*_`]/g, "");
  const fontStack = resolveFont(font);
  const t = resolveTheme(theme);
  const baseMono =
    font === "Consolas" || font === "Courier New"
      ? '"Cascadia Code", monospace'
      : 'Consolas, "SFMono-Regular", monospace';

  const css = `
@page { size: ${pageSize}; margin: ${margins};
  @bottom-center { content: counter(page) " / " counter(pages); font-size: 9pt; color: ${t.pageNum}; } }
* { box-sizing: border-box; }
html, body { background: ${t.page}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: ${fontStack}; font-size: ${fontSize}pt; line-height: 1.6;
  color: ${t.text}; margin: 0; hyphens: auto; text-rendering: optimizeLegibility; }
h1,h2,h3,h4 { line-height: 1.25; font-weight: 650; color: ${t.heading}; break-after: avoid; }
h1 { font-size: ${Number(fontSize) * 2}pt; margin: 0 0 .35em; letter-spacing: -.01em; }
h2 { font-size: ${Number(fontSize) * 1.36}pt; margin: 1.6em 0 .5em; padding-bottom: .25em; border-bottom: 1px solid ${t.border}; }
h3 { font-size: ${Number(fontSize) * 1.14}pt; margin: 1.3em 0 .35em; color: ${t.h3}; }
p { margin: .6em 0; }
ul,ol { margin: .5em 0 .8em; padding-left: 1.4em; }
li { margin: .3em 0; break-inside: avoid; }
li::marker { color: ${t.marker}; }
hr { border: none; border-top: 1px solid ${t.rule}; margin: 1.8em 0; }
blockquote { margin: 1.1em 0; padding: .8em 1.1em; background: ${t.quoteBg};
  border-left: 3px solid ${t.quoteBar}; border-radius: 4px; color: ${t.quoteText}; break-inside: avoid; }
blockquote p:first-child { margin-top: 0; } blockquote p:last-child { margin-bottom: 0; }
code { font-family: ${baseMono}; font-size: .9em; background: ${t.codeBg}; padding: .12em .38em; border-radius: 4px; }
pre { background: ${t.preBg}; padding: 1em; border-radius: 6px; overflow-x: auto; }
pre code { background: none; padding: 0; }
a { color: ${t.link}; text-decoration: none; }
table { border-collapse: collapse; margin: 1em 0; width: 100%; }
th,td { border: 1px solid ${t.border}; padding: .45em .7em; text-align: left; }
th { background: ${t.thBg}; }
img { max-width: 100%; break-inside: avoid; }
strong { font-weight: 680; }
`;

  return `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="utf-8"><title>${docTitle}</title>
<style>${css}</style></head>
<body>${body}</body></html>`;
}
