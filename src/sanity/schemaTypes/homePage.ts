import { defineField, defineType } from "sanity";

const sectionHeadingFields = [
  defineField({
    name: "kicker",
    title: "소제목",
    type: "string",
    description: "섹션 상단 라벨 (예: City Guides)",
  }),
  defineField({
    name: "title",
    title: "섹션 제목",
    type: "string",
    description: "비워두면 기본 제목이 사용됩니다.",
  }),
  defineField({
    name: "kickerEn",
    title: "소제목 (English)",
    type: "string",
  }),
  defineField({
    name: "titleEn",
    title: "섹션 제목 (English)",
    type: "string",
  }),
];

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fieldsets: [
    {
      name: "hero",
      title: "상단 히어로",
      description: "홈 최상단 — 왼쪽 큰 기사 + 오른쪽 세로 목록",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "spotlight",
      title: "추천 3열",
      description: "Radio 위 카드 섹션 (City Guides와 별도 주제)",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "radioLatest",
      title: "POKIT Radio",
      description: "Latest from POKIT radio — 에피소드 + 이미지",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "designAwards",
      title: "Design Awards",
      description: "POKIT Radio 아래 — 디자인·라이프스타일 기사 섹션",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "sleepNight",
      title: "잠·저녁",
      description: "취침·저녁 루틴 섹션",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "cityGuides",
      title: "City Guides",
      description: "하단 녹색 배경 — 도시·웰니스 가이드 섹션",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "featuredArticle",
      title: "메인 기사",
      description: "왼쪽 큰 카드에 표시되는 대표 기사",
      type: "reference",
      to: [{ type: "article" }],
      fieldset: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "leadStories",
      title: "서브 기사 목록",
      description: "오른쪽 세로 목록 (위에서 아래 순서)",
      type: "array",
      fieldset: "hero",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({
      name: "spotlightRow",
      title: "기사 목록",
      description: "City Guides와 별도 주제 기사 연결 (순서대로 우선 노출)",
      type: "array",
      fieldset: "spotlight",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({
      name: "spotlightRowSection",
      title: "섹션 제목 (선택)",
      description: "비워두면 Editor's Pick / 지금 주목할 이야기",
      type: "object",
      fieldset: "spotlight",
      initialValue: {
        kicker: "Editor's Pick",
        title: "지금 주목할 이야기",
      },
      fields: sectionHeadingFields,
    }),
    defineField({
      name: "radioArticles",
      title: "기사 목록",
      description: "Article 문서를 연결하세요 (Kicker에 프로그램명 입력, 순서대로 우선 노출)",
      type: "array",
      fieldset: "radioLatest",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({
      name: "radioLatestSection",
      title: "섹션 제목 (선택)",
      description: "비워두면 Latest from POKIT radio",
      type: "object",
      fieldset: "radioLatest",
      initialValue: {
        title: "Latest from POKIT radio",
      },
      fields: sectionHeadingFields,
    }),
    defineField({
      name: "designAwards",
      title: "기사 목록",
      description: "가로 3열 카드",
      type: "array",
      fieldset: "designAwards",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({
      name: "designAwardsSection",
      title: "섹션 제목 (선택)",
      description: "비워두면 Design Awards / 더 나은 하루를 만드는 작은 디자인",
      type: "object",
      fieldset: "designAwards",
      initialValue: {
        kicker: "Design Awards",
        title: "더 나은 하루를 만드는 작은 디자인",
      },
      fields: sectionHeadingFields,
    }),
    defineField({
      name: "sleepStories",
      title: "기사 목록",
      description: "잠·저녁 루틴 기사 (순서대로 우선 노출)",
      type: "array",
      fieldset: "sleepNight",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({
      name: "sleepStoriesSection",
      title: "섹션 제목 (선택)",
      description: "비워두면 잠·저녁 기본 제목",
      type: "object",
      fieldset: "sleepNight",
      initialValue: {
        kicker: "잠·저녁",
        title: "하루를 닫는 저녁 루틴",
      },
      fields: sectionHeadingFields,
    }),
    defineField({
      name: "cityGuides",
      title: "기사 목록",
      description: "가로 4열 카드",
      type: "array",
      fieldset: "cityGuides",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({
      name: "cityGuidesSection",
      title: "섹션 제목 (선택)",
      description: "비워두면 City Guides / 도시의 리듬으로 배우는 웰니스",
      type: "object",
      fieldset: "cityGuides",
      initialValue: {
        kicker: "City Guides",
        title: "도시의 리듬으로 배우는 웰니스",
      },
      fields: sectionHeadingFields,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
