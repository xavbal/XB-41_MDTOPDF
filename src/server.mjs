import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mdToHtml, FONT_NAMES, THEME_NAMES } from "./converter.mjs";
import { findEdge, edgePrintToPdf } from "./pdf.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "public");
const PORT = process.env.PORT || 4141;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 25 * 1024 * 1024) reject(new Error("payload too large"));
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res, code, obj) {
  const data = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(data);
}

function safeName(name) {
  return (name || "documento").replace(/[\/\\?%*:|"<>]/g, "_").replace(/\.md$/i, "");
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (req.method === "GET" && url.pathname === "/api/fonts") {
      return sendJson(res, 200, { fonts: FONT_NAMES, themes: THEME_NAMES });
    }

    if (req.method === "POST" && url.pathname === "/api/preview") {
      const { markdown, options } = JSON.parse(await readBody(req));
      const html = mdToHtml(markdown, options || {});
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(html);
    }

    if (req.method === "POST" && url.pathname === "/api/convert") {
      const { markdown, options, filename } = JSON.parse(await readBody(req));
      const html = mdToHtml(markdown, options || {});
      const pdf = await edgePrintToPdf(html);
      const out = safeName(filename) + (options?.noEmojis ? "_sin-emojis" : "") + ".pdf";
      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(out)}"`,
        "Content-Length": pdf.length,
      });
      return res.end(pdf);
    }

    // static
    let pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = path.join(PUBLIC, path.normalize(pathname).replace(/^([/\\])+/, ""));
    if (!filePath.startsWith(PUBLIC)) { res.writeHead(403); return res.end("forbidden"); }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
      return fs.createReadStream(filePath).pipe(res);
    }
    res.writeHead(404);
    res.end("not found");
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
});

// Loopback by default: markdown-it runs with html:true and Edge prints from file://, so a LAN client could
// exfiltrate local files. HOST=0.0.0.0 is only for the Docker image, where the filesystem is the container's.
const HOST = process.env.HOST || "127.0.0.1";
server.listen(PORT, HOST, () => {
  const edge = findEdge();
  console.log(`\n  XB-41 MDtoPDF  ->  http://localhost:${PORT}`);
  console.log(`  Edge: ${edge || "NO ENCONTRADO (la exportacion a PDF fallara)"}`);
  console.log(`  Ctrl+C para detener.\n`);
});
