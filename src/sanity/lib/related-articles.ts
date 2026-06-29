import { homeSections } from "@/content/home";
import { getArchiveSectionLabel, getCategoryLabel } from "@/lib/category-label";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import { articlesArchiveHref } from "@/sanity/lib/articles";
import {
  RELATED_BY_CATEGORY_QUERY,
  RELATED_DESIGN_SPACE_QUERY,
} from "@/sanity/lib/queries";
import type { ArticleCardData } from "@/sanity/types";

export const RELATED_ARTICLES_LIMIT = 4;

const designRoutineSlugSet = new Set<string>(homeSections.design.spaceRoutineSlugs ?? []);

export function isDesignSpaceArticle(slug: string, category: string) {
  return (
    category === "Design" ||
    (category === "Routine" && designRoutineSlugSet.has(slug))
  );
}

export type RelatedArticlesResult = {
  articles: ArticleCardData[];
  label: string;
  viewAllHref: string;
};

export async function getRelatedArticles(
  slug: string,
  category: string,
): Promise<RelatedArticlesResult | null> {
  if (!isSanityConfigured() || !client) {
    return null;
  }

  const inDesignSpace = isDesignSpaceArticle(slug, category);

  const articles = await client.fetch<ArticleCardData[]>(
    inDesignSpace ? RELATED_DESIGN_SPACE_QUERY : RELATED_BY_CATEGORY_QUERY,
    inDesignSpace
      ? {
          slug,
          limit: RELATED_ARTICLES_LIMIT,
          routineSlugs: [...designRoutineSlugSet],
        }
      : { slug, category, limit: RELATED_ARTICLES_LIMIT },
    sanityFetchOptions,
  );

  if (articles.length === 0) {
    return null;
  }

  return {
    articles,
    label: inDesignSpace
      ? getArchiveSectionLabel(homeSections.design.archiveSection!)
      : getCategoryLabel(category),
    viewAllHref: inDesignSpace
      ? articlesArchiveHref(1, undefined, undefined, homeSections.design.archiveSection)
      : articlesArchiveHref(1, category),
  };
}
