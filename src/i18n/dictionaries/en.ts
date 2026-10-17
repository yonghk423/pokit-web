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
        nav: "On the Go",
        kicker: "On the Go",
        title: "Daily moments in motion and pause",
      },
      space: {
        nav: "Space",
        kicker: "Space",
        title: "Reshape the spaces in your daily life",
      },
      sleep: {
        nav: "Wind Down",
        kicker: "Wind Down",
        title: "Evening routines that close the day",
      },
      wellness: {
        nav: "Wellness",
        kicker: "Wellness",
        title: "Daily wellness: ten minutes for your body",
      },
    },
    radioEmpty: (sectionNav) =>
      `Connect 3 stories in Home Page → ${sectionNav}.`,
    viewAllStories: "Browse all daily routine & wellness stories →",
    heroLine1: "Daily routines & wellness.",
    heroAccent: "Pocket",
    heroRest: "guide.",
    feedTitle: "Latest stories",
    workLine1: "Scenes of the day,",
    workAccent: "woven",
    workRest: "into routines.",
    labsLine1: "Tools that hold",
    labsAccent: "onto",
    labsRest: "the day.",
    aboutTitle:
      "POKIT is a pocket guide for building wellness through small daily routines.",
    aboutBody:
      "From weekly rhythm to commute, space, sleep, and recovery.\nOne light scene at a time can reshape the day.",
    aboutCta: "Explore the app",
    exploreAll: "Explore all",
    closePreview: "Back to list",
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
    pastTools: "Earlier tools",
    empty: "No routine tools lists published yet.",
    backToHub: "← All routine tools",
    viewFull: "View full",
    viewAll: "All tools",
    allTools: "All tools",
    allToolsCount: (total) => `${total} tools`,
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
    Commute: "On the Go",
    Space: "Space",
    Sleep: "Wind Down",
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
