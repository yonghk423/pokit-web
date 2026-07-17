import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { withLocale } from "@/lib/locale-path";
import { homeSections } from "@/content/home";
import { normalizeArticleCategory } from "@/content/categories";
import { getArchiveSectionLabel, getCategoryLabel } from "@/lib/category-label";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import {
  ARTICLES_COUNT_BY_CATEGORY_QUERY,
  ARTICLES_COUNT_QUERY,
  ARTICLES_DESIGN_SPACE_COUNT_QUERY,
  ARTICLES_DESIGN_SPACE_PAGINATED_QUERY,
  ARTICLES_PAGINATED_BY_CATEGORY_QUERY,
  ARTICLES_PAGINATED_QUERY,
} from "@/sanity/lib/queries";
import type { ArticleCardData } from "@/sanity/types";

export const ARTICLES_PER_PAGE = 12;

export type PaginatedArticles = {
  articles: ArticleCardData[];
  total: number;
  page: number;
  totalPages: number;
  category?: string;
  section?: string;
  q?: string;
};

function searchQueryParams(q?: string) {
  const term = q?.trim() ?? "";
  return {
    q: term,
    pattern: term ? `*${term}*` : "",
  };
}

const designSpaceParams = {
  routineSlugs: [...(homeSections.space.spaceRoutineSlugs ?? [])],
};

export async function getPaginatedArticles(
  page: number,
  locale: Locale,
  category?: string,
  q?: string,
  section?: string,
): Promise<PaginatedArticles> {
  const empty: PaginatedArticles = {
    articles: [],
    total: 0,
    page: 1,
    totalPages: 0,
    category,
    section,
    q: q?.trim() || undefined,
  };

  if (!isSanityConfigured() || !client) {
    return empty;
  }

  const start = (page - 1) * ARTICLES_PER_PAGE;
  const end = start + ARTICLES_PER_PAGE;
  const search = searchQueryParams(q);

  let articlesQuery = ARTICLES_PAGINATED_QUERY;
  let countQuery = ARTICLES_COUNT_QUERY;
  let queryParams: Record<string, unknown> = { start, end, locale, ...search };

  if (section === homeSections.space.archiveSection) {
    articlesQuery = ARTICLES_DESIGN_SPACE_PAGINATED_QUERY;
    countQuery = ARTICLES_DESIGN_SPACE_COUNT_QUERY;
    queryParams = { start, end, locale, ...search, ...designSpaceParams };
  } else if (category) {
    articlesQuery = ARTICLES_PAGINATED_BY_CATEGORY_QUERY;
    countQuery = ARTICLES_COUNT_BY_CATEGORY_QUERY;
    queryParams = {
      start,
      end,
      category: normalizeArticleCategory(category),
      locale,
      ...search,
    };
  }

  const [articles, total] = await Promise.all([
    client.fetch<ArticleCardData[]>(articlesQuery, queryParams, sanityFetchOptions),
    client.fetch<number>(countQuery, queryParams, sanityFetchOptions),
  ]);

  const totalPages = total === 0 ? 0 : Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE));

  return {
    articles,
    total,
    page,
    totalPages,
    category,
    section,
    q: search.q || undefined,
  };
}

export function articlesArchiveHref(
  locale: Locale,
  page = 1,
  category?: string,
  q?: string,
  section?: string,
) {
  const params = new URLSearchParams();
  const term = q?.trim();

  if (section) {
    params.set("section", section);
  } else if (category) {
    params.set("category", category);
  }
  if (term) {
    params.set("q", term);
  }
  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  const path = query ? `/articles?${query}` : "/articles";
  return withLocale(locale, path);
}

export type RelatedArticlesResult = {
  articles: ArticleCardData[];
  label: string;
  viewAllHref: string;
};

export async function getRelatedArticles(
  slug: string,
  category: string,
  locale: Locale,
  dict: Dictionary,
): Promise<RelatedArticlesResult | null> {
  if (!isSanityConfigured() || !client) {
    return null;
  }

  const normalizedCategory = normalizeArticleCategory(category);
  const designRoutineSlugSet = new Set<string>(homeSections.space.spaceRoutineSlugs ?? []);
  const inDesignSpace =
    normalizedCategory === "Space" ||
    (normalizedCategory === "Routine" && designRoutineSlugSet.has(slug));

  const { RELATED_BY_CATEGORY_QUERY, RELATED_DESIGN_SPACE_QUERY } = await import(
    "@/sanity/lib/queries"
  );

  const articles = await client.fetch<ArticleCardData[]>(
    inDesignSpace ? RELATED_DESIGN_SPACE_QUERY : RELATED_BY_CATEGORY_QUERY,
    inDesignSpace
      ? {
          slug,
          limit: 4,
          routineSlugs: [...designRoutineSlugSet],
          locale,
        }
      : { slug, category: normalizedCategory, limit: 4, locale },
    sanityFetchOptions,
  );

  if (articles.length === 0) {
    return null;
  }

  return {
    articles,
    label: inDesignSpace
      ? getArchiveSectionLabel(homeSections.space.archiveSection!, dict)
      : getCategoryLabel(normalizedCategory, dict),
    viewAllHref: inDesignSpace
      ? articlesArchiveHref(locale, 1, undefined, undefined, homeSections.space.archiveSection)
      : articlesArchiveHref(locale, 1, normalizedCategory),
  };
}
