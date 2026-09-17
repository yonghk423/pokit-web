"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useArticlePreview } from "@/components/article-preview-context";
import { isValidToolSlug } from "@/lib/routine-tool-path";

type PreviewPayload = {
  slug: string;
  name: string;
  summary: string | null;
  imageAlt: string;
  coverUrl: string | null;
  imageLqip: string | null;
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

/** Opens the home tool modal when `?tool=` is present. */
export function ToolDeepLink({ kicker }: { kicker: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { locale, openTool, active } = useArticlePreview();
  const openedSlugRef = useRef<string | null>(null);
  const pendingSlugRef = useRef<string | null>(null);

  useEffect(() => {
    const slug = searchParams.get("tool");
    if (!slug || !isValidToolSlug(slug)) {
      openedSlugRef.current = null;
      return;
    }

    if (active?.kind === "tool" && active.tool.slug === slug) {
      openedSlugRef.current = slug;
      return;
    }

    if (pendingSlugRef.current === slug || openedSlugRef.current === slug) {
      return;
    }

    pendingSlugRef.current = slug;
    let cancelled = false;

    fetch(`/api/tools/${encodeURIComponent(slug)}?locale=${locale}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        return res.json() as Promise<PreviewPayload>;
      })
      .then((data) => {
        if (cancelled) return;
        openedSlugRef.current = slug;
        pendingSlugRef.current = null;
        openTool({
          tool: {
            slug: data.slug,
            name: data.name,
            summary: data.summary ?? "",
            imageAlt: data.imageAlt,
          },
          origin: syntheticOrigin(data.coverUrl, data.imageLqip),
          kicker,
        });
      })
      .catch(() => {
        pendingSlugRef.current = null;
        openedSlugRef.current = null;
        const next = new URLSearchParams(searchParams.toString());
        next.delete("tool");
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, locale, openTool, active, router, pathname, kicker]);

  useEffect(() => {
    if (active) return;
    if (!openedSlugRef.current) return;
    if (!searchParams.get("tool")) {
      openedSlugRef.current = null;
      return;
    }

    openedSlugRef.current = null;
    const next = new URLSearchParams(searchParams.toString());
    next.delete("tool");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [active, searchParams, router, pathname]);

  return null;
}
