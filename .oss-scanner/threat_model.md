# Threat Model: XB-41 MDtoPDF

Read by Anthropic's OSS Scanner before auditing this repository. Reports go to the primary contact defined in the project enrollment.

## What this project does

`XB-41 MDtoPDF` is a lightweight web application and service that converts untrusted Markdown input to publication-quality PDFs and HTML. It uses a pure Node.js HTTP server (no external backend frameworks), `markdown-it` for parsing, and a headless Chromium/Edge browser process to render and print the resulting document to PDF.

## Untrusted Input Entry Points

Untrusted input enters through:

1. **Markdown Content (`POST /api/convert`, `POST /api/preview`):**
   - The user supplies raw Markdown via text or file drop.
   - Attack vectors: XSS, script injection into the generated HTML, Server-Side Request Forgery (SSRF) / local file inclusion via `<img>`, `<iframe>`, or CSS `@import` / `url()` executed by the headless browser during PDF printing (`file://` or `http://` probes).
   - Regular expression denial of service (ReDoS) in parsing rules or emoji stripping.

2. **HTTP Requests and Parameters:**
   - Query paths and headers sent to the local HTTP server.
   - `filename` and `options` payload passed in JSON to `/api/convert`.
   - Path traversal in the static file serving handler (`/` and subpaths).

3. **Temporary Files & Process Execution:**
   - Temporary HTML and PDF files created in `os.tmpdir()` (`/tmp` or `%TEMP%`).
   - Command line arguments passed to the Chromium process in `spawn()`.
   - Symlink attacks or race conditions on temporary user data directories.

## Security Boundaries & Severity Expectations

- **Critical:** Remote Code Execution (RCE) via Markdown parsing, prototype pollution, or Chromium argument injection; arbitrary file write/overwrite outside the temp directory.
- **High:** Local File Disclosure / arbitrary file read via the static server or PDF generation (`file://` access); unauthenticated SSRF reaching the local network.
- **Medium:** Path traversal resulting in directory listing/denial of service, unhandled exceptions crashing the Node process (DoS).
