import { isValidImageSource } from "@/sanity/image";
import type { ArticleCardData } from "@/sanity/types";

export function hasCoverImage(article: ArticleCardData) {
  return isValidImageSource(article.coverImage);
}

function dedupeArticles(articles: ArticleCardData[]) {
  const seen = new Set<string>();
  const merged: ArticleCardData[] = [];

  for (const article of articles) {
    if (seen.has(article.slug)) {
      continue;
    }
    seen.add(article.slug);
    merged.push(article);
  }

  return merged;
}

function publishedAtTime(article: ArticleCardData) {
  return article.publishedAt ? Date.parse(article.publishedAt) : 0;
}

/** Newest publishedAt first. Cover image is only a tiebreaker. */
export function buildArticlePool(...groups: ArticleCardData[][]) {
  return dedupeArticles(groups.flat()).sort((a, b) => {
    const byDate = publishedAtTime(b) - publishedAtTime(a);
    if (byDate !== 0) {
      return byDate;
    }

    const aHas = hasCoverImage(a) ? 0 : 1;
    const bHas = hasCoverImage(b) ? 0 : 1;
    return aHas - bHas;
  });
}

/** Union curated + pool, then keep newest-first order within the limit. */
export function mergeArticles(
  featured: ArticleCardData[],
  pool: ArticleCardData[],
  limit = 12,
): ArticleCardData[] {
  return buildArticlePool(featured, pool).slice(0, limit);
}

function filterByCategory(articles: ArticleCardData[], category: string) {
  return articles.filter((article) => article.category === category);
}

/** Same-category articles only, newest first (no cross-section mixing). */
export function mergeArticlesForCategory(
  curated: ArticleCardData[],
  allArticles: ArticleCardData[],
  category: string,
  limit = 12,
): ArticleCardData[] {
  const pool = buildArticlePool(filterByCategory(allArticles, category));
  return mergeArticles(filterByCategory(curated, category), pool, limit);
}

/** Space + selected Routine stories about space, desk, and home. Newest first. */
export function mergeArticlesForSpacePool(
  curated: ArticleCardData[],
  allArticles: ArticleCardData[],
  routineSlugs: readonly string[],
  limit = 12,
): ArticleCardData[] {
  const routineSlugSet = new Set(routineSlugs);
  const isInSpacePool = (article: ArticleCardData) =>
    article.category === "Space" ||
    (article.category === "Routine" && routineSlugSet.has(article.slug));

  const pool = buildArticlePool(allArticles.filter(isInSpacePool));
  return mergeArticles(curated.filter(isInSpacePool), pool, limit);
}
