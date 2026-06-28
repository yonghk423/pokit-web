import { client } from "@/sanity/client";
import { homeSections } from "@/content/home";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import { ALL_ARTICLES_CARD_QUERY, HOME_PAGE_QUERY } from "@/sanity/lib/queries";
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
    const allArticles = await client.fetch<ArticleCardData[]>(
      ALL_ARTICLES_CARD_QUERY,
      {},
      sanityFetchOptions,
    );

    return {
      ...home,
      affairsHero: mergeArticlesForCategory(
        home.featuredArticle ? [home.featuredArticle] : [],
        allArticles,
        homeSections.affairs.archiveCategory!,
        8,
      ),
      affairsRail: mergeArticlesForCategory(
        home.leadStories,
        allArticles,
        homeSections.affairs.archiveCategory!,
        12,
      ),
      spotlightCarousel: mergeArticlesForCategory(
        home.spotlightRow,
        allArticles,
        homeSections.spotlight.archiveCategory!,
        12,
      ),
      radioCarousel: mergeArticlesForCategory(
        home.radioArticles,
        allArticles,
        homeSections.radio.archiveCategory!,
        12,
      ),
      designCarousel: mergeArticlesForSpacePool(
        home.designAwards,
        allArticles,
        homeSections.design.spaceRoutineSlugs ?? [],
        12,
      ),
      cityCarousel: mergeArticlesForCategory(
        home.cityGuides,
        allArticles,
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
