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

/** Pool backfill: cover image first, then original order. */
export function buildArticlePool(...groups: ArticleCardData[][]) {
  return dedupeArticles(groups.flat()).sort((a, b) => {
    const aHas = hasCoverImage(a) ? 0 : 1;
    const bHas = hasCoverImage(b) ? 0 : 1;
    return aHas - bHas;
  });
}

export function mergeArticles(
  featured: ArticleCardData[],
  pool: ArticleCardData[],
  limit = 12,
): ArticleCardData[] {
  const seen = new Set<string>();
  const merged: ArticleCardData[] = [];

  for (const article of [...featured, ...pool]) {
    if (seen.has(article.slug)) {
      continue;
    }
    seen.add(article.slug);
    merged.push(article);
    if (merged.length >= limit) {
      break;
    }
  }

  return merged;
}

function filterByCategory(articles: ArticleCardData[], category: string) {
  return articles.filter((article) => article.category === category);
}

/** Curated picks + same-category backfill only (no cross-section mixing). */
export function mergeArticlesForCategory(
  curated: ArticleCardData[],
  allArticles: ArticleCardData[],
  category: string,
  limit = 12,
): ArticleCardData[] {
  const pool = buildArticlePool(filterByCategory(allArticles, category));
  return mergeArticles(filterByCategory(curated, category), pool, limit);
}

/** Design + selected Routine stories about space, desk, and home. */
export function mergeArticlesForSpacePool(
  curated: ArticleCardData[],
  allArticles: ArticleCardData[],
  routineSlugs: readonly string[],
  limit = 12,
): ArticleCardData[] {
  const routineSlugSet = new Set(routineSlugs);
  const isInSpacePool = (article: ArticleCardData) =>
    article.category === "Design" ||
    (article.category === "Routine" && routineSlugSet.has(article.slug));

  const pool = buildArticlePool(allArticles.filter(isInSpacePool));
  return mergeArticles(curated.filter(isInSpacePool), pool, limit);
}
