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

export function slugsFromSanityWebhook(body: unknown): string[] {
  if (Array.isArray(body)) {
    return [
      ...new Set(
        body.map(slugFromDocument).filter((slug): slug is string => Boolean(slug)),
      ),
    ];
  }

  const slug = slugFromDocument(body);
  return slug ? [slug] : [];
}

/** Invalidate cached Sanity data and key routes after a publish. */
export function revalidateSanityContent(slugs: string[] = []) {
  revalidateTag(SANITY_CACHE_TAG, "max");

  const paths = new Set<string>(["/sitemap.xml"]);

  for (const locale of locales) {
    paths.add(`/${locale}`);
    paths.add(`/${locale}/articles`);

    for (const slug of slugs) {
      paths.add(`/${locale}/articles/${encodeURIComponent(slug)}`);
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
