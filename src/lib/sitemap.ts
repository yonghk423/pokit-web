import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { locales, type Locale } from "@/i18n/config";
import { articleAvailableLocales } from "@/lib/article-seo";
import { localeAlternates } from "@/lib/locale-path";
import { articlePath } from "@/lib/article-path";
import { briefingWeekPath } from "@/lib/briefing-path";
import { newArrivalsWeekPath } from "@/lib/new-arrivals-path";
import { withLocale } from "@/lib/locale-path";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import { YOURDAY_STORY_SLUGS, YOURDAY_STORY_SITEMAP_QUERY } from "@/sanity/lib/yourday-stories";
import {
  SITEMAP_ARTICLES_QUERY,
  SITEMAP_DIGESTS_QUERY,
  SITEMAP_NEW_ARRIVALS_QUERY,
} from "@/sanity/lib/queries";

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/articles",
    "/briefing",
    "/new-arrivals",
    "/app",
    "/app/yourday-story",
    "/support",
    "/privacy",
  ] as const;

  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${site.siteUrl}${withLocale(locale, path)}`,
      alternates: { languages: localeAlternates(locale, path).languages },
      changeFrequency:
        path === "" ||
        path === "/articles" ||
        path === "/briefing" ||
        path === "/new-arrivals" ||
        path === "/app" ||
        path === "/app/yourday-story"
          ? "weekly"
          : "monthly",
      priority:
        path === ""
          ? 1
          : path === "/articles" ||
              path === "/briefing" ||
              path === "/new-arrivals" ||
              path === "/app" ||
              path === "/app/yourday-story"
            ? 0.9
            : 0.5,
    })),
  );

  if (!isSanityConfigured() || !client) {
    return staticPages;
  }

  const [articles, digests, newArrivals, yourdayStories] = await Promise.all([
    client.fetch<
      { slug: string; publishedAt?: string; _updatedAt?: string; hasEnglishTranslation?: boolean; hasJapaneseTranslation?: boolean; hasTraditionalChineseTranslation?: boolean }[]
    >(SITEMAP_ARTICLES_QUERY, {}, sanityFetchOptions),
    client.fetch<{ weekOf: string; _updatedAt?: string }[]>(
      SITEMAP_DIGESTS_QUERY,
      {},
      sanityFetchOptions,
    ),
    client.fetch<{ weekOf: string; _updatedAt?: string }[]>(
      SITEMAP_NEW_ARRIVALS_QUERY,
      {},
      sanityFetchOptions,
    ),
    client.fetch<{
      slug: string;
      publishedAt?: string;
      _updatedAt?: string;
      hasEnglishTranslation?: boolean;
      hasJapaneseTranslation?: boolean;
      hasTraditionalChineseTranslation?: boolean;
    }[]>(YOURDAY_STORY_SITEMAP_QUERY, { slugs: [...YOURDAY_STORY_SLUGS] }, sanityFetchOptions),
  ]);

  const articlePages: MetadataRoute.Sitemap = (articles ?? [])
    .filter(({ slug }) => slug)
    .flatMap((article) => {
      const { slug, publishedAt, _updatedAt } = article;
      const availableLocales = articleAvailableLocales(article);
      return availableLocales.map((locale) => ({
        url: `${site.siteUrl}${articlePath(locale, slug)}`,
        alternates: { languages: localeAlternates(locale, `/articles/${slug}`, { availableLocales }).languages },
        lastModified: _updatedAt ?? publishedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    });

  const digestPages: MetadataRoute.Sitemap = (digests ?? [])
    .filter(({ weekOf }) => weekOf)
    .flatMap(({ weekOf, _updatedAt }) =>
      locales.map((locale) => ({
        url: `${site.siteUrl}${briefingWeekPath(locale, weekOf)}`,
        alternates: { languages: localeAlternates(locale, `/briefing/${weekOf}`).languages },
        lastModified: _updatedAt ? new Date(_updatedAt) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
    );

  const yourdayStoryPages: MetadataRoute.Sitemap = (yourdayStories ?? [])
    .filter(({ slug }) => slug)
    .flatMap((story) => {
      const availableLocales = articleAvailableLocales(story);
      return availableLocales.map((locale) => ({
        url: `${site.siteUrl}${withLocale(locale, `/app/yourday-story/${story.slug}`)}`,
        alternates: { languages: localeAlternates(locale, `/app/yourday-story/${story.slug}`, { availableLocales }).languages },
        lastModified: story._updatedAt ?? story.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      }));
    });

  const newArrivalsPages: MetadataRoute.Sitemap = (newArrivals ?? [])
    .filter(({ weekOf }) => weekOf)
    .flatMap(({ weekOf, _updatedAt }) =>
      locales.map((locale) => ({
        url: `${site.siteUrl}${newArrivalsWeekPath(locale, weekOf)}`,
        alternates: { languages: localeAlternates(locale, `/new-arrivals/${weekOf}`).languages },
        lastModified: _updatedAt ? new Date(_updatedAt) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
    );

  return [
    ...staticPages,
    ...articlePages,
    ...yourdayStoryPages,
    ...digestPages,
    ...newArrivalsPages,
  ];
}

/** Use the same canonical URL inventory for the full and language sitemaps. */
export async function getLocaleSitemapEntries(locale: Locale): Promise<MetadataRoute.Sitemap> {
  const prefix = `/${locale}`;
  return (await getSitemapEntries()).filter(({ url }) => {
    const pathname = new URL(url).pathname;
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}
