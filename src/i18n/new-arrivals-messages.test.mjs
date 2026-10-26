import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createNewArrivalsDescription } from "../content/new-arrivals-copy.ts";
import { createTranslator } from "./create-translator.ts";

const expected = {
  "ko": {
    "title": "2026-10-12 루틴 도구",
    "count": "총 0개",
    "summary": "첫째 · 둘째 · 셋째 — 오늘의 주인공 루틴 도구 추천",
    "empty": "생산성·웰니스를 돕는 도구를 추천하는 오늘의 주인공 루틴 도구",
    "banner": "이 페이지의 일본어 번역은 아직 없습니다. 영어가 있으면 영어를, 없으면 한국어를 표시합니다."
  },
  "en": {
    "title": "Routine tools · 2026-10-12",
    "count": "0 tools",
    "summary": "첫째 · 둘째 · 셋째 — Your Day routine tool picks",
    "empty": "Tools for productivity and wellness — Your Day",
    "banner": "A Japanese translation is not ready yet. We show English when available, otherwise Korean."
  },
  "ja": {
    "title": "2026-10-12 ルーチン道具",
    "count": "全0件",
    "summary": "첫째 · 둘째 · 셋째。Your Dayルーチン道具のおすすめ",
    "empty": "生産性とウェルネスを支える道具をおすすめするYour Dayルーチン道具",
    "banner": "このページの日本語版はまだありません。韓国語を表示しています。"
  }
};

for (const locale of ["ko", "en", "ja"]) {
  test(`${locale}: tool count, week, fallback and summary retain their wording`, () => {
    const messages = JSON.parse(readFileSync(new URL(`./messages/${locale}/new-arrivals.json`, import.meta.url), "utf8"));
    const t = createTranslator(messages);
    assert.equal(t("{{weekLabel}} 루틴 도구", { weekLabel: "2026-10-12" }), expected[locale].title);
    assert.equal(t("총 {{total}}개", { total: 0 }), expected[locale].count);
    const names = ["첫째", "둘째", "셋째", "넷째"];
    assert.equal(createNewArrivalsDescription(t, names), expected[locale].summary);
    assert.deepEqual(names, ["첫째", "둘째", "셋째", "넷째"]);
    assert.equal(createNewArrivalsDescription(t, []), expected[locale].empty);
    assert.equal(createNewArrivalsDescription(t, [""]), expected[locale].empty);
    assert.equal(t("이 페이지의 일본어 번역은 아직 없습니다. 영어가 있으면 영어를, 없으면 한국어를 표시합니다."), expected[locale].banner);
  });
}
