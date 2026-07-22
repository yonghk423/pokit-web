import type { ArticleCategoryId } from "@/content/categories";

export const sectionOrder = [
  "weekly",
  "routine",
  "commute",
  "space",
  "sleep",
  "wellness",
] as const;

export type HomeSectionId = (typeof sectionOrder)[number];

/** Locale-independent home section wiring (Sanity categories, archive filters). */
export const homeSections = {
  weekly: {
    id: "weekly",
    archiveCategory: "Weekly" satisfies ArticleCategoryId,
  },
  routine: {
    id: "routine",
    archiveCategory: "Routine" satisfies ArticleCategoryId,
  },
  commute: {
    id: "commute",
    archiveCategory: "Commute" satisfies ArticleCategoryId,
  },
  space: {
    id: "space",
    archiveSection: "space",
    spaceRoutineSlugs: [
      "minimal-desk-design",
      "kitchen-dish-minimal",
      "home-workout-session",
      "afternoon-focus-reset",
      "phone-outside-bedroom",
      "evening-phone-basket",
      "desk-stretch-5min",
    ],
  },
  sleep: {
    id: "sleep",
    archiveCategory: "Sleep" satisfies ArticleCategoryId,
  },
  wellness: {
    id: "wellness",
    archiveCategory: "Wellness" satisfies ArticleCategoryId,
  },
} as const satisfies Record<
  HomeSectionId,
  {
    id: string;
    archiveCategory?: string;
    archiveSection?: string;
    spaceRoutineSlugs?: readonly string[];
  }
>;
