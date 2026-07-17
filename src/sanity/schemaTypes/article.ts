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
  ],
  fields: [
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
        rule.warning("검색·SNS 미리보기에 쓰이니 가능하면 작성하세요."),
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
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});
