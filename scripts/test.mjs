import assert from "node:assert";
import { spawnSync } from "node:child_process";
import { mdToHtml, stripEmojis, FONT_NAMES, THEME_NAMES } from "../src/converter.mjs";

console.log("Running mdfolio unit tests...");

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

// 4. CLI argument handling (no browser needed)
const cli = (...args) => spawnSync(process.execPath, ["bin/mdfolio.mjs", ...args], { encoding: "utf8" });
assert.match(cli("--version").stdout, /^\d+\.\d+\.\d+/, "CLI should print its version");
assert.strictEqual(cli("x.md", "--theme", "neon").status, 2, "Unknown theme should exit with 2");
assert.strictEqual(cli("--bogus").status, 2, "Unknown option should exit with 2");
console.log("  ✓ CLI argument handling passed");

console.log("All tests passed successfully!");
