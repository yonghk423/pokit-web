import {
  articleCategoryIds,
  isArticleCategoryId,
  normalizeArticleCategory,
} from "@/content/categories";
import type { createTranslator } from "@/i18n/create-translator";
import type { ArchiveMessages } from "@/i18n/get-archive-messages";
import type { Locale } from "@/i18n/config";
import type { CategoryLabels } from "@/i18n/category-labels";
import { homeSections } from "@/content/home";

/** Sanity CMS category → localized label */
export function getCategoryLabel(category: string, labels: CategoryLabels) {
  const normalized = normalizeArticleCategory(category);
  if (isArticleCategoryId(normalized)) {
    return labels[normalized];
  }
  return category;
}

export function getArchiveSectionLabel(section: string, labels: CategoryLabels) {
  if (section === homeSections.space.archiveSection) {
    return labels.Space;
  }
  return section;
}

export function isArchiveSection(section: string) {
  return section === homeSections.space.archiveSection;
}

export function getArchiveHeading(
  labels: CategoryLabels,
  t: ReturnType<typeof createTranslator<ArchiveMessages>>,
  category?: string,
  section?: string,
) {
  if (section) {
    return t("{{label}} 이야기", { label: getArchiveSectionLabel(section, labels) });
  }
  if (category) {
    return t("{{label}} 이야기", { label: getCategoryLabel(category, labels) });
  }
  return t("모든 이야기");
}

export { articleCategoryIds };

export type { Locale };
