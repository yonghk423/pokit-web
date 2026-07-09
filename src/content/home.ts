import type { ArticleCategoryId } from "@/content/categories";

export const sectionOrder = [
  "affairs",
  "spotlight",
  "radio",
  "design",
  "wellness",
] as const;

export type HomeSectionId = (typeof sectionOrder)[number];

/** Locale-independent home section wiring (Sanity categories, archive filters). */
export const homeSections = {
  affairs: {
    id: "affairs",
    archiveCategory: "Weekly" satisfies ArticleCategoryId,
  },
  spotlight: {
    id: "spotlight",
    archiveCategory: "Routine" satisfies ArticleCategoryId,
  },
  radio: {
    id: "radio",
    archiveCategory: "Commute" satisfies ArticleCategoryId,
  },
  design: {
    id: "design",
    archiveSection: "design",
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
