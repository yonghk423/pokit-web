import type { HomeSectionNavMessages } from "./get-home-section-nav-messages";
import type { HomeSectionContentMessages } from "./get-home-section-content-messages";
import type { HomeSectionId } from "@/content/home";

export type HomeSectionLabels = Record<HomeSectionId, { nav: string; kicker: string; title: string }>;

/** Only section navigation and CMS fallback headings, without unrelated page copy. */
export function createHomeSectionLabels(
  navT: (key: keyof HomeSectionNavMessages) => string,
  contentT: (key: keyof HomeSectionContentMessages) => string,
): HomeSectionLabels {
  return {
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
  };
}
