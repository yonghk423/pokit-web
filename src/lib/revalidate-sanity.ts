import { revalidatePath, revalidateTag } from "next/cache";

import { locales } from "@/i18n/config";
import { SANITY_CACHE_TAG } from "@/sanity/lib/cache";

type SlugField = string | { current?: string };

function slugFromDocument(doc: unknown): string | undefined {
  if (!doc || typeof doc !== "object") {
    return undefined;
  }

  const slug = (doc as { slug?: SlugField }).slug;
  if (typeof slug === "string") {
    return slug;
  }
  if (slug && typeof slug === "object" && typeof slug.current === "string") {
    return slug.current;
  }

  return undefined;
}

function weekOfFromDocument(doc: unknown): string | undefined {
  if (!doc || typeof doc !== "object") {
    return undefined;
  }
  const weekOf = (doc as { weekOf?: unknown }).weekOf;
  return typeof weekOf === "string" && /^\d{4}-\d{2}-\d{2}$/.test(weekOf)
    ? weekOf
    : undefined;
}

export function slugsFromSanityWebhook(body: unknown): string[] {
  const docs = Array.isArray(body) ? body : [body];
  const values = new Set<string>();

  for (const doc of docs) {
    const slug = slugFromDocument(doc);
    if (slug) values.add(slug);
    const weekOf = weekOfFromDocument(doc);
    if (weekOf) values.add(weekOf);
  }

  return [...values];
}

/** Invalidate cached Sanity data and key routes after a publish. */
export function revalidateSanityContent(slugs: string[] = []) {
  revalidateTag(SANITY_CACHE_TAG, "max");

  const paths = new Set<string>(["/sitemap.xml"]);

  for (const locale of locales) {
    paths.add(`/${locale}`);
    paths.add(`/${locale}/articles`);
    paths.add(`/${locale}/briefing`);

    for (const slug of slugs) {
      paths.add(`/${locale}/articles/${encodeURIComponent(slug)}`);
      // weekOf dates (YYYY-MM-DD) also arrive as "slugs" from some webhooks
      if (/^\d{4}-\d{2}-\d{2}$/.test(slug)) {
        paths.add(`/${locale}/briefing/${slug}`);
      }
    }
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return {
    tag: SANITY_CACHE_TAG,
    paths: [...paths],
  };
}
