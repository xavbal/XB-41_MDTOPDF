import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mdToHtml, FONT_NAMES, THEME_NAMES } from "./converter.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "public");
const PORT = process.env.PORT || 4141;

const EDGE_CANDIDATES = [
  process.env.CHROME_BIN,
  process.env.EDGE_BIN,
  process.env["ProgramFiles(x86)"] &&
    path.join(process.env["ProgramFiles(x86)"], "Microsoft/Edge/Application/msedge.exe"),
  process.env.ProgramFiles &&
    path.join(process.env.ProgramFiles, "Microsoft/Edge/Application/msedge.exe"),
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
  "/usr/bin/microsoft-edge",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

function findEdge() {
  for (const c of EDGE_CANDIDATES) if (fs.existsSync(c)) return c;
  return null;
}

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

function edgePrintToPdf(html) {
  return new Promise((resolve, reject) => {
    const edge = findEdge();
    if (!edge) return reject(new Error("Microsoft Edge no encontrado en este equipo."));
    const id = crypto.randomBytes(8).toString("hex");
    const htmlPath = path.join(os.tmpdir(), `xb41-${id}.html`);
    const pdfPath = path.join(os.tmpdir(), `xb41-${id}.pdf`);
    const profile = path.join(os.tmpdir(), `xb41-profile-${id}`);
    fs.writeFileSync(htmlPath, html, "utf8");

    const fileUrl = "file:///" + htmlPath.replace(/\\/g, "/");
    const args = [
      "--headless",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profile}`,
      "--no-pdf-header-footer",
      `--print-to-pdf=${pdfPath}`,
      fileUrl,
    ];

    const cleanup = () => {
      for (const p of [htmlPath, pdfPath]) {
        try { fs.unlinkSync(p); } catch {}
      }
      try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
    };

    const proc = spawn(edge, args, { windowsHide: true });
    const killTimer = setTimeout(() => proc.kill(), 30000);

    proc.on("error", (e) => { clearTimeout(killTimer); cleanup(); reject(e); });
    proc.on("exit", () => {
      clearTimeout(killTimer);
      let waited = 0;
      const poll = setInterval(() => {
        if (fs.existsSync(pdfPath)) {
          clearInterval(poll);
          try {
            const pdf = fs.readFileSync(pdfPath);
            resolve(pdf);
          } catch (e) { reject(e); }
          finally { cleanup(); }
        } else if ((waited += 200) > 8000) {
          clearInterval(poll);
          cleanup();
          reject(new Error("Edge no genero el PDF."));
        }
      }, 200);
    });
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

server.listen(PORT, () => {
  const edge = findEdge();
  console.log(`\n  XB-41 MDtoPDF  ->  http://localhost:${PORT}`);
  console.log(`  Edge: ${edge || "NO ENCONTRADO (la exportacion a PDF fallara)"}`);
  console.log(`  Ctrl+C para detener.\n`);
});
