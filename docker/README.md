# Docker — no aplica (por ahora)

XB-41 imprime el PDF con **Microsoft Edge headless** del host Windows. Edge no se
puede empaquetar en un contenedor Linux, así que esta app se ejecuta de forma
nativa (`XB-41 MDtoPDF.bat` o `npm start`), no en Docker.

Si en el futuro se quiere contenerizar, habría que sustituir Edge por
**Playwright + Chromium** dentro de la imagen (base `mcr.microsoft.com/playwright`)
y cambiar `edgePrintToPdf()` en `src/server.mjs` por `page.pdf()` de Playwright.
