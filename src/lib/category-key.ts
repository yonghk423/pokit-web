import {
  articleCategories,
  legacyCategoryAliases,
  normalizeArticleCategory,
  type ArticleCategoryId,
} from "@/content/categories";

/** CMS category → 앱 매핑용 snake_case. article.categoryKey가 있으면 우선. */
export function resolveCategoryKey(category: string, categoryKey?: string) {
  if (categoryKey?.trim()) {
    return categoryKey.trim();
  }

  const normalized = normalizeArticleCategory(category);
  if (normalized in articleCategories) {
    return articleCategories[normalized as ArticleCategoryId].categoryKey;
  }

  if (category in legacyCategoryAliases) {
    return articleCategories[legacyCategoryAliases[category]].categoryKey;
  }

  return category.toLowerCase().replace(/\s+/g, "_");
}
