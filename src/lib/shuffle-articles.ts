/** Fisher–Yates shuffle — returns a new array, does not mutate input. */
export function shuffleArticles<T>(items: readonly T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

type DatedArticle = {
  slug: string;
  publishedAt?: string;
};

/**
 * Pin the newest article(s) at the front, shuffle the rest.
 * First paint / entry always leads with the latest published story.
 */
export function shuffleArticlesKeepingNewest<T extends DatedArticle>(
  items: readonly T[],
  keepNewest = 1,
): T[] {
  if (items.length <= keepNewest) {
    return [...items];
  }

  const byNewest = [...items].sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });

  const pinned = byNewest.slice(0, keepNewest);
  const pinnedSlugs = new Set(pinned.map((article) => article.slug));
  const rest = items.filter((article) => !pinnedSlugs.has(article.slug));

  return [...pinned, ...shuffleArticles(rest)];
}
