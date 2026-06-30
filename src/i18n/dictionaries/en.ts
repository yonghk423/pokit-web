import type { Dictionary } from "@/i18n/types";

const dictionary: Dictionary = {
  meta: {
    siteTitle: "POKIT — Everyday wellness guides",
    siteDescription:
      "Guides and an app for building wellness through small daily routines. Discover routine and wellness stories on POKIT.",
  },
  header: {
    tagline: "Daily pocket intelligence for better routines",
    openMenu: "Open menu",
    homeAria: "POKIT home",
    allStories: "All stories",
    app: "App",
    contact: "Contact",
    categoriesAria: "Categories",
  },
  footer: {
    tagline: "Global affairs for your body, desk and day.",
    sections: "Sections",
    information: "Information",
    allStories: "All stories",
    privacy: "Privacy Policy",
    support: "Support",
    rights: "All rights reserved.",
  },
  home: {
    inboxTagline: "Daily inbox intelligence from POKIT",
    radio: {
      ariaLabel: "POKIT Radio",
      onAir: "On Air",
      deskKicker: "The Wellness Desk",
      deskTitle: "How to reclaim your body's rhythm at your desk",
      listenLive: "Listen Live",
      continentalKicker: "The Continental Shift",
      continentalDesc: "Gentle morning music and routine news",
      topHourKicker: "Top of the Hour",
      topHourDesc: "Short headlines to reset your day",
    },
    sections: {
      affairs: {
        nav: "This week",
        kicker: "This week",
        title: "Stories to open your week",
      },
      spotlight: {
        nav: "Routines",
        kicker: "Routines",
        title: "Routines worth starting now",
      },
      radio: {
        nav: "Commute & rest",
        kicker: "Commute & rest",
        title: "Time in motion and time to pause",
      },
      design: {
        nav: "Space",
        kicker: "Space",
        title: "Stories for reshaping your space",
      },
      wellness: {
        nav: "Wellness",
        kicker: "Wellness",
        title: "Ten minutes for your body on a busy day",
      },
    },
    storiesAria: (label) => `${label} stories`,
    radioEmpty: (sectionNav) =>
      `Connect 3 stories in Home Page → ${sectionNav}.`,
    viewAllStories: "Browse all stories →",
    carouselPrev: (label) => `Previous: ${label}`,
    carouselNext: (label) => `Next: ${label}`,
  },
  archive: {
    label: "Archive",
    allStories: "All stories",
    storiesIn: (label) => `${label} stories`,
    search: "Search",
    searchPlaceholder: "Title, description, keywords",
    searchSubmit: "Search",
    clearSearch: "Clear search",
    clearFilters: "Clear filters · view all stories",
    searchResults: (term, total, start, end) =>
      `"${term}" — ${total} results · showing ${start}–${end}`,
    searchNoResults: (term) => `No stories match "${term}".`,
    totalRange: (total, start, end) =>
      `${total} stories · showing ${start}–${end} (newest first)`,
    empty: "No stories have been published yet.",
    noSearchMatch: "Try a different search term or clear your search.",
    studioHint: "Stories published in Sanity Studio will appear here.",
    backHome: "← Back to home",
    pageSuffix: (page, search) =>
      search ? ` (page ${page} · "${search}")` : ` (page ${page})`,
    descriptionAll: "Browse every story published on POKIT, newest first.",
    descriptionCategory: (label) =>
      `${label} stories on POKIT, sorted by newest.`,
    descriptionSection: (label) =>
      `${label} stories on POKIT, sorted by newest.`,
    descriptionSearch: (term) =>
      `Results for "${term}" — stories published on POKIT.`,
    paginationAria: "Story archive pages",
    prev: "← Previous",
    next: "Next →",
    viewModeAria: "View mode",
    viewLabel: "View",
    viewGrid: "Grid",
    viewList: "List",
  },
  article: {
    backHome: "← Back to POKIT",
    koreanOnlyBanner:
      "This story is not yet available in English. Showing the Korean original.",
    relatedStories: (label) => `More ${label.toLowerCase()} stories`,
    viewMore: "View more →",
    addToPokit: {
      ariaLabel: "Save this routine to the POKIT app",
      title: "Save this routine to your app",
      button: "Add to POKIT",
      sent: "You can finish saving in the app",
      fallback: "Track routines and organize your day in the POKIT app.",
      download: "Download on the App Store",
    },
  },
  appDownload: {
    kicker: "Want more stories like these in your pocket?",
    title: "Track routines and organize your day in the POKIT app.",
    download: "Download on the App Store",
    qrAria: "POKIT App Store QR code",
    qrHint: "Scan with your iPhone camera to install",
  },
  notFound: {
    title: "Page not found",
    description: "The address may have changed or the page may have been removed.",
    home: "Home",
    allStories: "All stories",
  },
  privacy: {
    title: "Privacy Policy",
    description: "POKIT Privacy Policy",
    body: "We are rebuilding this site. This policy will be updated before the official launch.",
    contact: "Contact",
    backHome: "← Back to home",
  },
  support: {
    title: "Support",
    description: "POKIT support",
    intro: "For questions about the site or app, email us below.",
    email: "Email",
    sendMail: "Send email",
    backHome: "← Back to home",
  },
  categories: {
    Affairs: "This week",
    Routine: "Routines",
    Radio: "Commute & rest",
    Design: "Space",
    Wellness: "Wellness",
    design: "Space",
  },
  sectionHeading: {
    viewAll: "View more",
  },
  languageSwitcher: {
    label: "Language",
    ko: "한국어",
    en: "English",
  },
  dates: {
    intl: "en-US",
  },
};

export default dictionary;
