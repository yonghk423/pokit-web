import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createCategoryLabels } from "./category-labels.ts";
import { createHomeSectionLabels } from "./home-section-labels.ts";
import { createTranslator } from "./create-translator.ts";

function translator(locale, scope) {
  return createTranslator(JSON.parse(readFileSync(new URL(`./messages/${locale}/${scope}.json`, import.meta.url), "utf8")));
}

const expected = {
  ko: ["이번 주", "루틴", "이동·휴식", "공간", "하루 마무리", "웰니스", "공간"],
  en: ["This week", "Routines", "On the Go", "Space", "Wind Down", "Wellness", "Space"],
  ja: ["今週", "ルーチン", "移動・休憩", "空間", "睡眠・夜", "ウェルネス", "空間"],
};

for (const locale of ["ko", "en", "ja"]) {
  test(`${locale}: scoped labels keep category IDs and home section defaults`, () => {
    const categories = createCategoryLabels(translator(locale, "common"));
    assert.deepEqual(Object.keys(categories), ["Weekly", "Routine", "Commute", "Space", "Sleep", "Wellness", "design"]);
    assert.deepEqual(Object.values(categories), expected[locale]);
    const sections = createHomeSectionLabels(
      translator(locale, "home-section-nav"),
      translator(locale, "home-section-content"),
    );
    assert.deepEqual(Object.keys(sections), ["weekly", "newArrivals", "routine", "commute", "space", "sleep", "wellness"]);
    for (const section of Object.values(sections)) {
      assert(section.nav && section.kicker && section.title);
      assert.deepEqual(Object.keys(section), ["nav", "kicker", "title"]);
    }
    if (locale === "en") {
      assert.equal(sections.newArrivals.nav, "Tools");
      assert.equal(sections.newArrivals.kicker, "Routine tools");
    }
  });
}
