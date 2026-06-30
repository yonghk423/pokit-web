import type { HomeSectionId } from "@/content/home";

export type HomeSectionCopy = {
  nav: string;
  kicker: string;
  title: string;
};

export type Dictionary = {
  meta: {
    siteTitle: string;
    siteDescription: string;
  };
  header: {
    tagline: string;
    openMenu: string;
    homeAria: string;
    allStories: string;
    app: string;
    contact: string;
    categoriesAria: string;
  };
  footer: {
    tagline: string;
    sections: string;
    information: string;
    allStories: string;
    privacy: string;
    support: string;
    rights: string;
  };
  home: {
    inboxTagline: string;
    radio: {
      ariaLabel: string;
      onAir: string;
      deskKicker: string;
      deskTitle: string;
      listenLive: string;
      continentalKicker: string;
      continentalDesc: string;
      topHourKicker: string;
      topHourDesc: string;
    };
    sections: Record<HomeSectionId, HomeSectionCopy>;
    storiesAria: (label: string) => string;
    radioEmpty: (sectionNav: string) => string;
    viewAllStories: string;
    carouselPrev: (label: string) => string;
    carouselNext: (label: string) => string;
  };
  archive: {
    label: string;
    allStories: string;
    storiesIn: (label: string) => string;
    search: string;
    searchPlaceholder: string;
    searchSubmit: string;
    clearSearch: string;
    clearFilters: string;
    searchResults: (term: string, total: number, start: number, end: number) => string;
    searchNoResults: (term: string) => string;
    totalRange: (total: number, start: number, end: number) => string;
    empty: string;
    noSearchMatch: string;
    studioHint: string;
    backHome: string;
    pageSuffix: (page: number, search?: string) => string;
    descriptionAll: string;
    descriptionCategory: (label: string) => string;
    descriptionSection: (label: string) => string;
    descriptionSearch: (term: string) => string;
    paginationAria: string;
    prev: string;
    next: string;
    viewModeAria: string;
    viewLabel: string;
    viewGrid: string;
    viewList: string;
  };
  article: {
    backHome: string;
    koreanOnlyBanner: string;
    relatedStories: (label: string) => string;
    viewMore: string;
    addToPokit: {
      ariaLabel: string;
      title: string;
      button: string;
      sent: string;
      fallback: string;
      download: string;
    };
  };
  appDownload: {
    kicker: string;
    title: string;
    download: string;
    qrAria: string;
    qrHint: string;
  };
  notFound: {
    title: string;
    description: string;
    home: string;
    allStories: string;
  };
  privacy: {
    title: string;
    description: string;
    body: string;
    contact: string;
    backHome: string;
  };
  support: {
    title: string;
    description: string;
    intro: string;
    email: string;
    sendMail: string;
    backHome: string;
  };
  categories: {
    Affairs: string;
    Routine: string;
    Radio: string;
    Design: string;
    Wellness: string;
    design: string;
  };
  sectionHeading: {
    viewAll: string;
  };
  languageSwitcher: {
    label: string;
    ko: string;
    en: string;
  };
  dates: {
    intl: string;
  };
};
