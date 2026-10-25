import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

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

export function findEdge() {
  for (const c of EDGE_CANDIDATES) if (fs.existsSync(c)) return c;
  return null;
}

export function edgePrintToPdf(html) {
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
