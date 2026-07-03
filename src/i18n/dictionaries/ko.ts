import type { Dictionary } from "@/i18n/types";

const dictionary: Dictionary = {
  meta: {
    siteTitle: "POKIT — 일상 웰니스 가이드",
    siteDescription:
      "일상의 작은 루틴으로 웰니스를 만드는 가이드와 앱. POKIT에서 루틴·웰니스 이야기를 만나보세요.",
  },
  header: {
    tagline: "Daily pocket intelligence for better routines",
    openMenu: "메뉴 열기",
    homeAria: "POKIT 홈",
    allStories: "모든 이야기",
    app: "App",
    contact: "Contact",
    categoriesAria: "카테고리",
  },
  footer: {
    tagline: "Global affairs for your body, desk and day.",
    sections: "섹션",
    information: "Information",
    allStories: "모든 이야기",
    privacy: "개인정보 처리방침",
    support: "지원",
    rights: "All rights reserved.",
  },
  home: {
    inboxTagline: "Daily inbox intelligence from POKIT",
    digest: {
      ariaLabel: "홈 요약",
      brandKicker: "POKIT",
      brandTagline: "일상 루틴 가이드",
      featuredKicker: "이번 주",
      featuredTitle: "책상 앞에서 잃어버린 몸의 리듬을 되찾는 방법",
      routineDesc: "지금 시작하기 좋은 루틴",
      commuteDesc: "이동과 쉬는 시간에 읽기",
    },
    sections: {
      affairs: {
        nav: "이번 주",
        kicker: "이번 주",
        title: "한 주를 여는 이야기",
      },
      spotlight: {
        nav: "루틴",
        kicker: "루틴",
        title: "지금 시작하기 좋은 루틴",
      },
      radio: {
        nav: "이동·휴식",
        kicker: "이동·휴식",
        title: "이동과 쉬는 시간",
      },
      design: {
        nav: "공간",
        kicker: "공간",
        title: "공간을 다시 짜는 이야기",
      },
      wellness: {
        nav: "웰니스",
        kicker: "웰니스",
        title: "바쁜 하루, 몸을 위한 10분",
      },
    },
    storiesAria: (label) => `${label} 이야기`,
    radioEmpty: (sectionNav) =>
      `Home Page → ${sectionNav}에서 이야기 3개를 연결해주세요.`,
    viewAllStories: "모든 이야기 한 번에 보기 →",
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
    totalRange: (total, start, end) =>
      `총 ${total}편 · ${start}–${end}번째 (최신순)`,
    empty: "아직 발행된 이야기가 없습니다.",
    noSearchMatch: "다른 검색어를 시도하거나 검색을 초기화해 보세요.",
    studioHint: "Sanity Studio에서 이야기를 발행하면 여기에 표시됩니다.",
    backHome: "← 홈으로",
    pageSuffix: (page, search) =>
      search ? ` (${page}페이지 · "${search}")` : ` (${page}페이지)`,
    descriptionAll: "POKIT에 발행된 모든 이야기를 최신순으로 확인하세요.",
    descriptionCategory: (label) =>
      `${label} 이야기 — POKIT에서 최신순으로 확인하세요.`,
    descriptionSection: (label) =>
      `${label} 이야기 — POKIT에서 최신순으로 확인하세요.`,
    descriptionSearch: (term) =>
      `"${term}" 검색 결과 — POKIT에 발행된 이야기를 확인하세요.`,
    paginationAria: "이야기 목록 페이지",
    prev: "← 이전",
    next: "다음 →",
    viewModeAria: "보기 방식",
    viewLabel: "보기",
    viewGrid: "갤러리",
    viewList: "리스트",
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
      fallback: "POKIT 앱에서 루틴을 기록하고, 하루를 정리하세요.",
      download: "App Store에서 다운로드",
    },
  },
  appDownload: {
    kicker: "Want more stories like these in your pocket?",
    title: "POKIT 앱에서 루틴을 기록하고, 하루를 정리하세요.",
    download: "App Store에서 다운로드",
    qrAria: "POKIT 앱 App Store QR 코드",
    qrHint: "iPhone 카메라로 스캔해서 설치",
  },
  notFound: {
    title: "페이지를 찾을 수 없습니다",
    description: "주소가 바뀌었거나 삭제된 페이지일 수 있습니다.",
    home: "홈으로",
    allStories: "모든 이야기",
  },
  privacy: {
    title: "개인정보 처리방침",
    description: "POKIT 개인정보 처리방침",
    body: "사이트를 새로 구성하는 중입니다. 정식 오픈 전에 이 내용을 업데이트해 주세요.",
    contact: "문의",
    backHome: "← 홈으로",
  },
  support: {
    title: "지원",
    description: "POKIT 문의 안내",
    intro: "사이트·앱 관련 문의는 아래 이메일로 보내 주세요.",
    email: "이메일",
    sendMail: "메일 보내기",
    backHome: "← 홈으로",
  },
  categories: {
    Affairs: "이번 주",
    Routine: "루틴",
    Radio: "이동·휴식",
    Design: "공간",
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
