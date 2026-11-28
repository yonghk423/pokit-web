import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import { hasArticleBody } from "@/sanity/lib/queries";
import type { ArticleBodyBlock } from "@/sanity/types";
import type { Locale } from "@/i18n/config";

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
  body: ArticleBodyBlock[];
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
  "hasEnglishTranslation": defined(titleEn) && length(titleEn) > 0 && ${hasArticleBody("bodyEn")},
  "hasJapaneseTranslation": defined(titleJa) && length(titleJa) > 0 && ${hasArticleBody("bodyJa")}
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
