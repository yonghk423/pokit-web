import { defineArrayMember, defineField, defineType } from "sanity";

const toolItemFields = [
  defineField({
    name: "name",
    title: "도구명",
    type: "string",
    description: "예: 수첩, 핸드크림 (특정 브랜드명 금지)",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "nameEn",
    title: "Tool name (English)",
    type: "string",
  }),
  defineField({
    name: "nameJa",
    title: "Tool name (Japanese)",
    type: "string",
  }),
  defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    description: "상세 URL용 (영문 소문자·하이픈)",
    options: { source: "nameEn", maxLength: 64 },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "summary",
    title: "카드 요약 (효능·효과)",
    type: "text",
    rows: 6,
    description: "홈·목록 카드에 보이는 짧은 요약. 3~5문장.",
    validation: (rule) => rule.required().max(700),
  }),
  defineField({
    name: "summaryEn",
    title: "Card summary (English)",
    type: "text",
    rows: 6,
  }),
  defineField({
    name: "summaryJa",
    title: "Card summary (Japanese)",
    type: "text",
    rows: 6,
  }),
  defineField({
    name: "body",
    title: "상세 본문",
    type: "array",
    description: "상세 페이지용. 효능·쓰는 장면·실천 팁을 구체적으로.",
    of: [{ type: "block" }],
    validation: (rule) => rule.required().min(1),
  }),
  defineField({
    name: "bodyEn",
    title: "Detail body (English)",
    type: "array",
    of: [{ type: "block" }],
  }),
  defineField({
    name: "bodyJa",
    title: "Detail body (Japanese)",
    type: "array",
    of: [{ type: "block" }],
  }),
  defineField({
    name: "image",
    title: "커버 이미지",
    type: "image",
    description: "홈 2열 큰 카드·상세 히어로용. Studio에서 직접 업로드.",
    options: { hotspot: true },
  }),
  defineField({
    name: "imageAlt",
    title: "이미지 alt",
    type: "string",
  }),
  defineField({
    name: "imageAltEn",
    title: "Image alt (English)",
    type: "string",
  }),
  defineField({
    name: "imageAltJa",
    title: "Image alt (Japanese)",
    type: "string",
  }),
];

export const newArrivals = defineType({
  name: "newArrivals",
  title: "루틴 도구",
  type: "document",
  description:
    "생산성·건강·웰니스를 돕는 도구 추천. 특정 제품이 아니라 범용 도구 + 효능.",
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
      title: "리스트 제목",
      type: "string",
      initialValue: "이번 주 루틴 도구",
    }),
    defineField({
      name: "titleEn",
      title: "Title (English)",
      type: "string",
      initialValue: "This week’s routine tools",
    }),
    defineField({
      name: "titleJa",
      title: "Title (Japanese)",
      type: "string",
      initialValue: "今週のルーチン道具",
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
      name: "items",
      title: "도구 목록",
      type: "array",
      validation: (rule) => rule.required().min(1).max(8),
      of: [
        defineArrayMember({
          type: "object",
          name: "newArrivalItem",
          title: "도구",
          fields: toolItemFields,
          preview: {
            select: {
              title: "name",
              subtitle: "summary",
              media: "image",
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
        title: title || "루틴 도구",
        subtitle: weekOf ? `${weekOf} · ${count} tools` : `${count} tools`,
      };
    },
  },
});
