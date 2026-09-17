"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useArticlePreview } from "@/components/article-preview-context";
import { isValidArticleSlug } from "@/lib/article-path";
import type { ArticleCardData } from "@/sanity/types";

type PreviewPayload = {
  slug: string;
  title: string;
  titleKo: string | null;
  description: string | null;
  kicker: string | null;
  category: string;
  imageAlt: string;
  publishedAt: string | null;
  coverUrl: string | null;
  coverImageLqip: string | null;
};

function syntheticOrigin(imageUrl: string | null, blurDataURL: string | null) {
  const width = Math.min(280, Math.round(window.innerWidth * 0.42));
  const height = Math.round(width * 1.25);
  return {
    top: Math.max(24, Math.round(window.innerHeight / 2 - height / 2)),
    left: Math.max(16, Math.round(window.innerWidth / 2 - width / 2)),
    width,
    height,
    imageUrl,
    blurDataURL,
  };
}

/** Opens the home article modal when `?article=` is present. */
export function ArticleDeepLink() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { locale, open, active } = useArticlePreview();
  const openedSlugRef = useRef<string | null>(null);
  const pendingSlugRef = useRef<string | null>(null);

  useEffect(() => {
    const slug = searchParams.get("article");
    if (!slug || !isValidArticleSlug(slug)) {
      openedSlugRef.current = null;
      return;
    }

    if (active?.kind === "article" && active.article.slug === slug) {
      openedSlugRef.current = slug;
      return;
    }

    if (pendingSlugRef.current === slug || openedSlugRef.current === slug) {
      return;
    }

    pendingSlugRef.current = slug;
    let cancelled = false;

    fetch(`/api/articles/${encodeURIComponent(slug)}?locale=${locale}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        return res.json() as Promise<PreviewPayload>;
      })
      .then((data) => {
        if (cancelled) return;
        const article: ArticleCardData = {
          slug: data.slug,
          title: data.title,
          titleKo: data.titleKo ?? undefined,
          description: data.description ?? undefined,
          kicker: data.kicker ?? undefined,
          category: data.category,
          imageAlt: data.imageAlt,
          publishedAt: data.publishedAt ?? undefined,
          coverImageLqip: data.coverImageLqip,
        };
        openedSlugRef.current = slug;
        pendingSlugRef.current = null;
        open({
          article,
          origin: syntheticOrigin(data.coverUrl, data.coverImageLqip),
        });
      })
      .catch(() => {
        pendingSlugRef.current = null;
        openedSlugRef.current = null;
        const next = new URLSearchParams(searchParams.toString());
        next.delete("article");
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, locale, open, active, router, pathname]);

  useEffect(() => {
    if (active) return;
    if (!openedSlugRef.current) return;
    if (!searchParams.get("article")) {
      openedSlugRef.current = null;
      return;
    }

    openedSlugRef.current = null;
    const next = new URLSearchParams(searchParams.toString());
    next.delete("article");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [active, searchParams, router, pathname]);

  return null;
}
