import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { homeSections } from "@/content/home";

const CATEGORY_KEYS = ["Affairs", "Routine", "Radio", "Design", "Wellness"] as const;

/** Sanity CMS category → localized label */
export function getCategoryLabel(category: string, dict: Dictionary) {
  if (CATEGORY_KEYS.includes(category as (typeof CATEGORY_KEYS)[number])) {
    return dict.categories[category as keyof typeof dict.categories];
  }
  return category;
}

export function getArchiveSectionLabel(section: string, dict: Dictionary) {
  if (section === "design") {
    return dict.categories.design;
  }
  return section;
}

export function isArchiveSection(section: string) {
  return section === homeSections.design.archiveSection;
}

export function getArchiveHeading(
  dict: Dictionary,
  category?: string,
  section?: string,
) {
  if (section) {
    return dict.archive.storiesIn(getArchiveSectionLabel(section, dict));
  }
  if (category) {
    return dict.archive.storiesIn(getCategoryLabel(category, dict));
  }
  return dict.archive.allStories;
}

export function getHomeSectionCopy(dict: Dictionary, sectionId: keyof typeof homeSections) {
  return dict.home.sections[sectionId];
}

export function getCategories(dict: Dictionary) {
  return (Object.keys(homeSections) as Array<keyof typeof homeSections>).map((key) => ({
    id: homeSections[key].id,
    label: dict.home.sections[key].nav,
  }));
}

export type { Locale };
