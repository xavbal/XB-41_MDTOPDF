const $ = (id) => document.getElementById(id);
const drop = $("drop");
const fileInput = $("file");
const fileinfo = $("fileinfo");
const statusEl = $("status");

let currentMarkdown = null;
let currentName = "documento";
let currentLang = localStorage.getItem("mdfolio_lang") || "es";

const I18N = {
  es: {
    sub: "Arrastra un <code>.md</code>, ajusta la tipografía y exporta a PDF.",
    dropTitle: "Arrastra aquí tu archivo .md",
    dropOr: "o",
    dropBrowse: "selecciónalo",
    labelFont: "Tipografía",
    labelTheme: "Tema",
    labelSize: "Tamaño (pt)",
    labelPage: "Página",
    optLetter: "Carta",
    labelMargins: "Márgenes",
    optMarginNormal: "Normales",
    optMarginNarrow: "Estrechos",
    optMarginWide: "Amplios",
    btnExport: "Exportar PDF",
    btnExportHtml: "Exportar HTML",
    btnExportTxt: "Exportar TXT",
    btnExportNoEmoji: "PDF sin emojis",
    btnRefresh: "Actualizar vista",
    previewHead: "Vista previa",
    statusWaiting: "Esperando un archivo .md…",
    statusGeneratingPreview: "Generando vista previa...",
    statusPreviewReady: "Vista previa lista.",
    statusPreviewError: "Error en la vista previa: ",
    statusExportingPdf: "Exportando PDF...",
    statusExportingPdfNoEmoji: "Exportando PDF sin emojis...",
    statusPdfSaved: "PDF guardado: ",
    statusExportingHtml: "Exportando HTML...",
    statusHtmlSaved: "HTML guardado: ",
    statusExportingTxt: "Exportando Texto Plano...",
    statusTxtSaved: "TXT guardado: ",
    statusCanceled: "Guardado cancelado.",
    statusExportError: "Error al exportar: ",
    themes: { claro: "Claro", oscuro: "Oscuro", sepia: "Sepia" },
  },
  ca: {
    sub: "Arrossega un <code>.md</code>, ajusta la tipografia i exporta a PDF.",
    dropTitle: "Arrossega aquí el teu fitxer .md",
    dropOr: "o",
    dropBrowse: "selecciona'l",
    labelFont: "Tipografia",
    labelTheme: "Tema",
    labelSize: "Mida (pt)",
    labelPage: "Pàgina",
    optLetter: "Carta",
    labelMargins: "Marges",
    optMarginNormal: "Normals",
    optMarginNarrow: "Estrets",
    optMarginWide: "Amples",
    btnExport: "Exportar PDF",
    btnExportHtml: "Exportar HTML",
    btnExportTxt: "Exportar TXT",
    btnExportNoEmoji: "PDF sense emojis",
    btnRefresh: "Actualitzar vista",
    previewHead: "Vista prèvia",
    statusWaiting: "Esperant un fitxer .md…",
    statusGeneratingPreview: "Generant vista prèvia...",
    statusPreviewReady: "Vista prèvia a punt.",
    statusPreviewError: "Error a la vista prèvia: ",
    statusExportingPdf: "Exportant PDF...",
    statusExportingPdfNoEmoji: "Exportant PDF sense emojis...",
    statusPdfSaved: "PDF desat: ",
    statusExportingHtml: "Exportant HTML...",
    statusHtmlSaved: "HTML desat: ",
    statusExportingTxt: "Exportant Text Pla...",
    statusTxtSaved: "TXT desat: ",
    statusCanceled: "Desat cancel·lat.",
    statusExportError: "Error en exportar: ",
    themes: { claro: "Clar", oscuro: "Fosc", sepia: "Sèpia" },
  },
  de: {
    sub: "Ziehe eine <code>.md</code>-Datei hierher, passe die Typografie an und exportiere als PDF.",
    dropTitle: "Ziehe deine .md-Datei hierher",
    dropOr: "oder",
    dropBrowse: "auswählen",
    labelFont: "Schriftart",
    labelTheme: "Design",
    labelSize: "Größe (pt)",
    labelPage: "Seite",
    optLetter: "US-Letter",
    labelMargins: "Seitenränder",
    optMarginNormal: "Normal",
    optMarginNarrow: "Schmal",
    optMarginWide: "Breit",
    btnExport: "PDF exportieren",
    btnExportHtml: "HTML exportieren",
    btnExportTxt: "TXT exportieren",
    btnExportNoEmoji: "PDF ohne Emojis",
    btnRefresh: "Vorschau aktualisieren",
    previewHead: "Vorschau",
    statusWaiting: "Warte auf eine .md-Datei…",
    statusGeneratingPreview: "Vorschau wird erstellt...",
    statusPreviewReady: "Vorschau bereit.",
    statusPreviewError: "Fehler in der Vorschau: ",
    statusExportingPdf: "PDF wird exportiert...",
    statusExportingPdfNoEmoji: "PDF ohne Emojis wird exportiert...",
    statusPdfSaved: "PDF gespeichert: ",
    statusExportingHtml: "HTML wird exportiert...",
    statusHtmlSaved: "HTML gespeichert: ",
    statusExportingTxt: "Reiner Text wird exportiert...",
    statusTxtSaved: "TXT gespeichert: ",
    statusCanceled: "Speichern abgebrochen.",
    statusExportError: "Exportfehler: ",
    themes: { claro: "Hell", oscuro: "Dunkel", sepia: "Sepia" },
  },
  ja: {
    sub: "<code>.md</code> ファイルをドラッグし、フォントを調整してPDFに書き出します。",
    dropTitle: "ここに .md ファイルをドラッグ",
    dropOr: "または",
    dropBrowse: "ファイルを選択",
    labelFont: "フォント",
    labelTheme: "テーマ",
    labelSize: "サイズ (pt)",
    labelPage: "用紙サイズ",
    optLetter: "レター",
    labelMargins: "余白",
    optMarginNormal: "標準",
    optMarginNarrow: "狭い",
    optMarginWide: "広い",
    btnExport: "PDF を書き出す",
    btnExportHtml: "HTML を書き出す",
    btnExportTxt: "TXT を書き出す",
    btnExportNoEmoji: "絵文字なし PDF",
    btnRefresh: "プレビュー更新",
    previewHead: "プレビュー",
    statusWaiting: ".md ファイルを待機中…",
    statusGeneratingPreview: "プレビューを生成中...",
    statusPreviewReady: "プレビュー準備完了。",
    statusPreviewError: "プレビューエラー: ",
    statusExportingPdf: "PDF を書き出し中...",
    statusExportingPdfNoEmoji: "絵文字なし PDF を書き出し中...",
    statusPdfSaved: "PDF を保存しました: ",
    statusExportingHtml: "HTML を書き出し中...",
    statusHtmlSaved: "HTML を保存しました: ",
    statusExportingTxt: "テキストを書き出し中...",
    statusTxtSaved: "TXT を保存しました: ",
    statusCanceled: "保存をキャンセルしました。",
    statusExportError: "書き出しエラー: ",
    themes: { claro: "ライト", oscuro: "ダーク", sepia: "セピア" },
  },
  en: {
    sub: "Drag a <code>.md</code> file, customize typography, and export to PDF.",
    dropTitle: "Drag your .md file here",
    dropOr: "or",
    dropBrowse: "browse file",
    labelFont: "Typography",
    labelTheme: "Theme",
    labelSize: "Size (pt)",
    labelPage: "Page",
    optLetter: "Letter",
    labelMargins: "Margins",
    optMarginNormal: "Normal",
    optMarginNarrow: "Narrow",
    optMarginWide: "Wide",
    btnExport: "Export PDF",
    btnExportHtml: "Export HTML",
    btnExportTxt: "Export TXT",
    btnExportNoEmoji: "PDF without emojis",
    btnRefresh: "Refresh view",
    previewHead: "Preview",
    statusWaiting: "Waiting for a .md file…",
    statusGeneratingPreview: "Generating preview...",
    statusPreviewReady: "Preview ready.",
    statusPreviewError: "Preview error: ",
    statusExportingPdf: "Exporting PDF...",
    statusExportingPdfNoEmoji: "Exporting PDF without emojis...",
    statusPdfSaved: "PDF saved: ",
    statusExportingHtml: "Exporting HTML...",
    statusHtmlSaved: "HTML saved: ",
    statusExportingTxt: "Exporting Plain Text...",
    statusTxtSaved: "TXT saved: ",
    statusCanceled: "Save cancelled.",
    statusExportError: "Export error: ",
    themes: { claro: "Light", oscuro: "Dark", sepia: "Sepia" },
  },
};

function t(key) {
  const dict = I18N[currentLang] || I18N.es;
  return dict[key] || I18N.es[key] || "";
}

function setLanguage(lang) {
  currentLang = I18N[lang] ? lang : "es";
  localStorage.setItem("mdfolio_lang", currentLang);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });

  const dict = I18N[currentLang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      if (key === "sub") {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  const selectedTheme = $("theme").value;
  Array.from($("theme").options).forEach((opt) => {
    if (dict.themes && dict.themes[opt.value]) {
      opt.textContent = dict.themes[opt.value];
    }
  });
  $("theme").value = selectedTheme;

  if (currentMarkdown == null) {
    setStatus(t("statusWaiting"));
  }
}

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

function getOptions(noEmojis) {
  return {
    font: $("font").value,
    fontSize: parseFloat($("fontSize").value) || 11,
    pageSize: $("pageSize").value,
    margins: $("margins").value,
    theme: $("theme").value,
    noEmojis: !!noEmojis,
    title: currentName,
    lang: currentLang,
  };
}

async function saveBlob(blob, suggestedName, description, mime, ext) {
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [{ description, accept: { [mime]: [ext] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return handle.name;
    } catch (e) {
      if (e.name === "AbortError") return null;
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
  return suggestedName;
}

async function loadFonts() {
  try {
    const { fonts, themes } = await (await fetch("/api/fonts")).json();
    $("font").innerHTML = fonts.map((f) => `<option value="${f}">${f}</option>`).join("");
    const dict = I18N[currentLang] || I18N.es;
    $("theme").innerHTML = (themes || ["claro"])
      .map((th) => `<option value="${th}">${dict.themes?.[th] || th}</option>`)
      .join("");
  } catch {
    $("font").innerHTML = '<option value="Segoe UI">Segoe UI</option>';
    $("theme").innerHTML = '<option value="claro">Claro</option>';
  }
}

async function preview() {
  if (currentMarkdown == null) return;
  setStatus(t("statusGeneratingPreview"), "busy");
  try {
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: currentMarkdown, options: getOptions($("font").dataset.noEmoji === "1") }),
    });
    const html = await res.text();
    $("preview").srcdoc = html;
    setStatus(t("statusPreviewReady"), "ok");
  } catch (e) {
    setStatus(t("statusPreviewError") + e.message, "err");
  }
}

async function exportPdf(noEmojis) {
  if (currentMarkdown == null) return;
  setStatus(noEmojis ? t("statusExportingPdfNoEmoji") : t("statusExportingPdf"), "busy");
  enableActions(false);
  try {
    const res = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: currentMarkdown, options: getOptions(noEmojis), filename: currentName }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
    const blob = await res.blob();
    const name = currentName + (noEmojis ? "_sin-emojis" : "") + ".pdf";
    const saved = await saveBlob(blob, name, "Documento PDF", "application/pdf", ".pdf");
    setStatus(saved ? t("statusPdfSaved") + saved : t("statusCanceled"), saved ? "ok" : "");
  } catch (e) {
    setStatus(t("statusExportError") + e.message, "err");
  } finally {
    enableActions(true);
  }
}

async function exportHtml() {
  if (currentMarkdown == null) return;
  setStatus(t("statusExportingHtml"), "busy");
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
    const saved = await saveBlob(blob, currentName + ".html", "Documento HTML", "text/html", ".html");
    setStatus(saved ? t("statusHtmlSaved") + saved : t("statusCanceled"), saved ? "ok" : "");
  } catch (e) {
    setStatus(t("statusExportError") + e.message, "err");
  } finally {
    enableActions(true);
  }
}

async function exportTxt() {
  if (currentMarkdown == null) return;
  setStatus(t("statusExportingTxt"), "busy");
  try {
    const text = currentMarkdown
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[#*`~_]/g, '');
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const saved = await saveBlob(blob, currentName + ".txt", "Texto plano", "text/plain", ".txt");
    setStatus(saved ? t("statusTxtSaved") + saved : t("statusCanceled"), saved ? "ok" : "");
  } catch (e) {
    setStatus(t("statusExportError") + e.message, "err");
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

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

loadFonts().then(() => setLanguage(currentLang));
