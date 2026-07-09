import {
  articleCategoryIds,
  isArticleCategoryId,
  normalizeArticleCategory,
} from "@/content/categories";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { homeSections } from "@/content/home";

/** Sanity CMS category → localized label */
export function getCategoryLabel(category: string, dict: Dictionary) {
  const normalized = normalizeArticleCategory(category);
  if (isArticleCategoryId(normalized)) {
    return dict.categories[normalized];
  }
  return category;
}

export function getArchiveSectionLabel(section: string, dict: Dictionary) {
  if (section === "design") {
    return dict.categories.Space;
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

export { articleCategoryIds };

export type { Locale };
