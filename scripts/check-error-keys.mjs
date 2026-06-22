#!/usr/bin/env node
// Verifies the i18n error chain has no silently-broken link:
//   1. every `ConvexError({ code })` thrown in convex/ is a known ErrorKey
//      (or an explicitly allowed foreign/unmapped code), and
//   2. every ErrorKey is translated in all three `t.errors` blocks.
// A missing link doesn't fail tsc — it just renders as "unexpected" at runtime.
// Run: node scripts/check-error-keys.mjs

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

// Codes thrown by functions that don't route through getErrorMessage (their UI
// shows a static message), so they intentionally need no ErrorKey/translation.
const UNMAPPED_OK = new Set(["invalidInput"]);

// ── 1. ErrorKeys (single source of truth) ──────────────────────────────────
const errorsSrc = readFileSync(join(root, "lib/errors.ts"), "utf8");
const keysBlock = errorsSrc.match(/export const ERROR_KEYS = \[([\s\S]*?)\] as const/);
if (!keysBlock) throw new Error("Could not find ERROR_KEYS in lib/errors.ts");
const errorKeys = [...keysBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const errorKeySet = new Set(errorKeys);

const aliasBlock = errorsSrc.match(/ERROR_ALIASES[\s\S]*?\{([\s\S]*?)\n\};/);
const aliasKeys = new Set(
  [...(aliasBlock?.[1].matchAll(/([A-Za-z_]+):/g) ?? [])].map((m) => m[1]),
);

// ── 2. Codes thrown across convex/ ─────────────────────────────────────────
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name === "_generated") return [];
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith(".ts") ? [p] : [];
  });
}
const thrown = new Set();
for (const file of walk(join(root, "convex"))) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/ConvexError\(\{\s*code:\s*"([^"]+)"/g)) {
    thrown.add(m[1]);
  }
}

// ── 3. Keys present in each language's t.errors block ──────────────────────
const tSrc = readFileSync(join(root, "lib/i18n/translations.ts"), "utf8");
function errorsKeysFor(lang) {
  // Find the lang block, then its `errors: { ... }` sub-block.
  const langStart = tSrc.indexOf(`${lang}: {`);
  const errStart = tSrc.indexOf("errors: {", langStart);
  const errEnd = tSrc.indexOf("},", errStart);
  const block = tSrc.slice(errStart, errEnd);
  return new Set([...block.matchAll(/^\s{6}([A-Za-z]+):/gm)].map((m) => m[1]));
}
const langs = ["en", "fr", "he"];
const langKeys = Object.fromEntries(langs.map((l) => [l, errorsKeysFor(l)]));

// ── Assertions ─────────────────────────────────────────────────────────────
const problems = [];

for (const code of thrown) {
  if (!errorKeySet.has(code) && !aliasKeys.has(code) && !UNMAPPED_OK.has(code)) {
    problems.push(`thrown code "${code}" is not an ErrorKey/alias (unmapped → "unexpected")`);
  }
}
for (const key of errorKeys) {
  for (const lang of langs) {
    if (!langKeys[lang].has(key)) {
      problems.push(`ErrorKey "${key}" missing from t.errors.${lang}`);
    }
  }
}

if (problems.length) {
  console.error("❌ error-key check failed:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log(
  `✅ error-key check passed: ${thrown.size} thrown codes, ${errorKeys.length} ErrorKeys, all translated in ${langs.join("/")}.`,
);
