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

const DEFAULT_RADIO_LATEST_SECTION: SectionHeading = {
  kicker: homeSections.radio.kicker,
  title: homeSections.radio.title,
};

const DEFAULT_SPOTLIGHT_ROW_SECTION: SectionHeading = {
  kicker: homeSections.spotlight.kicker,
  title: homeSections.spotlight.title,
};

const DEFAULT_DESIGN_AWARDS_SECTION: SectionHeading = {
  kicker: homeSections.design.kicker,
  title: homeSections.design.title,
};

const DEFAULT_CITY_GUIDES_SECTION: SectionHeading = {
  kicker: homeSections.wellness.kicker,
  title: homeSections.wellness.title,
};

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

export async function getHomePageContent(): Promise<HomePageContent> {
  if (!isSanityConfigured() || !client) {
    console.warn(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local.",
    );
    return emptyHomeContent();
  }

  try {
    const content = await client.fetch<HomePageContent | null>(
      HOME_PAGE_QUERY,
      {},
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
        DEFAULT_SPOTLIGHT_ROW_SECTION,
      ),
      radioLatestSection: withSectionDefaults(
        content.radioLatestSection,
        DEFAULT_RADIO_LATEST_SECTION,
      ),
      radioArticles: content.radioArticles?.filter(Boolean) ?? [],
      designAwardsSection: withSectionDefaults(
        content.designAwardsSection,
        DEFAULT_DESIGN_AWARDS_SECTION,
      ),
      designAwards: content.designAwards?.filter(Boolean) ?? [],
      cityGuidesSection: withSectionDefaults(
        content.cityGuidesSection,
        DEFAULT_CITY_GUIDES_SECTION,
      ),
      cityGuides: content.cityGuides?.filter(Boolean) ?? [],
    };
  } catch (error) {
    console.warn("Failed to fetch home page from Sanity:", error);
    return emptyHomeContent();
  }
}

export type HomePageCarousels = {
  affairsHero: ArticleCardData[];
  affairsRail: ArticleCardData[];
  spotlightCarousel: ArticleCardData[];
  radioCarousel: ArticleCardData[];
  designCarousel: ArticleCardData[];
  cityCarousel: ArticleCardData[];
};

export type HomePageWithCarousels = HomePageContent & HomePageCarousels;

const AFFAIRS_POOL_LIMIT = 24;
const CAROUSEL_POOL_LIMIT = 12;
const DESIGN_POOL_LIMIT = 24;

async function fetchHomeCarouselPools() {
  if (!client) {
    return null;
  }

  const routineSlugs = [...(homeSections.design.spaceRoutineSlugs ?? [])];

  const [affairsPool, routinePool, radioPool, wellnessPool, designPool] =
    await Promise.all([
      client.fetch<ArticleCardData[]>(
        ARTICLES_RECENT_BY_CATEGORY_QUERY,
        {
          category: homeSections.affairs.archiveCategory!,
          limit: AFFAIRS_POOL_LIMIT,
        },
        sanityFetchOptions,
      ),
      client.fetch<ArticleCardData[]>(
        ARTICLES_RECENT_BY_CATEGORY_QUERY,
        {
          category: homeSections.spotlight.archiveCategory!,
          limit: CAROUSEL_POOL_LIMIT,
        },
        sanityFetchOptions,
      ),
      client.fetch<ArticleCardData[]>(
        ARTICLES_RECENT_BY_CATEGORY_QUERY,
        {
          category: homeSections.radio.archiveCategory!,
          limit: CAROUSEL_POOL_LIMIT,
        },
        sanityFetchOptions,
      ),
      client.fetch<ArticleCardData[]>(
        ARTICLES_RECENT_BY_CATEGORY_QUERY,
        {
          category: homeSections.wellness.archiveCategory!,
          limit: CAROUSEL_POOL_LIMIT,
        },
        sanityFetchOptions,
      ),
      client.fetch<ArticleCardData[]>(
        ARTICLES_DESIGN_SPACE_POOL_QUERY,
        { routineSlugs, limit: DESIGN_POOL_LIMIT },
        sanityFetchOptions,
      ),
    ]);

  return { affairsPool, routinePool, radioPool, wellnessPool, designPool };
}

export async function getHomePageWithCarousels(): Promise<HomePageWithCarousels> {
  const home = await getHomePageContent();

  if (!isSanityConfigured() || !client) {
    return {
      ...home,
      affairsHero: home.featuredArticle ? [home.featuredArticle] : [],
      affairsRail: home.leadStories,
      spotlightCarousel: home.spotlightRow,
      radioCarousel: home.radioArticles,
      designCarousel: home.designAwards,
      cityCarousel: home.cityGuides,
    };
  }

  try {
    const pools = await fetchHomeCarouselPools();
    if (!pools) {
      throw new Error("Sanity client unavailable");
    }

    const { affairsPool, routinePool, radioPool, wellnessPool, designPool } =
      pools;

    return {
      ...home,
      affairsHero: mergeArticlesForCategory(
        home.featuredArticle ? [home.featuredArticle] : [],
        affairsPool,
        homeSections.affairs.archiveCategory!,
        8,
      ),
      affairsRail: mergeArticlesForCategory(
        home.leadStories,
        affairsPool,
        homeSections.affairs.archiveCategory!,
        12,
      ),
      spotlightCarousel: mergeArticlesForCategory(
        home.spotlightRow,
        routinePool,
        homeSections.spotlight.archiveCategory!,
        12,
      ),
      radioCarousel: mergeArticlesForCategory(
        home.radioArticles,
        radioPool,
        homeSections.radio.archiveCategory!,
        12,
      ),
      designCarousel: mergeArticlesForSpacePool(
        home.designAwards,
        designPool,
        homeSections.design.spaceRoutineSlugs ?? [],
        12,
      ),
      cityCarousel: mergeArticlesForCategory(
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
      affairsHero: home.featuredArticle ? [home.featuredArticle] : [],
      affairsRail: home.leadStories,
      spotlightCarousel: home.spotlightRow,
      radioCarousel: home.radioArticles,
      designCarousel: home.designAwards,
      cityCarousel: home.cityGuides,
    };
  }
}
