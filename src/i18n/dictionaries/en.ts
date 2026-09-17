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
    support: "App support",
    briefing: "Wellness briefing",
    newArrivals: "Routine tools",
    app: "App",
    rights: "All rights reserved.",
  },
  home: {
    inboxTagline: "Daily routine & wellness by POKIT",
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
    heroLine1: "Daily routines & wellness.",
    heroAccent: "Pocket",
    heroRest: "guide.",
    feedTitle: "Latest stories",
    workLine1: "Scenes of the day,",
    workAccent: "woven",
    workRest: "into routines.",
    labsLine1: "Tools we try,",
    labsAccent: "and",
    labsRest: "keep using.",
    aboutTitle:
      "POKIT is a pocket guide for building wellness through small daily routines.",
    aboutBody:
      "From weekly rhythm to commute, space, sleep, and recovery.\nOne light scene at a time can reshape the day.",
    aboutCta: "Explore the app",
    exploreAll: "Explore all",
    closePreview: "Back to list",
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
      `"${term}" · ${total} results · showing ${start}-${end}`,
    searchNoResults: (term) => `No stories match "${term}".`,
    totalRange: (total, start, end, sortLabel) =>
      `${total} stories · showing ${start}-${end} (${sortLabel})`,
    empty: "No stories have been published yet.",
    noSearchMatch: "Try a different search term or clear your search.",
    studioHint: "Stories published in Sanity Studio will appear here.",
    backHome: "← Back to home",
    pageSuffix: (page, search) =>
      search ? ` (page ${page} · "${search}")` : ` (page ${page})`,
    descriptionAll:
      "Daily routines and wellness guides. Browse every story on POKIT.",
    descriptionCategory: (label) =>
      `${label}. Daily routine and wellness stories on POKIT.`,
    descriptionSection: (label) =>
      `${label}. Daily routine and wellness stories on POKIT.`,
    descriptionSearch: (term) =>
      `Results for "${term}". Daily routine and wellness stories on POKIT.`,
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
    qrTitle: "Scan this now",
    qrHint: "Point your camera here to install",
    heroAside: "POKIT - Daily Habit Planner",
  },
  appPage: {
    metaTitle: "POKIT App",
    metaDescription:
      "Set your day bounds, then keep routines, tasks, memos, and history in one place. Start your daily rhythm with the POKIT app.",
    kicker: "App",
    title: "Your day, in a pocket. POKIT",
    lead: "The things you need today, in one pocket. From routines to tasks, memos, and a log of the day. Keep the small things you need each day in POKIT.",
    download: "Get it on the App Store",
    featuresHeading: "Open the app, and this is how you'll use it",
    features: [
      {
        id: "routines",
        title: "Today's routines, start here",
        body: "Taking your medicine, logging your weight,\nentering the numbers that help you track change,\nchecking off what you need to do today.\n\nThe routines we need are different for everyone.\n\nBut when each need points to a different app,\nstaying consistent often gets harder, not easier.\n\nPOKIT keeps many kinds of routines in one pocket,\nso you can record and continue them in the way that fits you.\n\nTake out the routines you need today,\nand fill your day one by one.",
        imageAlt: "POKIT app Today screen with the daily routine list",
      },
      {
        id: "memo",
        title: "Notes you can see on the lock screen",
        body: "What you want to remember, right in front of you. Write down a thought you do not want to lose, or something you have to keep in mind today. Leave it on the lock screen so you see it every time you wake your phone.",
        imageAlt: "POKIT quick memo on the iPhone lock screen",
      },
      {
        id: "notes",
        title: "Today's note, write the day down",
        body: "Today's thoughts, as today's record. It does not have to be long. What happened today, what came to mind, and what you need tomorrow. Leave the day in a way that feels easy.",
        imageAlt: "POKIT app Today note screen",
      },
      {
        id: "todos",
        title: "Not a routine? Use a checklist",
        body: "Some things only need to get done today, not every day. Those do not have to become routines. Put them on your to-do list, then check them off one by one.",
        imageAlt: "POKIT to-do list screen",
      },
      {
        id: "history",
        title: "Look back at what you kept up",
        body: "Look back at the days you have already lived. Which routines you kept this week, and what you did most this month. Watch the record grow, and take a slow look at your days.",
        imageAlt: "POKIT monthly history and completion screen",
      },
      {
        id: "library",
        title: "Books, and how far you've read",
        body: "The book you are reading, in your own pocket too. Keep what you are reading now, what you plan to read, and what you have finished, in one place. Leave how far you got, and the next time you open it feels lighter.",
        imageAlt: "POKIT My Library screen",
      },
    ],
    galleryHeading: "Want a quick look?",
    galleryLead: "The screen you need, when you need it.",
    galleryBody:
      "From today's routines to memos and history. Meet a day in POKIT for yourself.",
    ctaKicker: "Start now",
    ctaTitle: "Install POKIT and fill in today, bit by bit.",
    ctaBody:
      "Put what you need today into POKIT. Routines, memos, and the things you have to do. Start with the small things the day needs. Begin today a little lighter with POKIT.",
    ctaQrHint: "Scan the QR code with your camera to start POKIT right away.",
  },
  notFound: {
    title: "Page not found",
    description: "The address may have changed or the page may have been removed.",
    home: "Home",
    allStories: "All stories",
  },
  support: {
    title: "POKIT Support",
    description: "About POKIT, screen guide, FAQ, and contact.",
    intro: "For questions about the site or app, email us below.",
    email: "Email",
    sendMail: "Send email",
    contactCta: "Contact us",
    contactHint: "If something is off, send us a note",
    backHome: "← Back to home",
    help: "Help & FAQ",
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
    localeFallbackBanner:
      "A Japanese translation is not ready yet. We show English when available, otherwise Korean.",
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
