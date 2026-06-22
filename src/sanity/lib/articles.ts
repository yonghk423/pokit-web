import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  ARTICLES_COUNT_BY_CATEGORY_QUERY,
  ARTICLES_COUNT_QUERY,
  ARTICLES_PAGINATED_BY_CATEGORY_QUERY,
  ARTICLES_PAGINATED_QUERY,
} from "@/sanity/lib/queries";
import type { ArticleCardData } from "@/sanity/types";

const fetchOptions = { next: { revalidate: 60 } };

export const ARTICLES_PER_PAGE = 12;

export type PaginatedArticles = {
  articles: ArticleCardData[];
  total: number;
  page: number;
  totalPages: number;
  category?: string;
  q?: string;
};

function searchQueryParams(q?: string) {
  const term = q?.trim() ?? "";
  return {
    q: term,
    pattern: term ? `*${term}*` : "",
  };
}

export async function getPaginatedArticles(
  page: number,
  category?: string,
  q?: string,
): Promise<PaginatedArticles> {
  const empty: PaginatedArticles = {
    articles: [],
    total: 0,
    page: 1,
    totalPages: 0,
    category,
    q: q?.trim() || undefined,
  };

  if (!isSanityConfigured() || !client) {
    return empty;
  }

  const start = (page - 1) * ARTICLES_PER_PAGE;
  const end = start + ARTICLES_PER_PAGE;
  const search = searchQueryParams(q);

  const [articles, total] = await Promise.all([
    client.fetch<ArticleCardData[]>(
      category ? ARTICLES_PAGINATED_BY_CATEGORY_QUERY : ARTICLES_PAGINATED_QUERY,
      category
        ? { start, end, category, ...search }
        : { start, end, ...search },
      fetchOptions,
    ),
    client.fetch<number>(
      category ? ARTICLES_COUNT_BY_CATEGORY_QUERY : ARTICLES_COUNT_QUERY,
      category ? { category, ...search } : search,
      fetchOptions,
    ),
  ]);

  const totalPages = total === 0 ? 0 : Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE));

  return {
    articles,
    total,
    page,
    totalPages,
    category,
    q: search.q || undefined,
  };
}

export function articlesArchiveHref(page = 1, category?: string, q?: string) {
  const params = new URLSearchParams();
  const term = q?.trim();

  if (category) {
    params.set("category", category);
  }
  if (term) {
    params.set("q", term);
  }
  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/articles?${query}` : "/articles";
}
