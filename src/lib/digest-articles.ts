import type { ArticleCardData } from "@/sanity/types";

/** 홈 다이제스트용 — 중복 slug 제거 후 풀 반환 */
export function buildDigestArticlePool(
  ...lists: ArticleCardData[][]
): ArticleCardData[] {
  const seen = new Set<string>();
  const pool: ArticleCardData[] = [];

  for (const list of lists) {
    for (const article of list) {
      if (seen.has(article.slug)) continue;
      seen.add(article.slug);
      pool.push(article);
    }
  }

  return pool;
}
