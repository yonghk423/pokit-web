import { defineField, defineType } from "sanity";

import { articleCategoryOptions } from "@/content/categories";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fieldsets: [
    {
      name: "english",
      title: "English",
      description: "Optional English translation for global visitors.",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "japanese",
      title: "Japanese",
      description: "Optional Japanese translation for /ja visitors.",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    ...(["", "En", "Ja"] as const).flatMap((suffix) => [
      defineField({
        name: `seoTitle${suffix}`,
        title: `SEO title${suffix ? ` (${suffix})` : ""}`,
        type: "string",
        fieldset: suffix === "En" ? "english" : suffix === "Ja" ? "japanese" : undefined,
        description: "선택 사항. 검색·공유용 제목이며 화면의 글 제목은 유지됩니다. 비우면 해당 언어의 Title을 사용합니다.",
        validation: (rule) => rule.max(70).warning("검색 결과에서 잘리지 않도록 간결하게 작성하세요."),
      }),
      defineField({
        name: `seoDescription${suffix}`,
        title: `SEO description${suffix ? ` (${suffix})` : ""}`,
        type: "text",
        rows: 3,
        fieldset: suffix === "En" ? "english" : suffix === "Ja" ? "japanese" : undefined,
        description: "선택 사항. 검색·공유용 요약. 비우면 해당 언어의 Description 또는 Title을 사용합니다.",
        validation: (rule) => rule.max(180).warning("검색 의도에 맞는 구체적인 요약을 작성하세요."),
      }),
    ]),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "URL 경로. 영문 소문자, 숫자, 하이픈(-)만 사용 (예: balanced-eating-out). 공백·한글 금지.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((value) => {
          const current = (value as { current?: string } | undefined)?.current;
          if (!current) return true;
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
            return "영문 소문자, 숫자, 하이픈(-)만 사용하세요. (예: morning-10min-ritual)";
          }
          return true;
        }),
    }),
    defineField({
      name: "kicker",
      title: "Kicker",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: articleCategoryOptions(),
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "검색 결과·SNS 미리보기용 요약. 비우면 제목이 대신 사용됩니다.",
      validation: (rule) =>
        rule.required().warning("검색·SNS 미리보기에 쓰이니 가능하면 작성하세요."),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverImageAlt",
      title: "Cover image alt text",
      type: "string",
      description: "업로드한 Cover image를 설명하는 짧은 문장 (필수)",
      placeholder: "예: 아침 햇살 아래 요가 매트에서 스트레칭하는 모습",
      validation: (rule) =>
        rule.custom((value, context) => {
          const coverImage = (context.document as { coverImage?: { asset?: unknown } })
            ?.coverImage;
          if (coverImage?.asset && !value) {
            return "Cover image를 올렸으면 Alt text를 입력해주세요.";
          }
          return true;
        }),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "durationMinutes",
      title: "Duration (minutes)",
      type: "number",
      description:
        "POKIT 담기용 예상 소요 시간(분). 비우면 기본 10분으로 전달됩니다.",
      validation: (rule) => rule.min(1).max(480),
    }),
    defineField({
      name: "categoryKey",
      title: "Category key",
      type: "string",
      description:
        "앱 매핑용 snake_case (예: weekly_reset). 비우면 category에서 자동 유도.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "titleEn",
      title: "Title (English)",
      type: "string",
      fieldset: "english",
    }),
    defineField({
      name: "kickerEn",
      title: "Kicker (English)",
      type: "string",
      fieldset: "english",
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "text",
      rows: 3,
      fieldset: "english",
    }),
    defineField({
      name: "coverImageAltEn",
      title: "Cover image alt text (English)",
      type: "string",
      fieldset: "english",
    }),
    defineField({
      name: "bodyEn",
      title: "Body (English)",
      type: "array",
      of: [{ type: "block" }],
      fieldset: "english",
    }),
    defineField({
      name: "titleJa",
      title: "Title (Japanese)",
      type: "string",
      fieldset: "japanese",
    }),
    defineField({
      name: "kickerJa",
      title: "Kicker (Japanese)",
      type: "string",
      fieldset: "japanese",
    }),
    defineField({
      name: "descriptionJa",
      title: "Description (Japanese)",
      type: "text",
      rows: 3,
      fieldset: "japanese",
    }),
    defineField({
      name: "coverImageAltJa",
      title: "Cover image alt text (Japanese)",
      type: "string",
      fieldset: "japanese",
    }),
    defineField({
      name: "bodyJa",
      title: "Body (Japanese)",
      type: "array",
      of: [{ type: "block" }],
      fieldset: "japanese",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});
