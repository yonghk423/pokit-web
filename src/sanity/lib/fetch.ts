import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { client } from "@/sanity/client";
import { homeSections } from "@/content/home";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import {
  ARTICLES_DESIGN_SPACE_POOL_QUERY,
  ARTICLES_RECENT_BY_CATEGORY_QUERY,
  HOME_PAGE_QUERY,
} from "@/sanity/lib/queries";
import {
  mergeArticlesForCategory,
  mergeArticlesForSpacePool,
} from "@/sanity/lib/merge-articles";
import type { ArticleCardData, HomePageContent, SectionHeading } from "@/sanity/types";

function sectionDefaults(dict: Dictionary) {
  return {
    routine: {
      kicker: dict.home.sections.routine.kicker,
      title: dict.home.sections.routine.title,
    },
    commute: {
      kicker: dict.home.sections.commute.kicker,
      title: dict.home.sections.commute.title,
    },
    space: {
      kicker: dict.home.sections.space.kicker,
      title: dict.home.sections.space.title,
    },
    wellness: {
      kicker: dict.home.sections.wellness.kicker,
      title: dict.home.sections.wellness.title,
    },
  };
}

function withSectionDefaults(
  section: SectionHeading | null,
  defaults: SectionHeading,
): SectionHeading {
  return {
    kicker: section?.kicker ?? defaults.kicker,
    title: section?.title ?? defaults.title,
  };
}

const emptyHomeContent = (): HomePageContent => ({
  featuredArticle: null,
  leadStories: [],
  spotlightRow: [],
  spotlightRowSection: null,
  radioLatestSection: null,
  radioArticles: [],
  designAwardsSection: null,
  designAwards: [],
  cityGuidesSection: null,
  cityGuides: [],
});

export async function getHomePageContent(
  locale: Locale,
  dict: Dictionary,
): Promise<HomePageContent> {
  const defaults = sectionDefaults(dict);

  if (!isSanityConfigured() || !client) {
    console.warn(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local.",
    );
    return emptyHomeContent();
  }

  try {
    const content = await client.fetch<HomePageContent | null>(
      HOME_PAGE_QUERY,
      { locale },
      sanityFetchOptions,
    );

    if (!content) {
      return emptyHomeContent();
    }

    return {
      featuredArticle: content.featuredArticle ?? null,
      leadStories: content.leadStories?.filter(Boolean) ?? [],
      spotlightRow: content.spotlightRow?.filter(Boolean) ?? [],
      spotlightRowSection: withSectionDefaults(
        content.spotlightRowSection,
        defaults.routine,
      ),
      radioLatestSection: withSectionDefaults(
        content.radioLatestSection,
        defaults.commute,
      ),
      radioArticles: content.radioArticles?.filter(Boolean) ?? [],
      designAwardsSection: withSectionDefaults(
        content.designAwardsSection,
        defaults.space,
      ),
      designAwards: content.designAwards?.filter(Boolean) ?? [],
      cityGuidesSection: withSectionDefaults(
        content.cityGuidesSection,
        defaults.wellness,
      ),
      cityGuides: content.cityGuides?.filter(Boolean) ?? [],
    };
  } catch (error) {
    console.warn("Failed to fetch home page from Sanity:", error);
    return emptyHomeContent();
  }
}

export type HomePageCarousels = {
  weeklyHero: ArticleCardData[];
  weeklyRail: ArticleCardData[];
  routineCarousel: ArticleCardData[];
  commuteCarousel: ArticleCardData[];
  spaceCarousel: ArticleCardData[];
  wellnessCarousel: ArticleCardData[];
};

export type HomePageWithCarousels = HomePageContent & HomePageCarousels;

const WEEKLY_POOL_LIMIT = 24;
const CAROUSEL_POOL_LIMIT = 12;
const SPACE_POOL_LIMIT = 24;

async function fetchHomeCarouselPools(locale: Locale) {
  if (!client) {
    return null;
  }

  const routineSlugs = [...(homeSections.space.spaceRoutineSlugs ?? [])];

  const [weeklyPool, routinePool, commutePool, wellnessPool, spacePool] =
    await Promise.all([
      client.fetch<ArticleCardData[]>(
        ARTICLES_RECENT_BY_CATEGORY_QUERY,
        {
          category: homeSections.weekly.archiveCategory!,
          limit: WEEKLY_POOL_LIMIT,
          locale,
        },
        sanityFetchOptions,
      ),
      client.fetch<ArticleCardData[]>(
        ARTICLES_RECENT_BY_CATEGORY_QUERY,
        {
          category: homeSections.routine.archiveCategory!,
          limit: CAROUSEL_POOL_LIMIT,
          locale,
        },
        sanityFetchOptions,
      ),
      client.fetch<ArticleCardData[]>(
        ARTICLES_RECENT_BY_CATEGORY_QUERY,
        {
          category: homeSections.commute.archiveCategory!,
          limit: CAROUSEL_POOL_LIMIT,
          locale,
        },
        sanityFetchOptions,
      ),
      client.fetch<ArticleCardData[]>(
        ARTICLES_RECENT_BY_CATEGORY_QUERY,
        {
          category: homeSections.wellness.archiveCategory!,
          limit: CAROUSEL_POOL_LIMIT,
          locale,
        },
        sanityFetchOptions,
      ),
      client.fetch<ArticleCardData[]>(
        ARTICLES_DESIGN_SPACE_POOL_QUERY,
        { routineSlugs, limit: SPACE_POOL_LIMIT, locale },
        sanityFetchOptions,
      ),
    ]);

  return { weeklyPool, routinePool, commutePool, wellnessPool, spacePool };
}

export async function getHomePageWithCarousels(
  locale: Locale,
  dict: Dictionary,
): Promise<HomePageWithCarousels> {
  const home = await getHomePageContent(locale, dict);

  if (!isSanityConfigured() || !client) {
    return {
      ...home,
      weeklyHero: home.featuredArticle ? [home.featuredArticle] : [],
      weeklyRail: home.leadStories,
      routineCarousel: home.spotlightRow,
      commuteCarousel: home.radioArticles,
      spaceCarousel: home.designAwards,
      wellnessCarousel: home.cityGuides,
    };
  }

  try {
    const pools = await fetchHomeCarouselPools(locale);
    if (!pools) {
      throw new Error("Sanity client unavailable");
    }

    const { weeklyPool, routinePool, commutePool, wellnessPool, spacePool } =
      pools;

    return {
      ...home,
      weeklyHero: mergeArticlesForCategory(
        home.featuredArticle ? [home.featuredArticle] : [],
        weeklyPool,
        homeSections.weekly.archiveCategory!,
        8,
      ),
      weeklyRail: mergeArticlesForCategory(
        home.leadStories,
        weeklyPool,
        homeSections.weekly.archiveCategory!,
        12,
      ),
      routineCarousel: mergeArticlesForCategory(
        home.spotlightRow,
        routinePool,
        homeSections.routine.archiveCategory!,
        12,
      ),
      commuteCarousel: mergeArticlesForCategory(
        home.radioArticles,
        commutePool,
        homeSections.commute.archiveCategory!,
        12,
      ),
      spaceCarousel: mergeArticlesForSpacePool(
        home.designAwards,
        spacePool,
        homeSections.space.spaceRoutineSlugs ?? [],
        12,
      ),
      wellnessCarousel: mergeArticlesForCategory(
        home.cityGuides,
        wellnessPool,
        homeSections.wellness.archiveCategory!,
        12,
      ),
    };
  } catch (error) {
    console.warn("Failed to fetch carousel articles from Sanity:", error);
    return {
      ...home,
      weeklyHero: home.featuredArticle ? [home.featuredArticle] : [],
      weeklyRail: home.leadStories,
      routineCarousel: home.spotlightRow,
      commuteCarousel: home.radioArticles,
      spaceCarousel: home.designAwards,
      wellnessCarousel: home.cityGuides,
    };
  }
}
