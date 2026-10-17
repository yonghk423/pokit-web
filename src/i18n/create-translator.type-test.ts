import { createTranslator } from "./create-translator";
import type { HomeMessages } from "./get-home-messages";
import type { ArchiveMessages } from "./get-archive-messages";

/** Compile-only checks; this function is never executed. */
export function checkTranslationTypes(messages: HomeMessages) {
  const t = createTranslator(messages);
  t("{{label}} 이전", { label: "루틴" });
  t("{{label}} 다음", { label: 0 });
  // @ts-expect-error Unknown key.
  t("없는 키");
  // @ts-expect-error Missing values object.
  t("{{label}} 이전");
  // @ts-expect-error Incorrect placeholder name.
  t("{{label}} 이전", { name: "루틴" });
  // @ts-expect-error Missing required placeholder.
  t("{{label}} 이전", {});
  // @ts-expect-error Extra placeholder name.
  t("{{label}} 이전", { label: "루틴", name: "추가" });
  // @ts-expect-error Unsupported value type.
  t("{{label}} 이전", { label: true });

  const fixed = createTranslator({ "영상 재생": "Play video" });
  fixed("영상 재생");
  // @ts-expect-error Fixed messages do not accept values.
  fixed("영상 재생", { label: "루틴" });

  const multiple = createTranslator({ "{{name}}: {{count}}": "{{count}} for {{name}}" });
  multiple("{{name}}: {{count}}", { name: "메모", count: 0 });
  // @ts-expect-error Every placeholder must be provided.
  multiple("{{name}}: {{count}}", { name: "메모" });

  const mixed = createTranslator({ "고정": "Fixed", "{{name}}": "{{name}}" });
  // @ts-expect-error The fixed key must not allow inference to widen to the dynamic key.
  mixed("고정", { name: "메모" });
}

/** Archive results require the query, total, and both ends of the visible range. */
export function checkArchiveTranslationTypes(messages: ArchiveMessages) {
  const t = createTranslator(messages);
  t('"{{term}}" 검색 결과 {{total}}편 · {{start}}-{{end}}번째', {
    term: "메모", total: 25, start: 13, end: 24,
  });
  // @ts-expect-error The end of the visible range is required.
  t('"{{term}}" 검색 결과 {{total}}편 · {{start}}-{{end}}번째', { term: "메모", total: 25, start: 13 });
  t(" ({{page}}페이지)", { page: 2 });
  // @ts-expect-error Page-only suffixes do not take a search term.
  t(" ({{page}}페이지)", { page: 2, term: "메모" });
}
