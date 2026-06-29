const CATEGORY_KEY_BY_LABEL: Record<string, string> = {
  Affairs: "weekly_reset",
  Routine: "routine",
  Radio: "commute_rest",
  Design: "space",
  Wellness: "wellness",
};

/** CMS category → 앱 매핑용 snake_case. article.categoryKey가 있으면 우선. */
export function resolveCategoryKey(category: string, categoryKey?: string) {
  if (categoryKey?.trim()) {
    return categoryKey.trim();
  }
  return CATEGORY_KEY_BY_LABEL[category] ?? category.toLowerCase().replace(/\s+/g, "_");
}
