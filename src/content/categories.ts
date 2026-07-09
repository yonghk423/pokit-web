/** Sanity article.category — POKIT 콘텐츠 분류 (내부 ID) */
export const articleCategoryIds = [
  "Weekly",
  "Routine",
  "Commute",
  "Space",
  "Wellness",
] as const;

export type ArticleCategoryId = (typeof articleCategoryIds)[number];

export const articleCategories = {
  Weekly: { categoryKey: "weekly_reset" },
  Routine: { categoryKey: "routine" },
  Commute: { categoryKey: "commute_rest" },
  Space: { categoryKey: "space" },
  Wellness: { categoryKey: "wellness" },
} as const satisfies Record<ArticleCategoryId, { categoryKey: string }>;

/** 이전 CMS 값 → 현재 카테고리 (북마크·앱 호환) */
export const legacyCategoryAliases: Record<string, ArticleCategoryId> = {
  Affairs: "Weekly",
  Radio: "Commute",
  Design: "Space",
};

export function isArticleCategoryId(value: string): value is ArticleCategoryId {
  return articleCategoryIds.includes(value as ArticleCategoryId);
}

export function normalizeArticleCategory(category: string): ArticleCategoryId | string {
  if (isArticleCategoryId(category)) {
    return category;
  }
  return legacyCategoryAliases[category] ?? category;
}

export function articleCategoryOptions() {
  return articleCategoryIds.map((id) => ({ title: id, value: id }));
}
