import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { validateMessages } from "./validate-i18n.mjs";

function fixture(t, catalogs = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pokit-i18n-check-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, content) => {
    const absolute = path.join(root, file);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, content);
  };
  write("src/i18n/config.ts", 'export const locales = ["ko", "en", "ja"] as const;');
  for (const locale of ["ko", "en", "ja"]) write(`src/i18n/messages/${locale}/common.json`, JSON.stringify(catalogs[locale] ?? { "메뉴": "Menu" }, null, 2));
  const extraction = { catalogs: { common: { "메뉴": [{ file: "src/page.tsx", line: 7 }] } }, diagnostics: [] };
  return { root, write, extraction };
}
const codes = result => result.errors.map(error => error.code);

test("valid catalogs pass without modifying files, including retained unused keys", t => {
  const catalog = { "메뉴": "Menu", "미사용": "Kept" };
  const { root, extraction } = fixture(t, { ko: catalog, en: catalog, ja: catalog });
  const file = path.join(root, "src/i18n/messages/en/common.json");
  const before = fs.readFileSync(file, "utf8");
  const result = validateMessages(root, extraction);
  assert.deepEqual(result.errors, []);
  assert.equal(result.scopeCount, 1);
  assert.equal(result.usedKeyCount, 1);
  assert.equal(result.localeCount, 3);
  assert.equal(fs.readFileSync(file, "utf8"), before);
});

test("missing source and locale keys report their resource and call site", t => {
  const { root, extraction } = fixture(t);
  extraction.catalogs.common["새 키"] = [{ file: "src/page.tsx", line: 8 }];
  const result = validateMessages(root, extraction);
  assert.equal(result.errors.filter(error => error.code === "unregistered-key").length, 1);
  assert.equal(result.errors.filter(error => error.code === "missing-key").length, 2);
  assert(result.errors.every(error => error.key === "새 키" && error.usages[0].line === 8));
});

test("empty strings, whitespace, non-string values and wrong placeholders fail", t => {
  const source = { "메뉴": "Menu", "{{label}} 이야기": "{{label}} stories", "빈 값": "Value", "숫자": "Number" };
  const { root, write, extraction } = fixture(t, { ko: source, en: source, ja: source });
  write("src/i18n/messages/en/common.json", JSON.stringify({
    "메뉴": " ", "{{label}} 이야기": "{{name}} stories", "빈 값": "", "숫자": 0,
  }, null, 2));
  const result = validateMessages(root, extraction);
  assert.equal(codes(result).filter(code => code === "empty-value").length, 2);
  assert(codes(result).includes("invalid-value"));
  assert(codes(result).includes("placeholder-mismatch"));
  assert(result.errors.every(error => error.line > 1));
});

test("placeholder reordering and repetition are allowed, but missing or additional names fail", t => {
  const key = "{{name}}: {{count}} / {{name}}";
  const source = { "메뉴": "Menu", [key]: "{{name}}: {{count}}" };
  const { root, write, extraction } = fixture(t, { ko: source, en: source, ja: source });
  write("src/i18n/messages/en/common.json", JSON.stringify({ "메뉴": "Menu", [key]: "{{count}} for {{name}} ({{name}})" }));
  assert.deepEqual(validateMessages(root, extraction).errors, []);
  write("src/i18n/messages/en/common.json", JSON.stringify({ "메뉴": "Menu", [key]: "{{count}} for {{other}}" }));
  assert(codes(validateMessages(root, extraction)).includes("placeholder-mismatch"));
});

test("extra keys and missing language catalogs fail", t => {
  const { root, write, extraction } = fixture(t);
  write("src/i18n/messages/en/common.json", '{"메뉴":"Menu","추가":"Extra"}');
  fs.unlinkSync(path.join(root, "src/i18n/messages/ja/common.json"));
  const result = validateMessages(root, extraction);
  assert(codes(result).includes("extra-key"));
  assert(codes(result).includes("missing-file"));
});

test("invalid JSON, invalid catalog shapes and duplicate keys fail", t => {
  const { root, write, extraction } = fixture(t);
  for (const [content, code] of [["{", "invalid-json"], ["[]", "invalid-catalog"], ['{"메뉴":"First","메뉴":"Second"}', "duplicate-key"]]) {
    write("src/i18n/messages/en/common.json", content);
    assert(codes(validateMessages(root, extraction)).includes(code));
  }
});

test("entirely unused scopes are checked and extraction errors remain failures", t => {
  const { root, write, extraction } = fixture(t);
  for (const locale of ["ko", "en", "ja"]) write(`src/i18n/messages/${locale}/unused.json`, JSON.stringify({ "미사용": locale === "en" ? "" : "Kept" }));
  extraction.diagnostics.push({ file: "src/page.tsx", line: 9, column: 3, message: "동적 키" });
  const result = validateMessages(root, extraction);
  assert(codes(result).includes("invalid-call"));
  assert(result.errors.some(error => error.scope === "unused" && error.code === "empty-value"));
  assert.equal(result.scopeCount, 2);
});

test("build stops before Next on invalid translations and proceeds after they are fixed", t => {
  const { root, write } = fixture(t);
  const repository = fileURLToPath(new URL("../../", import.meta.url));
  for (const file of ["scripts/check-i18n.mjs", "scripts/lib/validate-i18n.mjs", "scripts/lib/extract-i18n.mjs", "src/i18n/create-translator.ts"]) {
    write(file, fs.readFileSync(path.join(repository, file), "utf8"));
  }
  write("tsconfig.json", JSON.stringify({ compilerOptions: {
    module: "esnext", moduleResolution: "bundler", target: "es2020", resolveJsonModule: true,
    allowSyntheticDefaultImports: true, types: [],
  }, include: ["src/**/*.ts"] }));
  write("src/page.ts", `
    import { createTranslator } from './i18n/create-translator';
    import source from './i18n/messages/ko/common.json';
    type Messages = Record<keyof typeof source, string>;
    export function page(messages: Messages) { return createTranslator(messages)('메뉴'); }
  `);
  const scripts = JSON.parse(fs.readFileSync(path.join(repository, "package.json"), "utf8")).scripts;
  write("package.json", JSON.stringify({ private: true, scripts: { build: scripts.build, "i18n:check": scripts["i18n:check"] } }));
  fs.mkdirSync(path.join(root, "node_modules"), { recursive: true });
  fs.symlinkSync(path.join(repository, "node_modules/typescript"), path.join(root, "node_modules/typescript"), "dir");
  write("node_modules/.bin/next", '#!/usr/bin/env node\nrequire("node:fs").writeFileSync("next-was-run", "yes");\n');
  fs.chmodSync(path.join(root, "node_modules/.bin/next"), 0o755);
  write("src/i18n/messages/en/common.json", '{"메뉴":""}');
  const failed = spawnSync("npm", ["run", "build"], { cwd: root, encoding: "utf8" });
  assert.equal(failed.status, 1, failed.stdout + failed.stderr);
  assert(failed.stderr.includes("empty-value"));
  assert.equal(fs.existsSync(path.join(root, "next-was-run")), false);
  write("src/i18n/messages/en/common.json", '{"메뉴":"Menu"}');
  const passed = spawnSync("npm", ["run", "build"], { cwd: root, encoding: "utf8" });
  assert.equal(passed.status, 0, passed.stdout + passed.stderr);
  assert.equal(fs.existsSync(path.join(root, "next-was-run")), true);
});
