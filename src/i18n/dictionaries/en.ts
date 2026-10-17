import type { LegacyDictionary } from "@/i18n/types";

const dictionary: LegacyDictionary = {
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
