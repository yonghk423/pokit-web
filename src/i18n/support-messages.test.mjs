import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createSupportCopy } from "../content/support-copy.ts";
import { createTranslator } from "./create-translator.ts";

const expected = {
  ko: ["오늘의 주인공 지원 정보", "데이터는 어디에 저장되나요?", "메일 보내기"],
  en: ["Your Day Support", "Where is my data stored?", "Send email"],
  ja: ["Your Dayサポート", "データはどこに保存されますか?", "メールを送る"],
};

for (const locale of ["ko", "en", "ja"]) {
  test(`${locale}: support sections, FAQ and contact text are complete`, () => {
    const messages = JSON.parse(readFileSync(new URL(`./messages/${locale}/support.json`, import.meta.url), "utf8"));
    const t = createTranslator(messages);
    const copy = createSupportCopy(t);
    assert.equal(copy.title, expected[locale][0]);
    assert.equal(t("메일 보내기"), expected[locale][2]);
    assert.deepEqual(copy.sections.map(section => section.id), [
      "scenes", "today", "story", "keep", "faq", "contact",
    ]);
    assert.deepEqual(copy.sections.map(section => section.blocks.length), [2, 2, 2, 2, 4, 1]);
    assert.equal(copy.sections[0].title, t("일기"));
    assert.equal(copy.sections[1].title, t("일기 속 오늘 카드"));
    assert(copy.sections[1].blocks[1].items.includes(t("일기 화면의 도구 메뉴에 있는 가방 버튼으로 오늘 카드를 엽니다.")));
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
