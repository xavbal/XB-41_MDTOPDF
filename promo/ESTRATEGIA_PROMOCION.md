# XB-41 MDtoPDF — Estrategia de promoción y crecimiento en GitHub

Respuesta a `encargo_claude_code.md` y a las precisiones de Xavi del 25 de octubre de 2026:
- **Sin fotos personales.** Todo el material visual es software: terminal, editor, la app y el PDF.
- README con badges, quickstart de una línea y velocidad frente a herramientas pesadas.
- Textos exactos para r/commandline, r/selfhosted y Show HN.

---

## 0. Auditoría: lo que hay que saber antes de anunciar nada

Verificado en el código, en GitHub y con mediciones del 25 de octubre de 2026:

| Supuesto | Realidad | Qué implica |
|---|---|---|
| "Herramienta de consola" | Al principio era solo una **app web local** (`npm start` → `localhost:4141`). **El CLI `xb41` se añadió el 25 de octubre de 2026 (v1.1.0).** | r/commandline desbloqueado. Se instala desde GitHub (`npm i -g github:xavbal/XB-41_MDTOPDF`); `npx xb41` requiere publicarlo en npm. |
| "Alto rendimiento" | **Medido:** XB-41 tarda ~0,7 s por PDF; `md-to-pdf` (Puppeteer), ~2,1 s en caliente y ~10 s la primera vez. Pandoc + LaTeX no se ha medido (no hay Pandoc instalado). | Se puede decir "~3× más rápido que md-to-pdf en un documento de 2 páginas", nada más general. |
| "Ligera" | **Medido:** 1,7 MB de dependencias npm, porque usa el Edge de Windows. `md-to-pdf`: 36,5 MB + ~1,2 GB de caché de Puppeteer. MiKTeX: ~1 GB. | Es el mejor argumento, y es verdad. |
| "Multiplataforma" | Busca Chrome/Chromium en Linux y macOS, pero **solo está probado en Windows**. `docker/README.md` dice que Docker "no aplica". | Anunciar "Windows; macOS/Linux experimental". **Sin Docker no se publica en r/selfhosted.** |
| "Registrado en el OSS Scanner" | El PR `anthropics/oss-scanner#1128` está **abierto, sin fusionar**. | No mencionarlo hasta que se fusione. |
| Imágenes en el Markdown | Las rutas relativas (`![](img.png)`) **no funcionan**: el HTML se imprime desde `%TEMP%`. | Evitar imágenes locales en las demos. |

### ✅ Bloqueante de seguridad (corregido el 25 de octubre de 2026)
Ahora el servidor escucha solo en `127.0.0.1`; verificado que no responde por la IP de la red local ni por la de Tailscale.
El problema era que `server.listen(PORT)` escuchaba en **todas las interfaces**, no solo en localhost.
Con `markdown-it` en `html: true` y Edge imprimiendo desde `file://` con `--no-sandbox`, alguien de la misma red podría mandar HTML a `/api/convert` y recibir un PDF con archivos locales del equipo.

- Es probable, no lo he explotado.
- Arreglo de una línea: `server.listen(PORT, "127.0.0.1", …)`.
- **Hay que aplicarlo antes de difundir**: un comentario en HN lo encontraría el primer día.

---

## 1. README (aplicado)

- `README.md` → **en inglés**, con:
  - 4 badges de shields.io (estrellas, licencia, último commit, Node ≥18).
  - El GIF de demo arriba.
  - **Quickstart de una sola línea.**
  - Tabla de velocidad y peso frente a md-to-pdf y Pandoc + LaTeX, con la nota de cómo se midió.
  - Privacidad, plataformas con su estado real, roadmap y una llamada a la ⭐ al final.
- El README en español pasa a `README.es.md` (con `git mv`, se conserva el historial). Los enlaces de idioma de los 5 READMEs están actualizados.
- Recursos nuevos: `docs/demo.gif` (grabado con `promo/demo/record-demo.mjs`) y `docs/example-sepia.pdf` (PDF real de muestra).
- `README.en.md` borrado porque duplicaba al nuevo `README.md`.

Además, en GitHub (manual): Settings → Social preview con una captura del tema sepia; añadir los topics `markdown-to-pdf`, `pdf-generator`, `local-first`; publicar la release `v1.0.0`.

---

## 2. Guion del vídeo técnico (100% software, 30–35 s)

**Estética:** fondo oscuro, terminal y editor a pantalla completa, fuente monoespaciada grande (legible en el móvil), cortes al ritmo y sin locución. Subtítulos incrustados. Sirve en dos formatos: vertical 9:16 (Reels/TikTok/Shorts) y horizontal 16:9 (X, GIF del README, HN).

### Versión A — se puede grabar HOY (editor + terminal + app)

| Tiempo | Plano | Texto en pantalla |
|---|---|---|
| 0–3 s | **Gancho.** El editor (VS Code, tema oscuro) con un `.md` técnico (notas de versión con tabla, bloque de código y citas). Corte a ese mismo Markdown impreso con Ctrl+P del navegador: comillas rectas, márgenes genéricos, emojis rotos. | `Markdown → PDF shouldn't need 1 GB of LaTeX.` |
| 3–7 s | Terminal: se teclea `npm start` (tecleo acelerado) y aparece `XB-41 MDtoPDF -> http://localhost:4141`. | `1.7 MB of dependencies.` |
| 7–12 s | Se arrastra el `.md` desde el explorador a la app y la vista previa aparece al instante. | `Drop.` |
| 12–18 s | Tipografía Georgia → Garamond; tema Claro → Sepia → Oscuro. Un corte por cambio. | `Pick a typeface.` |
| 18–22 s | Clic en **Export PDF** y el PDF se abre a pantalla completa. Contador superpuesto: `0.7 s`. | `Export. ~0.7 s.` |
| 22–28 s | Planos cerrados del PDF: comillas curvas, tabla, bloque de código, número de página `1 / 2`. | `Real typography. 100% local. MIT.` |
| 28–35 s | Página de GitHub `xavbal/XB-41_MDTOPDF`, el cursor pulsa **Star** (animación real, sin inventar contador). | `github.com/xavbal/XB-41_MDTOPDF ⭐` |

Material ya generado: `promo/demo/out/` contiene `demo.mp4`, `demo-vertical.mp4` (1080×1920), `demo.gif` y `demo-{claro,sepia,oscuro}.pdf`.
Se graba a mano: el plano del editor, el `npm start` en la terminal, Ctrl+P y GitHub. Con el grabador de Windows (Win+Alt+R) o OBS basta.

Para el formato vertical, recortar al panel de vista previa y ampliarlo, porque la interfaz completa queda pequeña en el móvil.

### Versión B — terminal pura (ya se puede grabar con el CLI)

```
$ xb41 release-notes.md --theme sepia --font Georgia
✔ release-notes.pdf  (370 KB, 0.7 s)
$ start release-notes.pdf
$ xb41 docs/*.md --out pdf/ --theme dark
✔ pdf/intro.pdf  (…)
✔ pdf/api.pdf    (…)
```

| Tiempo | Plano | Texto en pantalla |
|---|---|---|
| 0–3 s | Editor con el `.md` técnico; el cursor salta a la terminal | `Markdown → PDF. One command.` |
| 3–8 s | Se teclea `xb41 release-notes.md --theme sepia --font Georgia` y sale `✔ … 0.7 s` | `0.7 s. No LaTeX.` |
| 8–15 s | `start release-notes.pdf`: el PDF sepia se abre encima, con planos cerrados de la tipografía | `Real typography.` |
| 15–22 s | Lote: `xb41 docs/*.md --out pdf/ --theme dark` y varias líneas `✔` en cascada | `Batch. Scriptable. CI-ready.` |
| 22–28 s | `npm ls` / tamaño de la carpeta: 1,7 MB | `1.7 MB of dependencies.` |
| 28–35 s | GitHub y el botón **Star** | `github.com/xavbal/XB-41_MDTOPDF ⭐` |

Editor a la izquierda, terminal a la derecha y el PDF que se abre encima. Es el formato que funciona en r/commandline y en X para desarrolladores.

---

## 3. Plan de difusión

### 3.0 Orden de lanzamiento
| Paso | Requisito | Canal |
|---|---|---|
| 1 | Arreglo de seguridad + README nuevo + release v1.0.0 | — |
| 2 | Paso 1 hecho | **Show HN** (texto en 3.1) |
| 3 | Paso 1 + **CLI** ✅ (`bin/xb41.mjs`, v1.1.0) | **r/commandline** (3.2) |
| 4 | Paso 1 + **Docker** (Chromium en lugar de Edge, como ya hace `.oss-scanner/Dockerfile`) | **r/selfhosted** (3.3) |

Reglas: leer las normas de cada sitio el mismo día, publicar desde la cuenta personal, contestar a todos los comentarios las primeras 3–4 horas y **no pedir estrellas** en HN ni en Reddit.

### 3.1 Show HN (Hacker News)

**Título** (≤ 80 caracteres):
```
Show HN: XB-41 – Markdown to typeset PDF in ~0.7s, using the browser you have
```
**URL:** `https://github.com/xavbal/XB-41_MDTOPDF`

**Primer comentario** (lo publica el autor nada más enviar):
```
Hi HN, I'm Xavier. I write everything in Markdown, and every time I needed a PDF
for a client I ended up choosing between a browser printout (straight quotes,
generic margins) and a 1 GB LaTeX install.

XB-41 is a small local web app: drop a .md, pick a typeface (Georgia, Garamond,
Cambria…) and a theme (light/dark/sepia), and it prints through the Chromium-based
Edge that already ships with Windows. No bundled browser, so the npm dependencies
are 1.7 MB.

On my machine a 2-page document takes ~0.7 s, vs ~2.1 s with md-to-pdf
(Puppeteer) warm and ~10 s on its first run. The benchmark is tiny and on one
machine, so take it as indicative.

There's also a CLI for scripts and batch jobs: `xb41 docs/*.md --out pdf/`.

Things I'd love feedback on: typography defaults and CLI flags. Windows is tested;
macOS/Linux should work with Chrome/Chromium but are experimental.

MIT, no telemetry, no account.
```

### 3.2 r/commandline (CLI disponible desde la v1.1.0)

**Título:**
```
xb41: Markdown → typeset PDF from the terminal, ~0.7s, no LaTeX, no bundled Chromium
```
**Cuerpo:**
```
I made a small MIT tool that turns Markdown into print-quality PDFs:

    npm i -g github:xavbal/XB-41_MDTOPDF
    xb41 notes.md --theme sepia --font Georgia
    xb41 docs/*.md --out pdf/

- Uses the Chromium you already have (Edge on Windows, Chrome/Chromium elsewhere),
  so dependencies are 1.7 MB instead of a ~1 GB browser download or TeX install
- ~0.7s for a 2-page doc on my machine (md-to-pdf: ~2.1s warm)
- Curly quotes, proper dashes, page numbers, light/dark/sepia themes
- --no-emoji flag for formal documents
- Batch mode, non-zero exit code on failure, so it works in scripts/CI
- Also has a local drag & drop UI if you prefer (npm start)

Repo: https://github.com/xavbal/XB-41_MDTOPDF

Feedback on flags/defaults very welcome.
```

### 3.3 r/selfhosted (cuando exista Docker)

**Título:**
```
XB-41: self-hosted Markdown → PDF converter with live preview and real typography (Docker, MIT)
```
**Cuerpo:**
```
Small self-hosted tool for turning Markdown into clean PDFs without sending
documents to an online converter.

    docker run -p 127.0.0.1:4141:4141 ghcr.io/xavbal/xb41

- Drag & drop UI with live preview (same engine as the PDF)
- 15 typefaces, light/dark/sepia themes, A4/Letter/Legal, page numbers
- Export PDF, PDF without emojis, HTML or TXT
- No account, no telemetry, nothing leaves the container
- Headless Chromium inside the image; ~0.7s per short document

Repo + screenshots: https://github.com/xavbal/XB-41_MDTOPDF
```
⚠️ El comando `docker run` y la imagen `ghcr.io/xavbal/xb41` **todavía no existen**; el texto está listo para cuando se publiquen.

### 3.4 Instagram, como apoyo
- El vídeo de la sección 2 en Reel, con el enlace en la bio apuntando al repo.
- El día del Show HN: una story con sticker de enlace ("live on Hacker News today").
- Expectativa realista: las estrellas llegarán sobre todo de HN y Reddit. Instagram suma visibilidad, no desarrolladores.

### 3.5 Medir
GitHub → Insights → Traffic: *Referring sites* y *Popular content*, a las 24 h y a los 7 días de cada publicación. Repetir solo los canales que traigan visitas.

---

## 4. Demo automatizada (`promo/demo/`)

| Archivo | Qué hace |
|---|---|
| `record-demo.mjs` | Arranca XB-41 en :4199, genera 3 PDF reales cronometrados, graba la interfaz con Playwright sobre Edge (cambios de tipografía y tema) y produce `demo.mp4`, `demo.gif` y `demo-vertical.mp4` (9:16) con ffmpeg |
| `demo.md` | Documento de demo: notas de versión con tabla, código, citas y emojis (sin fotos) |
| `out/` | Salidas (ignoradas por git) |

```powershell
cd E:\XB_ECOSYSTEM\XB-41_MDTOPDF\promo\demo
npm install
npx playwright install ffmpeg   # solo la primera vez
npm run demo
```
Probado el 25 de octubre de 2026: 3 PDF en ~0,65–0,68 s cada uno y un vídeo de 17 s.
