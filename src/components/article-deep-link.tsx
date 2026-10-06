"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useArticlePreview } from "@/components/article-preview-context";
import { articlePath, isValidArticleSlug } from "@/lib/article-path";

/**
 * Legacy `?article=` deep links redirect to the SEO article page.
 * Home card previews still open via `preview.open` without setting the query.
 */
export function ArticleDeepLink() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useArticlePreview();

  useEffect(() => {
    const slug = searchParams.get("article");
    if (!slug || !isValidArticleSlug(slug)) {
      return;
    }
    router.replace(articlePath(locale, slug));
  }, [searchParams, locale, router]);

  return null;
}
