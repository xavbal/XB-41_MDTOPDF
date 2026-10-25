// Records a scripted walkthrough of the mdfolio UI and renders it as GIF + MP4 (horizontal and 9:16).
// Usage: npm install && npm run demo   (needs Microsoft Edge and ffmpeg on PATH)
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(HERE, "out");
const DEMO_MD = path.join(HERE, "demo.md");
const PORT = 4199;
const URL = `http://localhost:${PORT}`;
const W = 1280, H = 800;

fs.mkdirSync(OUT, { recursive: true });

async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(`${URL}/api/fonts`)).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("mdfolio server did not start");
}

async function timedConvert(options) {
  const t0 = performance.now();
  const res = await fetch(`${URL}/api/convert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown: fs.readFileSync(DEMO_MD, "utf8"), options, filename: "demo.md" }),
  });
  if (!res.ok) throw new Error(`convert failed: ${res.status} ${await res.text()}`);
  const pdf = Buffer.from(await res.arrayBuffer());
  return { pdf, ms: Math.round(performance.now() - t0) };
}

const server = spawn(process.execPath, [path.join(ROOT, "src/server.mjs")], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: "ignore",
});

try {
  await waitForServer();

  // Real PDFs for the reel's "result" shots, plus an honest timing figure.
  for (const theme of ["claro", "sepia", "oscuro"]) {
    const { pdf, ms } = await timedConvert({ theme, font: "Georgia", fontSize: 11 });
    fs.writeFileSync(path.join(OUT, `demo-${theme}.pdf`), pdf);
    console.log(`PDF ${theme}: ${pdf.length} bytes in ${ms} ms`);
  }

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir: OUT, size: { width: W, height: H } },
  });
  const page = await context.newPage();
  const pause = (ms) => page.waitForTimeout(ms);

  await page.goto(URL);
  await page.waitForSelector("#font option", { state: "attached" });
  await pause(1200);

  await page.setInputFiles("#file", DEMO_MD);
  await page.waitForFunction(() => document.querySelector("#preview").srcdoc.length > 0);
  await pause(1800);

  for (const [sel, value] of [
    ["#font", "Georgia"], ["#theme", "sepia"], ["#theme", "oscuro"],
    ["#font", "Garamond"], ["#theme", "claro"], ["#fontSize", "12"],
  ]) {
    if (sel === "#fontSize") await page.fill(sel, value), await page.dispatchEvent(sel, "change");
    else await page.selectOption(sel, value);
    await pause(1600);
  }

  const frame = page.frameLocator("#preview");
  await frame.locator("table").scrollIntoViewIfNeeded();
  await pause(1500);
  await frame.locator("pre").scrollIntoViewIfNeeded();
  await pause(1500);

  await page.hover("#export");
  await pause(1200);

  const video = page.video();
  await context.close();
  await browser.close();

  const raw = path.join(OUT, "demo-raw.webm");
  fs.renameSync(await video.path(), raw);

  const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
  ff(["-i", raw, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", path.join(OUT, "demo.mp4")]);
  ff(["-i", raw, "-vf",
    "fps=12,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4",
    path.join(OUT, "demo.gif")]);
  // 9:16 for Reels/TikTok: UI centred on a dark canvas, leaving room for captions top and bottom.
  ff(["-i", raw, "-vf", "scale=1080:-1:flags=lanczos,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0f1115",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", path.join(OUT, "demo-vertical.mp4")]);

  console.log(`Done -> ${OUT}`);
} finally {
  server.kill();
}
