import { revalidatePath, revalidateTag } from "next/cache";

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

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/sitemap.xml");

  for (const slug of slugs) {
    revalidatePath(`/articles/${encodeURIComponent(slug)}`);
  }

  return {
    tag: SANITY_CACHE_TAG,
    paths: ["/", "/articles", "/sitemap.xml", ...slugs.map((s) => `/articles/${s}`)],
  };
}
