import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { articlePath } from "@/lib/article-path";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import { SITEMAP_ARTICLES_QUERY } from "@/sanity/lib/queries";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: site.siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.siteUrl}/articles`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.siteUrl}/privacy`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${site.siteUrl}/support`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  if (!isSanityConfigured() || !client) {
    return staticPages;
  }

  const articles = await client.fetch<
    { slug: string; publishedAt?: string }[]
  >(SITEMAP_ARTICLES_QUERY, {}, sanityFetchOptions);

  const articlePages: MetadataRoute.Sitemap = articles
    .filter(({ slug }) => slug)
    .map(({ slug, publishedAt }) => ({
      url: `${site.siteUrl}${articlePath(slug)}`,
      lastModified: publishedAt ? new Date(publishedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticPages, ...articlePages];
}
