export const sectionOrder = [
  "affairs",
  "spotlight",
  "radio",
  "design",
  "wellness",
] as const;

export type HomeSectionId = (typeof sectionOrder)[number];

export const homeSections = {
  affairs: {
    id: "affairs",
    nav: "이번 주",
    kicker: "이번 주",
    title: "한 주를 여는 이야기",
    archiveCategory: "Affairs",
  },
  spotlight: {
    id: "spotlight",
    nav: "루틴",
    kicker: "루틴",
    title: "지금 시작하기 좋은 루틴",
    archiveCategory: "Routine",
  },
  radio: {
    id: "radio",
    nav: "이동·휴식",
    kicker: "이동·휴식",
    title: "이동과 쉬는 시간",
    archiveCategory: "Radio",
  },
  design: {
    id: "design",
    nav: "공간",
    kicker: "공간",
    title: "공간을 다시 짜는 이야기",
    archiveSection: "design",
    /** Design 전체 + 공간·책상·집과 연결된 Routine 글 */
    spaceRoutineSlugs: [
      "minimal-desk-design",
      "kitchen-dish-minimal",
      "home-workout-session",
      "afternoon-focus-reset",
      "phone-outside-bedroom",
      "evening-phone-basket",
      "desk-stretch-5min",
    ],
  },
  wellness: {
    id: "wellness",
    nav: "웰니스",
    kicker: "웰니스",
    title: "바쁜 하루, 몸을 위한 10분",
    archiveCategory: "Wellness",
  },
} as const satisfies Record<
  HomeSectionId,
  {
    id: string;
    nav: string;
    kicker: string;
    title: string;
    archiveCategory?: string;
    archiveSection?: string;
    spaceRoutineSlugs?: readonly string[];
  }
>;

export const categories = sectionOrder.map((key) => ({
  label: homeSections[key].nav,
  id: homeSections[key].id,
}));
