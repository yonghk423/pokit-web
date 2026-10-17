import type { LegacyDictionary } from "@/i18n/types";

const dictionary: LegacyDictionary = {
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
  dates: {
    intl: "en-US",
  },
};

export default dictionary;
