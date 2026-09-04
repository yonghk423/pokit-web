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
    app: "App",
    rights: "All rights reserved.",
  },
  home: {
    inboxTagline: "Daily routine & wellness intelligence by POKIT",
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
  appPage: {
    metaTitle: "POKIT App",
    metaDescription:
      "Set your day bounds, then keep routines, tasks, memos, and history in one place. Start your daily rhythm with the POKIT app.",
    kicker: "App",
    title: "Your day, in a pocket. POKIT",
    lead: "Keep routines, tasks, memos, and your streak in one app.",
    download: "Get it on the App Store",
    featuresHeading: "Open the app, and this is how you'll use it",
    features: [
      {
        id: "routines",
        title: "Today's routines, start here",
        body: "When you first open the app, you set when your day starts and ends. Then today's routines live on one screen. Mark what matters, check them off, and add more right there if you need to.",
        imageAlt: "POKIT app Today screen with the daily routine list",
      },
      {
        id: "memo",
        title: "Notes you can see on the lock screen",
        body: "Pin a memo you'll want to see often. Write it in the app, and it shows up when you wake your phone.",
        imageAlt: "POKIT quick memo on the iPhone lock screen",
      },
      {
        id: "notes",
        title: "Today's note, write the day down",
        body: "Keep what happened today, short thoughts, and to-dos in one place. Write in sentences, or keep a short list. Either works.",
        imageAlt: "POKIT app Today note screen",
      },
      {
        id: "todos",
        title: "Tasks, in order of what matters",
        body: "Add a time and priority, and you're done. Tap to check off, or long-press when something's finished.",
        imageAlt: "POKIT to-do list screen",
      },
      {
        id: "history",
        title: "Look back at what you kept up",
        body: "See how this week or month went at a glance. You'll also spot the routines you actually stick with.",
        imageAlt: "POKIT monthly history and completion screen",
      },
      {
        id: "library",
        title: "Keep the books you're reading",
        body: "Split what you're reading from what you've finished. It sits nicely next to your reading routine.",
        imageAlt: "POKIT My Library screen",
      },
    ],
    galleryHeading: "Want a quick look?",
    galleryLead: "From routines to history, here are the screens you'll use most.",
    ctaKicker: "Start now",
    ctaTitle: "Install POKIT and fill in today, bit by bit.",
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
    ja: "日本語",
  },
  dates: {
    intl: "en-US",
  },
};

export default dictionary;
