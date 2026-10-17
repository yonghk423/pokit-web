import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createTranslator } from "./create-translator.ts";

const expected = {
  ko: {
    results: '"메모" 검색 결과 25편 · 13-24번째',
    empty: '"메모"에 맞는 이야기가 없습니다.',
    range: "총 25편 · 13-24번째 (최신순)",
    page: " (2페이지)",
    searchPage: ' (2페이지 · "메모")',
  },
  en: {
    results: '"메모" · 25 results · showing 13-24',
    empty: 'No stories match "메모".',
    range: "25 stories · showing 13-24 (최신순)",
    page: " (page 2)",
    searchPage: ' (page 2 · "메모")',
  },
  ja: {
    results: '"메모" の検索結果 25件 · 13-24件目',
    empty: '"메모" に合うストーリーはありません。',
    range: "全25件 · 13-24件目 (최신순)",
    page: " (2ページ)",
    searchPage: ' (2ページ · "메모")',
  },
};

for (const locale of ["ko", "en", "ja"]) {
  test(`${locale}: archive search, counts and page suffixes preserve their wording`, () => {
    const messages = JSON.parse(readFileSync(new URL(`./messages/${locale}/archive.json`, import.meta.url), "utf8"));
    const t = createTranslator(messages);
    assert.equal(t('"{{term}}" 검색 결과 {{total}}편 · {{start}}-{{end}}번째', {
      term: "메모", total: 25, start: 13, end: 24,
    }), expected[locale].results);
    assert.equal(t('"{{term}}"에 맞는 이야기가 없습니다.', { term: "메모" }), expected[locale].empty);
    assert.equal(t("총 {{total}}편 · {{start}}-{{end}}번째 ({{sortLabel}})", {
      total: 25, start: 13, end: 24, sortLabel: "최신순",
    }), expected[locale].range);
    assert.equal(t(" ({{page}}페이지)", { page: 2 }), expected[locale].page);
    assert.equal(t(' ({{page}}페이지 · "{{term}}")', { page: 2, term: "메모" }), expected[locale].searchPage);
  });
}
