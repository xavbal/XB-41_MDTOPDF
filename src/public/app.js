const $ = (id) => document.getElementById(id);
const drop = $("drop");
const fileInput = $("file");
const fileinfo = $("fileinfo");
const statusEl = $("status");

let currentMarkdown = null;
let currentName = "documento";

function setStatus(msg, kind = "") {
  statusEl.textContent = msg;
  statusEl.className = "status" + (kind ? " " + kind : "");
}

function enableActions(on) {
  $("export").disabled = !on;
  $("exportNoEmoji").disabled = !on;
  $("exportHtml").disabled = !on;
  $("exportTxt").disabled = !on;
  $("refresh").disabled = !on;
}

const THEME_LABELS = { claro: "Claro", oscuro: "Oscuro", sepia: "Sepia" };

function getOptions(noEmojis) {
  return {
    font: $("font").value,
    fontSize: parseFloat($("fontSize").value) || 11,
    pageSize: $("pageSize").value,
    margins: $("margins").value,
    theme: $("theme").value,
    noEmojis: !!noEmojis,
    title: currentName,
  };
}

async function loadFonts() {
  try {
    const { fonts, themes } = await (await fetch("/api/fonts")).json();
    $("font").innerHTML = fonts.map((f) => `<option value="${f}">${f}</option>`).join("");
    $("theme").innerHTML = (themes || ["claro"])
      .map((t) => `<option value="${t}">${THEME_LABELS[t] || t}</option>`)
      .join("");
  } catch {
    $("font").innerHTML = '<option value="Segoe UI">Segoe UI</option>';
    $("theme").innerHTML = '<option value="claro">Claro</option>';
  }
}

async function preview() {
  if (currentMarkdown == null) return;
  setStatus("Generando vista previa...", "busy");
  try {
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: currentMarkdown, options: getOptions($("font").dataset.noEmoji === "1") }),
    });
    const html = await res.text();
    $("preview").srcdoc = html;
    setStatus("Vista previa lista.", "ok");
  } catch (e) {
    setStatus("Error en la vista previa: " + e.message, "err");
  }
}

async function exportPdf(noEmojis) {
  if (currentMarkdown == null) return;
  setStatus(noEmojis ? "Exportando PDF sin emojis..." : "Exportando PDF...", "busy");
  enableActions(false);
  try {
    const res = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: currentMarkdown, options: getOptions(noEmojis), filename: currentName }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = currentName + (noEmojis ? "_sin-emojis" : "") + ".pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    setStatus("PDF descargado: " + a.download, "ok");
  } catch (e) {
    setStatus("Error al exportar: " + e.message, "err");
  } finally {
    enableActions(true);
  }
}

async function exportHtml() {
  if (currentMarkdown == null) return;
  setStatus("Exportando HTML...", "busy");
  enableActions(false);
  try {
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: currentMarkdown, options: getOptions($("font").dataset.noEmoji === "1") }),
    });
    if (!res.ok) throw new Error(res.statusText);
    const html = await res.text();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = currentName + ".html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    setStatus("HTML descargado: " + a.download, "ok");
  } catch (e) {
    setStatus("Error al exportar HTML: " + e.message, "err");
  } finally {
    enableActions(true);
  }
}

function exportTxt() {
  if (currentMarkdown == null) return;
  setStatus("Exportando Texto Plano...", "busy");
  try {
    const text = currentMarkdown
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[#*`~_]/g, '');
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = currentName + ".txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    setStatus("TXT descargado: " + a.download, "ok");
  } catch (e) {
    setStatus("Error al exportar TXT: " + e.message, "err");
  }
}

function loadFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    currentMarkdown = reader.result;
    currentName = file.name.replace(/\.(md|markdown|txt)$/i, "") || "documento";
    fileinfo.textContent = "✓ " + file.name;
    enableActions(true);
    preview();
  };
  reader.readAsText(file, "utf-8");
}

["dragenter", "dragover"].forEach((ev) =>
  drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("hover"); })
);
["dragleave", "drop"].forEach((ev) =>
  drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("hover"); })
);
drop.addEventListener("drop", (e) => loadFile(e.dataTransfer.files[0]));
$("browse").addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => loadFile(e.target.files[0]));

$("export").addEventListener("click", () => exportPdf(false));
$("exportHtml").addEventListener("click", () => exportHtml());
$("exportTxt").addEventListener("click", () => exportTxt());
$("exportNoEmoji").addEventListener("click", () => exportPdf(true));
$("refresh").addEventListener("click", () => preview());
["font", "fontSize", "pageSize", "margins", "theme"].forEach((id) =>
  $(id).addEventListener("change", () => preview())
);

loadFonts();
setStatus("Esperando un archivo .md…");
