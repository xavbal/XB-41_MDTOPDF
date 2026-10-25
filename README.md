# XB-41 · MDtoPDF

[Español](README.md) | [English](README.en.md) | [Català](README.ca.md) | [Deutsch](README.de.md) | [日本語](README.ja.md)

---

Convierte archivos **Markdown → PDF** de calidad de publicación, con interfaz de
arrastrar y soltar, tipografía configurable y opción de exportar sin emojis.

## Cómo arrancar

Doble clic en **`XB-41 MDtoPDF.bat`** (instala dependencias la primera vez, abre
el navegador en `http://localhost:4141` y deja el servidor corriendo).

O clonando el repositorio:

```bash
git clone https://github.com/xavbal/XB-41_MDTOPDF.git
cd XB-41_MDTOPDF
npm install   # solo la primera vez
npm start
```

## Uso

1. Arrastra un `.md` a la zona de drop (o pulsa "selecciónalo").
2. Ajusta **tipografía**, tamaño, página y márgenes — la vista previa se actualiza sola.
3. Pulsa **Exportar PDF** o **Exportar sin emojis**. El PDF se descarga.

## Funciones

- Drag & drop de `.md` / `.markdown` / `.txt`.
- Selector de tipografía (fuentes del sistema: Segoe UI, Georgia, Cambria, Garamond, etc.).
- **Temas**: Claro, Oscuro y Sepia (afectan a la vista previa y al PDF; el fondo se imprime a sangre completa).
- Tamaño de fuente, tamaño de página (A4/Carta/Legal) y márgenes ajustables.
- Exportar a **PDF**, **PDF sin emojis**, **HTML** y **TXT**, con **diálogo "Guardar como"** para elegir carpeta y nombre (vía File System Access API; si el navegador no la soporta, descarga a la carpeta por defecto).
- Vista previa en vivo con el mismo motor de render que el PDF.
- Tipografía real: comillas y guiones curvos (`typographer`), numeración de página.

## Arquitectura

- **`src/converter.mjs`** — Markdown→HTML con `markdown-it` (typographer) + CSS de
  impresión parametrizado. Incluye `stripEmojis()`.
- **`src/server.mjs`** — servidor HTTP nativo de Node (sin frameworks). Endpoints:
  `GET /api/fonts`, `POST /api/preview`, `POST /api/convert`. Imprime con
  **Microsoft Edge headless** (motor Chromium ya presente en Windows) usando un
  perfil aislado por conversión.
- **`src/public/`** — interfaz (HTML/CSS/JS, sin dependencias de frontend).

## Requisitos

- Node.js (con npm).
- Microsoft Edge (preinstalado en Windows 11).

## Notas de diseño

- No usa el daemon `browse`+Chromium de gstack: no compila en Windows (bun no
  lanza Playwright Chromium). Edge ya es Chromium, así que da la misma calidad sin
  instalar nada pesado.
- **Gotcha Edge headless**: cada conversión usa `--user-data-dir` propio y espera al
  cierre del proceso. Si no, Edge delega en una instancia ya abierta y devuelve
  antes de renderizar → PDF con página de error `ERR_FILE_NOT_FOUND`.

## Licencia

Distribuido bajo la Licencia MIT. Consulta `LICENSE` para más información.
