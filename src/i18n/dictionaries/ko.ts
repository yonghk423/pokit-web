import type { LegacyDictionary } from "@/i18n/types";

const dictionary: LegacyDictionary = {
  briefing: {
    nav: "웰니스 브리핑",
    kicker: "주간 브리핑",
    hubTitle: "웰니스 브리핑",
    hubDescription:
      "공공기관·국제기구 소식을 POKIT이 요약하고, 일상 루틴으로 연결합니다. 원문은 출처에서 확인하세요.",
    weekTitle: (weekLabel) => `${weekLabel} 웰니스 브리핑`,
    weekDescription: (title) =>
      `${title} — 일상 루틴·웰니스 관점으로 정리한 주간 큐레이션 | POKIT`,
    sourceLabel: "출처",
    readSourceLabel: "원문 보기",
    editorNoteLabel: "POKIT 노트",
    relatedLabel: "같이 읽으면 좋은 이야기",
    archiveTitle: "지난 브리핑",
    empty: "아직 발행된 브리핑이 없습니다.",
    backToHub: "← 브리핑 목록",
    viewFull: "전체 보기",
    metaDescriptionFromItems: (headlines) => {
      const joined = headlines.slice(0, 3).join(" · ");
      return joined
        ? `${joined} — POKIT 주간 웰니스 브리핑`
        : "공공·국제 웰니스 소식을 일상 루틴으로 연결하는 POKIT 주간 브리핑";
    },
  },
  newArrivals: {
    nav: "루틴 도구",
    kicker: "루틴 도구",
    hubTitle: "루틴 도구",
    hubDescription:
      "생산성·건강·웰니스를 높이는 도구를 장면과 함께 추천합니다. 신상 나열이 아니라, 실제로 루틴에 붙이는 방법입니다.",
    weekTitle: (weekLabel) => `${weekLabel} 루틴 도구`,
    weekDescription: (title) =>
      `${title} — 일상 루틴을 돕는 도구 추천 | POKIT`,
    sourceLabel: "근거",
    readSourceLabel: "출처 보기",
    productLabel: "참고 링크",
    archiveTitle: "지난 루틴 도구",
    pastTools: "지난 도구",
    empty: "아직 발행된 루틴 도구 리스트가 없습니다.",
    backToHub: "← 루틴 도구 목록",
    viewFull: "전체 보기",
    viewAll: "도구 전체",
    allTools: "모든 도구들",
    allToolsCount: (total) => `총 ${total}개`,
    metaDescriptionFromItems: (names) => {
      const joined = names.slice(0, 3).join(" · ");
      return joined
        ? `${joined} — POKIT 루틴 도구 추천`
        : "생산성·웰니스를 돕는 도구를 추천하는 POKIT 루틴 도구";
    },
    localeFallbackBanner:
      "이 페이지의 일본어 번역은 아직 없습니다. 영어가 있으면 영어를, 없으면 한국어를 표시합니다.",
  },
  dates: {
    intl: "ko-KR",
  },
};

export default dictionary;
