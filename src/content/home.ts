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
    archiveCategory: "Affairs",
  },
  spotlight: {
    id: "spotlight",
    archiveCategory: "Routine",
  },
  radio: {
    id: "radio",
    archiveCategory: "Radio",
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
    archiveCategory: "Wellness",
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
