import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { articlePath } from "@/lib/article-path";
import { withLocale } from "@/lib/locale-path";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import { SITEMAP_ARTICLES_QUERY } from "@/sanity/lib/queries";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/articles", "/support"] as const;

  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${site.siteUrl}${withLocale(locale, path)}`,
      changeFrequency: path === "" || path === "/articles" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "/articles" ? 0.9 : 0.5,
    })),
  );

  if (!isSanityConfigured() || !client) {
    return staticPages;
  }

  const articles = await client.fetch<
    { slug: string; publishedAt?: string; hasEnglishTranslation?: boolean }[]
  >(SITEMAP_ARTICLES_QUERY, {}, sanityFetchOptions);

  const articlePages: MetadataRoute.Sitemap = articles
    .filter(({ slug }) => slug)
    .flatMap(({ slug, publishedAt, hasEnglishTranslation }) => {
      const localesForArticle = hasEnglishTranslation
        ? locales
        : (["ko"] as const);

      return localesForArticle.map((locale) => ({
        url: `${site.siteUrl}${articlePath(locale, slug)}`,
        lastModified: publishedAt ? new Date(publishedAt) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    });

  return [...staticPages, ...articlePages];
}
