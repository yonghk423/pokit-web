import { cache } from "react";

import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import { ARTICLE_QUERY } from "@/sanity/lib/queries";
import type { ArticleDocument } from "@/sanity/types";

/** Request-scoped dedupe for page + generateMetadata on article routes. */
export const getArticleBySlug = cache(async (slug: string) => {
  if (!isSanityConfigured() || !client) {
    return null;
  }

  return client.fetch<ArticleDocument | null>(
    ARTICLE_QUERY,
    { slug },
    sanityFetchOptions,
  );
});
