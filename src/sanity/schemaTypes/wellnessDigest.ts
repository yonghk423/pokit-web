import { defineArrayMember, defineField, defineType } from "sanity";

const digestItemFields = [
  defineField({
    name: "headline",
    title: "제목",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "headlineEn",
    title: "Title (English)",
    type: "string",
  }),
  defineField({
    name: "headlineJa",
    title: "Title (Japanese)",
    type: "string",
  }),
  defineField({
    name: "summary",
    title: "요약 (내 문장)",
    type: "text",
    rows: 3,
    description: "원문 복붙이 아니라 POKIT 톤으로 짧게 재구성하세요.",
    validation: (rule) => rule.required().max(400),
  }),
  defineField({
    name: "summaryEn",
    title: "Summary (English)",
    type: "text",
    rows: 3,
  }),
  defineField({
    name: "summaryJa",
    title: "Summary (Japanese)",
    type: "text",
    rows: 3,
  }),
  defineField({
    name: "sourceName",
    title: "출처명",
    type: "string",
    description: "예: WHO, 질병관리청, NIH",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "sourceNameEn",
    title: "Source name (English)",
    type: "string",
  }),
  defineField({
    name: "sourceNameJa",
    title: "Source name (Japanese)",
    type: "string",
  }),
  defineField({
    name: "sourceUrl",
    title: "원문 URL",
    type: "url",
    validation: (rule) =>
      rule.required().uri({ scheme: ["http", "https"] }),
  }),
];

export const wellnessDigest = defineType({
  name: "wellnessDigest",
  title: "Wellness Digest",
  type: "document",
  description:
    "주간 웰니스 소식 큐레이션. 요약 + 출처 + 원문 링크만 담고, 원문 전문은 올리지 않습니다.",
  fields: [
    defineField({
      name: "weekOf",
      title: "주간 시작일",
      type: "date",
      description: "해당 주 월요일 등. 최신 weekOf가 홈에 노출됩니다.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "다이제스트 제목",
      type: "string",
      initialValue: "이번 주 웰니스 브리핑",
    }),
    defineField({
      name: "titleEn",
      title: "Digest title (English)",
      type: "string",
      initialValue: "This week’s wellness briefing",
    }),
    defineField({
      name: "titleJa",
      title: "Digest title (Japanese)",
      type: "string",
      initialValue: "今週のウェルネスブリーフィング",
    }),
    defineField({
      name: "intro",
      title: "인트로 (선택)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "introEn",
      title: "Intro (English)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "introJa",
      title: "Intro (Japanese)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "editorNote",
      title: "에디터 노트 (POKIT 관점)",
      type: "text",
      rows: 4,
      description:
        "원문 요약과 별도로, 왜 일상·루틴에 중요한지 POKIT 시각으로 짧게 씁니다. SEO·고유 콘텐츠용.",
    }),
    defineField({
      name: "editorNoteEn",
      title: "Editor note (English)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "editorNoteJa",
      title: "Editor note (Japanese)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "relatedArticles",
      title: "관련 이야기 (내부 링크)",
      type: "array",
      description: "브리핑과 연결할 POKIT Article 2~4개.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "article" }],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "items",
      title: "소식 목록",
      type: "array",
      validation: (rule) => rule.required().min(1).max(7),
      of: [
        defineArrayMember({
          type: "object",
          name: "digestItem",
          title: "소식",
          fields: digestItemFields,
          preview: {
            select: {
              title: "headline",
              subtitle: "sourceName",
            },
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Week (newest)",
      name: "weekOfDesc",
      by: [{ field: "weekOf", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      weekOf: "weekOf",
      items: "items",
    },
    prepare({ title, weekOf, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: title || "Wellness Digest",
        subtitle: weekOf ? `${weekOf} · ${count} items` : `${count} items`,
      };
    },
  },
});
