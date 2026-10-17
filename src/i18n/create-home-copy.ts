import { createTranslator } from "./create-translator";
import type { HomeMessages } from "./get-home-messages";
import type { HomeSectionNavMessages } from "./get-home-section-nav-messages";
import type { HomeSectionContentMessages } from "./get-home-section-content-messages";
import type { HomeSectionId } from "@/content/home";

/** Section IDs are shared across locales; all text comes from scoped JSON. */
export function createHomeCopy(
  messages: HomeMessages,
  navMessages: HomeSectionNavMessages,
  contentMessages: HomeSectionContentMessages,
) {
  const t = createTranslator(messages);
  const navT = createTranslator(navMessages);
  const contentT = createTranslator(contentMessages);
  return {
    inboxTagline: t("일상 루틴·웰니스 by POKIT"),
    sections: {
      weekly: {
        nav: navT("이번 주"),
        kicker: contentT("이번 주"),
        title: contentT("일상을 여는 이야기"),
      },
      newArrivals: {
        nav: navT("루틴 도구"),
        kicker: contentT("루틴 도구"),
        title: contentT("생산성·웰니스를 돕는 도구"),
      },
      routine: {
        nav: navT("루틴"),
        kicker: contentT("루틴"),
        title: contentT("일상에서 시작하기 좋은 루틴"),
      },
      commute: {
        nav: navT("이동·휴식"),
        kicker: contentT("이동·휴식"),
        title: contentT("일상 속 이동과 쉬는 시간"),
      },
      space: {
        nav: navT("공간"),
        kicker: contentT("공간"),
        title: contentT("일상의 공간을 다시 짜는 이야기"),
      },
      sleep: {
        nav: navT("하루 마무리"),
        kicker: contentT("하루 마무리"),
        title: contentT("하루를 닫는 저녁 루틴"),
      },
      wellness: {
        nav: navT("웰니스"),
        kicker: contentT("웰니스"),
        title: contentT("일상 웰니스, 몸을 위한 10분"),
      },
    } satisfies Record<HomeSectionId, { nav: string; kicker: string; title: string }>,
    radioEmpty: (sectionNav: string) =>
      t("Home Page → {{sectionNav}}에서 이야기 3개를 연결해주세요.", { sectionNav }),
    viewAllStories: t("일상·루틴·웰니스 이야기 모두 보기 →"),
    heroLine1: t("일상 루틴과 웰니스."),
    heroAccent: t("포켓"),
    heroRest: t("가이드."),
    feedTitle: t("최신 이야기"),
    workLine1: t("하루의 장면을"),
    workAccent: t("루틴으로"),
    workRest: t("이어 갑니다."),
    labsLine1: t("하루를 붙잡는"),
    labsAccent: t("루틴"),
    labsRest: t("도구."),
    aboutTitle: t("POKIT은 작은 일상 루틴으로 웰니스를 가꾸는 포켓 가이드입니다."),
    aboutBody: t("이번 주 리듬부터 이동·공간·잠·몸 풀기까지.\n부담 없는 한 장면이 쌓여 하루를 바꿉니다."),
    aboutCta: t("앱 살펴보기"),
    exploreAll: t("모두 보기"),
    closePreview: t("목록으로"),
  };
}

export type HomeCopy = ReturnType<typeof createHomeCopy>;
