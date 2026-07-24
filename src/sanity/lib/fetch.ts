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
  LATEST_NEW_ARRIVALS_QUERY,
  LATEST_WELLNESS_DIGEST_QUERY,
  NEW_ARRIVALS_BY_WEEK_QUERY,
  NEW_ARRIVALS_LIST_QUERY,
  ROUTINE_TOOL_BY_SLUG_QUERY,
  ROUTINE_TOOL_SLUGS_QUERY,
  SITEMAP_DIGESTS_QUERY,
  SITEMAP_NEW_ARRIVALS_QUERY,
  SITEMAP_ROUTINE_TOOLS_QUERY,
  WELLNESS_DIGEST_BY_WEEK_QUERY,
  WELLNESS_DIGEST_LIST_QUERY,
} from "@/sanity/lib/queries";
import {
  mergeArticlesForCategory,
  mergeArticlesForSpacePool,
} from "@/sanity/lib/merge-articles";
import type {
  ArticleCardData,
  HomePageContent,
  NewArrivalsData,
  NewArrivalsListItem,
  RoutineToolDetail,
  SectionHeading,
  WellnessDigestData,
  WellnessDigestListItem,
} from "@/sanity/types";

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
    sleep: {
      kicker: dict.home.sections.sleep.kicker,
      title: dict.home.sections.sleep.title,
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
  sleepStoriesSection: null,
  sleepStories: [],
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
      sleepStoriesSection: withSectionDefaults(
        content.sleepStoriesSection,
        defaults.sleep,
      ),
      sleepStories: content.sleepStories?.filter(Boolean) ?? [],
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
  sleepCarousel: ArticleCardData[];
  wellnessCarousel: ArticleCardData[];
  newArrivals: NewArrivalsData | null;
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

  const [weeklyPool, routinePool, commutePool, sleepPool, wellnessPool, spacePool] =
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
          category: homeSections.sleep.archiveCategory!,
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

  return {
    weeklyPool,
    routinePool,
    commutePool,
    sleepPool,
    wellnessPool,
    spacePool,
  };
}

function normalizeWellnessDigest(
  digest: WellnessDigestData | null,
): WellnessDigestData | null {
  if (!digest?.title || !Array.isArray(digest.items) || digest.items.length === 0) {
    return null;
  }

  const items = digest.items.filter(
    (item) =>
      item?.headline && item?.summary && item?.sourceName && item?.sourceUrl,
  );

  if (items.length === 0) {
    return null;
  }

  return {
    weekOf: digest.weekOf,
    title: digest.title,
    intro: digest.intro || undefined,
    editorNote: digest.editorNote || undefined,
    items,
    relatedArticles: digest.relatedArticles?.filter(Boolean) ?? [],
  };
}

export async function getLatestWellnessDigest(
  locale: Locale,
): Promise<WellnessDigestData | null> {
  if (!isSanityConfigured() || !client) {
    return null;
  }

  try {
    const digest = await client.fetch<WellnessDigestData | null>(
      LATEST_WELLNESS_DIGEST_QUERY,
      { locale },
      sanityFetchOptions,
    );
    return normalizeWellnessDigest(digest);
  } catch (error) {
    console.warn("Failed to fetch wellness digest from Sanity:", error);
    return null;
  }
}

export async function getWellnessDigestByWeek(
  locale: Locale,
  weekOf: string,
): Promise<WellnessDigestData | null> {
  if (!isSanityConfigured() || !client) {
    return null;
  }

  try {
    const digest = await client.fetch<WellnessDigestData | null>(
      WELLNESS_DIGEST_BY_WEEK_QUERY,
      { locale, weekOf },
      sanityFetchOptions,
    );
    return normalizeWellnessDigest(digest);
  } catch (error) {
    console.warn("Failed to fetch wellness digest by week from Sanity:", error);
    return null;
  }
}

export async function listWellnessDigests(
  locale: Locale,
): Promise<WellnessDigestListItem[]> {
  if (!isSanityConfigured() || !client) {
    return [];
  }

  try {
    const digests = await client.fetch<WellnessDigestListItem[]>(
      WELLNESS_DIGEST_LIST_QUERY,
      { locale },
      sanityFetchOptions,
    );
    return (digests ?? []).filter((d) => d?.weekOf && d?.title);
  } catch (error) {
    console.warn("Failed to list wellness digests from Sanity:", error);
    return [];
  }
}

export async function listWellnessDigestWeeksForSitemap(): Promise<
  { weekOf: string; _updatedAt?: string }[]
> {
  if (!isSanityConfigured() || !client) {
    return [];
  }

  try {
    return await client.fetch(
      SITEMAP_DIGESTS_QUERY,
      {},
      sanityFetchOptions,
    );
  } catch (error) {
    console.warn("Failed to fetch digest weeks for sitemap:", error);
    return [];
  }
}

function normalizeNewArrivals(
  roundup: NewArrivalsData | null,
): NewArrivalsData | null {
  if (!roundup?.title || !Array.isArray(roundup.items) || roundup.items.length === 0) {
    return null;
  }

  const items = roundup.items.filter(
    (item) => item?.name && item?.summary && item?.slug,
  );

  if (items.length === 0) {
    return null;
  }

  return {
    weekOf: roundup.weekOf,
    title: roundup.title,
    intro: roundup.intro || undefined,
    items,
  };
}

const newArrivalsFetchOptions = {
  ...sanityFetchOptions,
  useCdn: false as const,
};

export async function getLatestNewArrivals(
  locale: Locale,
): Promise<NewArrivalsData | null> {
  if (!isSanityConfigured() || !client) {
    return null;
  }

  try {
    const roundup = await client.fetch<NewArrivalsData | null>(
      LATEST_NEW_ARRIVALS_QUERY,
      { locale },
      newArrivalsFetchOptions,
    );
    return normalizeNewArrivals(roundup);
  } catch (error) {
    console.warn("Failed to fetch new arrivals from Sanity:", error);
    return null;
  }
}

export async function getNewArrivalsByWeek(
  locale: Locale,
  weekOf: string,
): Promise<NewArrivalsData | null> {
  if (!isSanityConfigured() || !client) {
    return null;
  }

  try {
    const roundup = await client.fetch<NewArrivalsData | null>(
      NEW_ARRIVALS_BY_WEEK_QUERY,
      { locale, weekOf },
      newArrivalsFetchOptions,
    );
    return normalizeNewArrivals(roundup);
  } catch (error) {
    console.warn("Failed to fetch new arrivals by week from Sanity:", error);
    return null;
  }
}

export async function listNewArrivals(
  locale: Locale,
): Promise<NewArrivalsListItem[]> {
  if (!isSanityConfigured() || !client) {
    return [];
  }

  try {
    const items = await client.fetch<NewArrivalsListItem[]>(
      NEW_ARRIVALS_LIST_QUERY,
      { locale },
      newArrivalsFetchOptions,
    );
    return (items ?? []).filter((d) => d?.weekOf && d?.title);
  } catch (error) {
    console.warn("Failed to list new arrivals from Sanity:", error);
    return [];
  }
}

export async function listNewArrivalsWeeksForSitemap(): Promise<
  { weekOf: string; _updatedAt?: string }[]
> {
  if (!isSanityConfigured() || !client) {
    return [];
  }

  try {
    return await client.fetch(
      SITEMAP_NEW_ARRIVALS_QUERY,
      {},
      newArrivalsFetchOptions,
    );
  } catch (error) {
    console.warn("Failed to fetch new arrivals weeks for sitemap:", error);
    return [];
  }
}

export async function getRoutineToolBySlug(
  locale: Locale,
  slug: string,
): Promise<RoutineToolDetail | null> {
  if (!isSanityConfigured() || !client) {
    return null;
  }

  try {
    const result = await client.fetch<{
      weekOf?: string;
      item: RoutineToolDetail | null;
    } | null>(
      ROUTINE_TOOL_BY_SLUG_QUERY,
      { locale, slug },
      newArrivalsFetchOptions,
    );
    if (!result?.item?.name || !result.item.slug || !result.item.body?.length) {
      return null;
    }
    return {
      ...result.item,
      weekOf: result.weekOf,
    };
  } catch (error) {
    console.warn("Failed to fetch routine tool by slug:", error);
    return null;
  }
}

export async function listRoutineToolSlugs(): Promise<string[]> {
  if (!isSanityConfigured() || !client) {
    return [];
  }

  try {
    const slugs = await client.fetch<string[]>(
      ROUTINE_TOOL_SLUGS_QUERY,
      {},
      newArrivalsFetchOptions,
    );
    return (slugs ?? []).filter(Boolean);
  } catch (error) {
    console.warn("Failed to list routine tool slugs:", error);
    return [];
  }
}

export async function listRoutineToolsForSitemap(): Promise<
  { slug: string; _updatedAt?: string }[]
> {
  if (!isSanityConfigured() || !client) {
    return [];
  }

  try {
    const docs = await client.fetch<
      { _updatedAt?: string; slugs?: string[] }[]
    >(SITEMAP_ROUTINE_TOOLS_QUERY, {}, newArrivalsFetchOptions);
    const out: { slug: string; _updatedAt?: string }[] = [];
    for (const doc of docs ?? []) {
      for (const slug of doc.slugs ?? []) {
        if (slug) out.push({ slug, _updatedAt: doc._updatedAt });
      }
    }
    return out;
  } catch (error) {
    console.warn("Failed to list routine tools for sitemap:", error);
    return [];
  }
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
      sleepCarousel: home.sleepStories,
      wellnessCarousel: home.cityGuides,
      newArrivals: null,
    };
  }

  try {
    const [pools, newArrivals] = await Promise.all([
      fetchHomeCarouselPools(locale),
      getLatestNewArrivals(locale),
    ]);
    if (!pools) {
      throw new Error("Sanity client unavailable");
    }

    const {
      weeklyPool,
      routinePool,
      commutePool,
      sleepPool,
      wellnessPool,
      spacePool,
    } = pools;

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
      sleepCarousel: mergeArticlesForCategory(
        home.sleepStories,
        sleepPool,
        homeSections.sleep.archiveCategory!,
        12,
      ),
      wellnessCarousel: mergeArticlesForCategory(
        home.cityGuides,
        wellnessPool,
        homeSections.wellness.archiveCategory!,
        12,
      ),
      newArrivals,
    };
  } catch (error) {
    console.warn("Failed to fetch carousel articles from Sanity:", error);
    const newArrivals = await getLatestNewArrivals(locale);
    return {
      ...home,
      weeklyHero: home.featuredArticle ? [home.featuredArticle] : [],
      weeklyRail: home.leadStories,
      routineCarousel: home.spotlightRow,
      commuteCarousel: home.radioArticles,
      spaceCarousel: home.designAwards,
      sleepCarousel: home.sleepStories,
      wellnessCarousel: home.cityGuides,
      newArrivals,
    };
  }
}
