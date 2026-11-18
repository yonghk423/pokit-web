import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createTranslator } from "./create-translator.ts";

function translator(locale, scope) {
  const messages = JSON.parse(readFileSync(new URL(`./messages/${locale}/${scope}.json`, import.meta.url), "utf8"));
  return createTranslator(messages);
}

test("identical Korean text retains its translation for each home context", () => {
  const navT = translator("en", "home-section-nav");
  const contentT = translator("en", "home-section-content");
  const homeT = translator("en", "home");
  assert.equal(navT("루틴 도구"), "Tools");
  assert.equal(contentT("루틴 도구"), "Routine tools");
  assert.equal(contentT("루틴"), "Routines");
  assert.equal(homeT("루틴"), "onto");
});

test("common navigation, language labels and 404 text support every locale", () => {
  const expected = {
    ko: ["POKIT 홈", "페이지를 찾을 수 없습니다", "루틴"],
    en: ["POKIT home", "Page not found", "Routines"],
    ja: ["POKIT ホーム", "ページが見つかりません", "ルーチン"],
  };
  for (const locale of ["ko", "en", "ja"]) {
    const t = translator(locale, "common");
    assert.deepEqual([t("POKIT 홈"), t("페이지를 찾을 수 없습니다"), t("루틴")], expected[locale]);
    assert.deepEqual([t("한국어"), t("English"), t("日本語")], ["한국어", "English", "日本語"]);
  }
});
