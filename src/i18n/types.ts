import type { CommonCopy } from "./create-common-copy";
import type { HomeCopy } from "./create-home-copy";

export type Dictionary = LegacyDictionary & CommonCopy & { home: HomeCopy };

export type LegacyDictionary = {
  briefing: {
    nav: string;
    kicker: string;
    hubTitle: string;
    hubDescription: string;
    weekTitle: (weekLabel: string) => string;
    weekDescription: (title: string) => string;
    sourceLabel: string;
    readSourceLabel: string;
    editorNoteLabel: string;
    relatedLabel: string;
    archiveTitle: string;
    empty: string;
    backToHub: string;
    viewFull: string;
    metaDescriptionFromItems: (headlines: string[]) => string;
  };
  newArrivals: {
    nav: string;
    kicker: string;
    hubTitle: string;
    hubDescription: string;
    weekTitle: (weekLabel: string) => string;
    weekDescription: (title: string) => string;
    sourceLabel: string;
    readSourceLabel: string;
    productLabel: string;
    archiveTitle: string;
    pastTools: string;
    empty: string;
    backToHub: string;
    viewFull: string;
    viewAll: string;
    allTools: string;
    allToolsCount: (total: number) => string;
    metaDescriptionFromItems: (names: string[]) => string;
    localeFallbackBanner: string;
  };
  dates: {
    intl: string;
  };
};
