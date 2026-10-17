import {
  articleCategoryIds,
  isArticleCategoryId,
  normalizeArticleCategory,
} from "@/content/categories";
import type { createTranslator } from "@/i18n/create-translator";
import type { ArchiveMessages } from "@/i18n/get-archive-messages";
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
  if (section === homeSections.space.archiveSection) {
    return dict.categories.Space;
  }
  return section;
}

export function isArchiveSection(section: string) {
  return section === homeSections.space.archiveSection;
}

export function getArchiveHeading(
  dict: Dictionary,
  t: ReturnType<typeof createTranslator<ArchiveMessages>>,
  category?: string,
  section?: string,
) {
  if (section) {
    return t("{{label}} 이야기", { label: getArchiveSectionLabel(section, dict) });
  }
  if (category) {
    return t("{{label}} 이야기", { label: getCategoryLabel(category, dict) });
  }
  return t("모든 이야기");
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
