import type { Dictionary } from "@/i18n/types";

const dictionary: Dictionary = {
  meta: {
    siteTitle: "POKIT — Daily wellness routines",
    siteDescription:
      "Guides and an app for building wellness through small daily routines. Explore daily life, routine, and wellness stories on POKIT.",
  },
  header: {
    tagline: "A pocket guide for daily routines and wellness",
    openMenu: "Open menu",
    homeAria: "POKIT home",
    allStories: "All stories",
    app: "App",
    contact: "Contact",
    categoriesAria: "Categories",
  },
  footer: {
    tagline: "Shape your day with daily routines and wellness.",
    sections: "Sections",
    information: "Information",
    allStories: "All stories",
    support: "Support",
    briefing: "Wellness briefing",
    newArrivals: "Routine tools",
    rights: "All rights reserved.",
  },
  home: {
    inboxTagline: "Daily routine & wellness intelligence by POKIT",
    digest: {
      ariaLabel: "Home digest",
      brandKicker: "POKIT",
      brandTagline: "Daily wellness routine guides",
      featuredKicker: "This week",
      featuredTitle: "How to reclaim your body's rhythm at your desk",
      routineDesc: "Daily routines worth starting now",
      commuteDesc: "Daily routines for time in motion and pause",
    },
    sections: {
      weekly: {
        nav: "This week",
        kicker: "This week",
        title: "Stories to open your daily week",
      },
      newArrivals: {
        nav: "Tools",
        kicker: "Routine tools",
        title: "Tools that lift productivity & wellness",
      },
      routine: {
        nav: "Routines",
        kicker: "Routines",
        title: "Daily routines worth starting now",
      },
      commute: {
        nav: "Commute & rest",
        kicker: "Commute & rest",
        title: "Daily moments in motion and pause",
      },
      space: {
        nav: "Space",
        kicker: "Space",
        title: "Reshape the spaces in your daily life",
      },
      sleep: {
        nav: "Sleep & night",
        kicker: "Sleep & night",
        title: "Evening routines that close the day",
      },
      wellness: {
        nav: "Wellness",
        kicker: "Wellness",
        title: "Daily wellness: ten minutes for your body",
      },
    },
    wellnessBriefing: {
      kicker: "Weekly briefing",
      sourceLabel: "Source",
      readSourceLabel: "Read source",
      viewAll: "Full briefing",
    },
    storiesAria: (label) => `${label} stories`,
    radioEmpty: (sectionNav) =>
      `Connect 3 stories in Home Page → ${sectionNav}.`,
    viewAllStories: "Browse all daily routine & wellness stories →",
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
    totalRange: (total, start, end, sortLabel) =>
      `${total} stories · showing ${start}–${end} (${sortLabel})`,
    empty: "No stories have been published yet.",
    noSearchMatch: "Try a different search term or clear your search.",
    studioHint: "Stories published in Sanity Studio will appear here.",
    backHome: "← Back to home",
    pageSuffix: (page, search) =>
      search ? ` (page ${page} · "${search}")` : ` (page ${page})`,
    descriptionAll:
      "Daily routines and wellness guides — browse every story on POKIT.",
    descriptionCategory: (label) =>
      `${label} — daily routine and wellness stories on POKIT.`,
    descriptionSection: (label) =>
      `${label} — daily routine and wellness stories on POKIT.`,
    descriptionSearch: (term) =>
      `Results for "${term}" — daily routine and wellness stories on POKIT.`,
    paginationAria: "Story archive pages",
    prev: "← Previous",
    next: "Next →",
    viewModeAria: "View mode",
    viewLabel: "View",
    viewGrid: "Grid",
    viewList: "List",
    sortAria: "Sort order",
    sortNewest: "Newest",
    sortOldest: "Oldest",
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
      fallback: "Track daily routines and protect your wellness in the POKIT app.",
      download: "Download on the App Store",
      qrAria: "POKIT App Store QR code",
      qrHint: "Scan with your phone camera to install",
    },
  },
  appDownload: {
    kicker: "Carry daily routines and wellness in your pocket",
    title: "Track daily routines and protect your wellness in the POKIT app.",
    download: "Download on the App Store",
    qrAria: "POKIT App Store QR code",
    qrHint: "Scan with your phone camera to install",
  },
  notFound: {
    title: "Page not found",
    description: "The address may have changed or the page may have been removed.",
    home: "Home",
    allStories: "All stories",
  },
  support: {
    title: "Support",
    description: "POKIT support",
    intro: "For questions about the site or app, email us below.",
    email: "Email",
    sendMail: "Send email",
    backHome: "← Back to home",
  },
  briefing: {
    nav: "Wellness briefing",
    kicker: "Weekly briefing",
    hubTitle: "Wellness briefing",
    hubDescription:
      "POKIT summarizes public-health and wellness updates and ties them to daily routines. Read the original at the source.",
    weekTitle: (weekLabel) => `Wellness briefing · ${weekLabel}`,
    weekDescription: (title) =>
      `${title} — a weekly curation through a daily-routine lens | POKIT`,
    sourceLabel: "Source",
    readSourceLabel: "Read source",
    editorNoteLabel: "POKIT note",
    relatedLabel: "Related stories",
    archiveTitle: "Past briefings",
    empty: "No briefings published yet.",
    backToHub: "← All briefings",
    viewFull: "View full",
    metaDescriptionFromItems: (headlines) => {
      const joined = headlines.slice(0, 3).join(" · ");
      return joined
        ? `${joined} — POKIT weekly wellness briefing`
        : "Weekly wellness updates, summarized for daily routines — POKIT";
    },
  },
  newArrivals: {
    nav: "Routine tools",
    kicker: "Routine tools",
    hubTitle: "Routine tools",
    hubDescription:
      "Recommended tools for productivity, health, and wellness — tied to real daily scenes, not a new-product dump.",
    weekTitle: (weekLabel) => `Routine tools · ${weekLabel}`,
    weekDescription: (title) =>
      `${title} — tools that support better daily routines | POKIT`,
    sourceLabel: "Why",
    readSourceLabel: "View source",
    productLabel: "Reference link",
    archiveTitle: "Past routine tools",
    empty: "No routine tools lists published yet.",
    backToHub: "← All routine tools",
    viewFull: "View full",
    viewAll: "All tools",
    metaDescriptionFromItems: (names) => {
      const joined = names.slice(0, 3).join(" · ");
      return joined
        ? `${joined} — POKIT routine tool picks`
        : "Tools for productivity and wellness — POKIT";
    },
  },
  categories: {
    Weekly: "This week",
    Routine: "Routines",
    Commute: "Commute & rest",
    Space: "Space",
    Sleep: "Sleep & night",
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
