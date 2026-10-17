import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

import { createTranslator } from "./create-translator.ts";

test("translates fixed messages and respects the translated word order", () => {
  const t = createTranslator({
    "영상 재생": "Play video",
    "{{label}} 이전": "Previous: {{label}}",
  });
  assert.equal(t("영상 재생"), "Play video");
  assert.equal(t("{{label}} 이전", { label: "Stories" }), "Previous: Stories");
});

test("handles repeated values, multiple names, numbers and empty strings", () => {
  const key = "{{name}}: {{count}} / {{name}}";
  const t = createTranslator({ [key]: "{{count}} for {{name}} ({{name}})" });
  assert.equal(t(key, { name: "", count: 0 }), "0 for  ()");
  assert.equal(t(key, { name: "메모", count: 12 }), "12 for 메모 (메모)");
});

test("keeps inserted values literal without treating them as templates or HTML", () => {
  const t = createTranslator({ "{{label}} 이야기": "{{label}} stories" });
  const label = "<b>$& {{other}}</b>";
  assert.equal(t("{{label}} 이야기", { label }), `${label} stories`);
});

test("reports unknown keys and missing values for untyped callers", () => {
  const t = createTranslator({ "{{label}} 이전": "Previous: {{label}}" });
  assert.throws(() => t("없는 키"), /Unknown translation key/);
  assert.throws(() => t("toString"), /Unknown translation key/);
  assert.throws(() => t("{{label}} 이전"), /Missing translation value: label/);
  assert.throws(() => t("{{label}} 이전", { wrong: "Stories" }), /Missing translation value/);
});

function readMessages(locale, file) {
  return JSON.parse(readFileSync(new URL(`./messages/${locale}/${file}`, import.meta.url), "utf8"));
}

function placeholders(text) {
  return [...new Set([...text.matchAll(/{{([^{}]+)}}/g)].map(match => match[1]))].sort();
}

test("every locale has the same keys and placeholder names as the source", () => {
  const files = readdirSync(new URL("./messages/ko/", import.meta.url));
  for (const file of files) {
    const source = readMessages("ko", file);
    for (const locale of ["ko", "en", "ja"]) {
      const messages = readMessages(locale, file);
      assert.deepEqual(Object.keys(messages).sort(), Object.keys(source).sort(), `${locale}/${file}`);
      for (const [key, value] of Object.entries(messages)) {
        assert.equal(typeof value, "string", `${locale}/${file}: ${key}`);
        assert.deepEqual(placeholders(value), placeholders(key), `${locale}/${file}: ${key}`);
      }
    }
  }
});

test("home navigation preserves the Korean, English and Japanese wording", () => {
  const expected = {
    ko: ["루틴 이야기", "루틴 이전", "루틴 다음"],
    en: ["루틴 stories", "Previous: 루틴", "Next: 루틴"],
    ja: ["루틴のストーリー", "루틴 前へ", "루틴 次へ"],
  };
  for (const locale of Object.keys(expected)) {
    const t = createTranslator(readMessages(locale, "home.json"));
    assert.deepEqual(
      ["{{label}} 이야기", "{{label}} 이전", "{{label}} 다음"].map(key => t(key, { label: "루틴" })),
      expected[locale],
    );
  }
});
