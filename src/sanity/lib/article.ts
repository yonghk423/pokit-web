import { cache } from "react";

import type { Locale } from "@/i18n/config";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import { ARTICLE_QUERY } from "@/sanity/lib/queries";
import type { ArticleDocument } from "@/sanity/types";

/** Request-scoped dedupe for page + generateMetadata on article routes. */
export const getArticleBySlug = cache(async (slug: string, locale: Locale) => {
  if (!isSanityConfigured() || !client) {
    return null;
  }

  return client.fetch<ArticleDocument | null>(
    ARTICLE_QUERY,
    { slug, locale },
    sanityFetchOptions,
  );
});
