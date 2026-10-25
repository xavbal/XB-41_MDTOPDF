import assert from "node:assert";
import { mdToHtml, stripEmojis, FONT_NAMES, THEME_NAMES } from "../src/converter.mjs";

console.log("Running XB-41 unit tests...");

// 1. Test stripEmojis
const textWithEmoji = "Hello 🚀 World! 🎨 Test 123";
const stripped = stripEmojis(textWithEmoji);
assert.strictEqual(stripped.includes("🚀"), false, "Emoji should be stripped");
assert.strictEqual(stripped.includes("🎨"), false, "Emoji should be stripped");
console.log("  ✓ stripEmojis passed");

// 2. Test mdToHtml
const sampleMd = "# Titulo Principal\n\nEste es un parrafo con **negrita** y *cursiva*.";
const html = mdToHtml(sampleMd, { theme: "claro", font: "Segoe UI" });
assert.ok(html.includes("Titulo Principal"), "HTML should contain title");
assert.ok(html.includes("font-family"), "HTML should contain typography");
console.log("  ✓ mdToHtml basic render passed");

// 3. Test options
assert.ok(FONT_NAMES.length > 5, "Fonts should be available");
assert.ok(THEME_NAMES.includes("claro") && THEME_NAMES.includes("oscuro"), "Themes should include claro/oscuro");
console.log("  ✓ theme and font exports passed");

console.log("All tests passed successfully!");
