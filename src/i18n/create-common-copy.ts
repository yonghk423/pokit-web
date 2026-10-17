import { createTranslator } from "./create-translator";
import type { CommonMessages } from "./get-common-messages";

/** Compatibility shape for screens that still consume dictionary props. */
export function createCommonCopy(messages: CommonMessages) {
  const t = createTranslator(messages);
  return {
    meta: {
      siteTitle: t("POKIT — 일상 웰니스 루틴"),
      siteDescription: t("일상 속 작은 루틴으로 웰니스를 가꾸는 가이드와 앱. POKIT에서 일상·루틴·웰니스 이야기를 만나보세요."),
    },
    header: {
      tagline: t("일상 루틴과 웰니스를 위한 포켓 가이드"),
      openMenu: t("메뉴 열기"),
      homeAria: t("POKIT 홈"),
      allStories: t("모든 이야기"),
      app: t("App"),
      contact: t("Contact"),
      categoriesAria: t("카테고리"),
    },
    footer: {
      tagline: t("일상 루틴과 웰니스로 하루를 가꿉니다."),
      sections: t("섹션"),
      information: t("Information"),
      allStories: t("모든 이야기"),
      support: t("앱 지원"),
      briefing: t("웰니스 브리핑"),
      newArrivals: t("루틴 도구"),
      app: t("앱 소개"),
      rights: t("All rights reserved."),
    },
    notFound: {
      title: t("페이지를 찾을 수 없습니다"),
      description: t("주소가 바뀌었거나 삭제된 페이지일 수 있습니다."),
      home: t("홈으로"),
      allStories: t("모든 이야기"),
    },
    categories: {
      Weekly: t("이번 주"),
      Routine: t("루틴"),
      Commute: t("이동·휴식"),
      Space: t("공간"),
      Sleep: t("하루 마무리"),
      Wellness: t("웰니스"),
      design: t("공간"),
    },
    sectionHeading: {
      viewAll: t("더보기"),
    },
    languageSwitcher: {
      label: t("Language"),
      ko: t("한국어"),
      en: t("English"),
      ja: t("日本語"),
    },
  };
}

export type CommonCopy = ReturnType<typeof createCommonCopy>;
