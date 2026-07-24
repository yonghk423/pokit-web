import type { Dictionary } from "@/i18n/types";

const dictionary: Dictionary = {
  meta: {
    siteTitle: "POKIT — 일상 웰니스 루틴",
    siteDescription:
      "일상 속 작은 루틴으로 웰니스를 가꾸는 가이드와 앱. POKIT에서 일상·루틴·웰니스 이야기를 만나보세요.",
  },
  header: {
    tagline: "일상 루틴과 웰니스를 위한 포켓 가이드",
    openMenu: "메뉴 열기",
    homeAria: "POKIT 홈",
    allStories: "모든 이야기",
    app: "App",
    contact: "Contact",
    categoriesAria: "카테고리",
  },
  footer: {
    tagline: "일상 루틴과 웰니스로 하루를 가꿉니다.",
    sections: "섹션",
    information: "Information",
    allStories: "모든 이야기",
    support: "지원",
    briefing: "웰니스 브리핑",
    newArrivals: "루틴 도구",
    rights: "All rights reserved.",
  },
  home: {
    inboxTagline: "일상 루틴·웰니스 인텔리전스 by POKIT",
    sections: {
      weekly: {
        nav: "이번 주",
        kicker: "이번 주",
        title: "일상을 여는 이야기",
      },
      newArrivals: {
        nav: "루틴 도구",
        kicker: "루틴 도구",
        title: "생산성·웰니스를 돕는 도구",
      },
      routine: {
        nav: "루틴",
        kicker: "루틴",
        title: "일상에서 시작하기 좋은 루틴",
      },
      commute: {
        nav: "이동·휴식",
        kicker: "이동·휴식",
        title: "일상 속 이동과 쉬는 시간",
      },
      space: {
        nav: "공간",
        kicker: "공간",
        title: "일상의 공간을 다시 짜는 이야기",
      },
      sleep: {
        nav: "잠·저녁",
        kicker: "잠·저녁",
        title: "하루를 닫는 저녁 루틴",
      },
      wellness: {
        nav: "웰니스",
        kicker: "웰니스",
        title: "일상 웰니스, 몸을 위한 10분",
      },
    },
    storiesAria: (label) => `${label} 이야기`,
    radioEmpty: (sectionNav) =>
      `Home Page → ${sectionNav}에서 이야기 3개를 연결해주세요.`,
    viewAllStories: "일상·루틴·웰니스 이야기 모두 보기 →",
    carouselPrev: (label) => `${label} 이전`,
    carouselNext: (label) => `${label} 다음`,
  },
  archive: {
    label: "Archive",
    allStories: "모든 이야기",
    storiesIn: (label) => `${label} 이야기`,
    search: "검색",
    searchPlaceholder: "제목, 설명, 키워드",
    searchSubmit: "검색",
    clearSearch: "검색 초기화",
    clearFilters: "필터 해제 · 전체 이야기 보기",
    searchResults: (term, total, start, end) =>
      `"${term}" 검색 결과 ${total}편 · ${start}–${end}번째`,
    searchNoResults: (term) => `"${term}"에 맞는 이야기가 없습니다.`,
    totalRange: (total, start, end, sortLabel) =>
      `총 ${total}편 · ${start}–${end}번째 (${sortLabel})`,
    empty: "아직 발행된 이야기가 없습니다.",
    noSearchMatch: "다른 검색어를 시도하거나 검색을 초기화해 보세요.",
    studioHint: "Sanity Studio에서 이야기를 발행하면 여기에 표시됩니다.",
    backHome: "← 홈으로",
    pageSuffix: (page, search) =>
      search ? ` (${page}페이지 · "${search}")` : ` (${page}페이지)`,
    descriptionAll:
      "일상 루틴과 웰니스 가이드 — POKIT에 발행된 모든 이야기를 확인하세요.",
    descriptionCategory: (label) =>
      `${label} — 일상 속 루틴과 웰니스 이야기 | POKIT`,
    descriptionSection: (label) =>
      `${label} — 일상 루틴·웰니스 이야기 | POKIT`,
    descriptionSearch: (term) =>
      `"${term}" 검색 결과 — 일상·루틴·웰니스 이야기를 POKIT에서 확인하세요.`,
    paginationAria: "이야기 목록 페이지",
    prev: "← 이전",
    next: "다음 →",
    viewModeAria: "보기 방식",
    viewLabel: "보기",
    viewGrid: "갤러리",
    viewList: "리스트",
    sortAria: "정렬",
    sortNewest: "최신순",
    sortOldest: "오래된순",
  },
  article: {
    backHome: "← Back to POKIT",
    koreanOnlyBanner:
      "이 글은 아직 영문 번역이 준비되지 않았습니다. 한국어 원문을 표시하고 있습니다.",
    relatedStories: (label) => `${label} 이야기`,
    viewMore: "더보기 →",
    addToPokit: {
      ariaLabel: "POKIT 앱에 루틴 담기",
      title: "이 루틴을 앱에 담아 보세요",
      button: "POKIT에 담기",
      sent: "앱에서 이어서 담을 수 있어요",
      fallback: "POKIT 앱에서 일상 루틴을 기록하고, 웰니스를 지켜 보세요.",
      download: "App Store에서 다운로드",
      qrAria: "POKIT 앱 App Store QR 코드",
      qrHint: "휴대폰 카메라로 스캔해서 설치",
    },
  },
  appDownload: {
    kicker: "일상 루틴과 웰니스를 주머니에",
    title: "POKIT 앱에서 일상 루틴을 기록하고, 웰니스를 지켜 보세요.",
    download: "App Store에서 다운로드",
    qrAria: "POKIT 앱 App Store QR 코드",
    qrHint: "휴대폰 카메라로 스캔해서 설치",
  },
  notFound: {
    title: "페이지를 찾을 수 없습니다",
    description: "주소가 바뀌었거나 삭제된 페이지일 수 있습니다.",
    home: "홈으로",
    allStories: "모든 이야기",
  },
  support: {
    title: "지원",
    description: "POKIT 문의 안내",
    intro: "사이트·앱 관련 문의는 아래 이메일로 보내 주세요.",
    email: "이메일",
    sendMail: "메일 보내기",
    backHome: "← 홈으로",
  },
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
    empty: "아직 발행된 루틴 도구 리스트가 없습니다.",
    backToHub: "← 루틴 도구 목록",
    viewFull: "전체 보기",
    viewAll: "도구 전체",
    metaDescriptionFromItems: (names) => {
      const joined = names.slice(0, 3).join(" · ");
      return joined
        ? `${joined} — POKIT 루틴 도구 추천`
        : "생산성·웰니스를 돕는 도구를 추천하는 POKIT 루틴 도구";
    },
  },
  categories: {
    Weekly: "이번 주",
    Routine: "루틴",
    Commute: "이동·휴식",
    Space: "공간",
    Sleep: "잠·저녁",
    Wellness: "웰니스",
    design: "공간",
  },
  sectionHeading: {
    viewAll: "더보기",
  },
  languageSwitcher: {
    label: "Language",
    ko: "한국어",
    en: "English",
  },
  dates: {
    intl: "ko-KR",
  },
};

export default dictionary;
