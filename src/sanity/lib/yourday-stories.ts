import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import type { Locale } from "@/i18n/config";
import type { PortableTextBlock } from "next-sanity";

export const YOURDAY_STORY_SLUGS = [
  "diary-one-scene-is-enough",
  "memo-with-a-place-in-mind",
  "notes-your-future-self-can-read",
] as const;

export type YourdayStoryArticle = {
  slug: (typeof YOURDAY_STORY_SLUGS)[number];
  title: string;
  description: string;
  kicker?: string;
  body: PortableTextBlock[];
  publishedAt?: string;
};

const localized = (field: string) => `select(
  $locale == "en" => coalesce(${field}En, ${field}),
  $locale == "ja" => coalesce(${field}Ja, ${field}),
  ${field}
)`;

const YOURDAY_STORIES_QUERY = `*[_type == "article" && appStory == true && slug.current in $slugs && defined(publishedAt)]{
  "slug": slug.current,
  "title": ${localized("title")},
  "description": ${localized("description")},
  "kicker": ${localized("kicker")},
  "body": ${localized("body")},
  publishedAt
}`;

export const YOURDAY_STORY_SITEMAP_QUERY = `*[_type == "article" && appStory == true && slug.current in $slugs && defined(publishedAt)]{
  "slug": slug.current,
  publishedAt,
  _updatedAt,
  "hasEnglishTranslation": defined(titleEn) && length(titleEn) > 0 && coalesce(length(pt::text(bodyEn)), 0) > 0,
  "hasJapaneseTranslation": defined(titleJa) && length(titleJa) > 0 && coalesce(length(pt::text(bodyJa)), 0) > 0
}`;

export async function getYourdayStoryArticles(locale: Locale) {
  if (!isSanityConfigured() || !client) return [];

  const articles = await client.fetch<YourdayStoryArticle[]>(
    YOURDAY_STORIES_QUERY,
    { locale, slugs: [...YOURDAY_STORY_SLUGS] },
    sanityFetchOptions,
  );
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  return YOURDAY_STORY_SLUGS.flatMap((slug) => {
    const article = bySlug.get(slug);
    return article ? [article] : [];
  });
}
