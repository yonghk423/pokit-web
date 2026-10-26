import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createTranslator } from "./create-translator.ts";

const expected = {
  ko: ["루틴 이야기", "오늘의 주인공에 담기", "앱에서 이어서 담을 수 있어요"],
  en: ["More routines stories", "Add to Your Day", "You can finish saving in the app"],
  ja: ["ルーチンのストーリー", "Your Dayに入れる", "アプリで続きを保存できます"],
};

for (const locale of ["ko", "en", "ja"]) {
  test(`${locale}: article and shared install messages preserve their wording`, () => {
    const read = scope => JSON.parse(readFileSync(new URL(`./messages/${locale}/${scope}.json`, import.meta.url), "utf8"));
    const t = createTranslator(read("article"));
    const installT = createTranslator(read("app-install"));
    const label = { ko: "루틴", en: "Routines", ja: "ルーチン" }[locale];
    assert.equal(t("{{label}} 이야기", {
      label: locale === "en" ? label.toLowerCase() : label,
    }), expected[locale][0]);
    assert.equal(installT("POKIT에 담기"), expected[locale][1]);
    assert.equal(installT("앱에서 이어서 담을 수 있어요"), expected[locale][2]);
  });
}
