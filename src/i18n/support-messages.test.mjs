import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createSupportCopy } from "../content/support-copy.ts";
import { createTranslator } from "./create-translator.ts";

const expected = {
  ko: ["POKIT 지원 정보", "데이터는 어디에 저장되나요?", "메일 보내기"],
  en: ["POKIT Support", "Where is my data stored?", "Send email"],
  ja: ["POKITサポート", "データはどこに保存されますか?", "メールを送る"],
};

for (const locale of ["ko", "en", "ja"]) {
  test(`${locale}: support sections, FAQ and contact text are complete`, () => {
    const messages = JSON.parse(readFileSync(new URL(`./messages/${locale}/support.json`, import.meta.url), "utf8"));
    const t = createTranslator(messages);
    const copy = createSupportCopy(t);
    assert.equal(copy.title, expected[locale][0]);
    assert.equal(t("메일 보내기"), expected[locale][2]);
    assert.deepEqual(copy.sections.map(section => section.id), [
      "today", "scenes", "story", "keep", "faq", "contact",
    ]);
    assert.deepEqual(copy.sections.map(section => section.blocks.length), [2, 2, 2, 2, 4, 1]);
    const faqs = copy.sections.find(section => section.id === "faq").blocks;
    assert.equal(faqs[0].q, expected[locale][1]);
    assert(faqs.every(block => block.type === "faq" && block.q && block.a));

    function assertNonempty(value) {
      if (typeof value === "string") assert(value.trim().length > 0);
      else for (const item of Object.values(value)) assertNonempty(item);
    }
    assertNonempty(copy);
  });
}
