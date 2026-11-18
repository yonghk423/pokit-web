import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createBriefingDescription } from "../content/briefing-copy.ts";
import { createTranslator } from "./create-translator.ts";

const expected = {
  "ko": {
    "title": "2026-10-12 웰니스 브리핑",
    "summary": "첫째 · 둘째 · 셋째 — POKIT 주간 웰니스 브리핑",
    "empty": "공공·국제 웰니스 소식을 일상 루틴으로 연결하는 POKIT 주간 브리핑"
  },
  "en": {
    "title": "Wellness briefing · 2026-10-12",
    "summary": "첫째 · 둘째 · 셋째 — POKIT weekly wellness briefing",
    "empty": "Weekly wellness updates, summarized for daily routines — POKIT"
  },
  "ja": {
    "title": "2026-10-12 ウェルネスブリーフィング",
    "summary": "첫째 · 둘째 · 셋째。POKIT週間ウェルネスブリーフィング",
    "empty": "公的・国際のウェルネスニュースを日常ルーチンにつなげるPOKIT週間ブリーフィング"
  }
};

for (const locale of ["ko", "en", "ja"]) {
  test(`${locale}: briefing week titles and summary limits preserve their wording`, () => {
    const messages = JSON.parse(readFileSync(new URL(`./messages/${locale}/briefing.json`, import.meta.url), "utf8"));
    const t = createTranslator(messages);
    assert.equal(t("{{weekLabel}} 웰니스 브리핑", { weekLabel: "2026-10-12" }), expected[locale].title);
    const headlines = ["첫째", "둘째", "셋째", "넷째"];
    assert.equal(createBriefingDescription(t, headlines), expected[locale].summary);
    assert.deepEqual(headlines, ["첫째", "둘째", "셋째", "넷째"]);
    assert.equal(createBriefingDescription(t, []), expected[locale].empty);
    assert.equal(createBriefingDescription(t, [""]), expected[locale].empty);
  });
}
