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
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const slug = searchParams.get("tool");
    if (!slug || !isValidToolSlug(slug)) {
      openedSlugRef.current = null;
      return;
    }

    const current = activeRef.current;
    if (current?.kind === "tool" && current.tool.slug === slug) {
      openedSlugRef.current = slug;
      return;
    }

    if (openedSlugRef.current === slug) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    fetch(`/api/tools/${encodeURIComponent(slug)}?locale=${locale}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        return res.json() as Promise<PreviewPayload>;
      })
      .then((data) => {
        if (cancelled) return;
        openedSlugRef.current = slug;
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
      .catch((error: unknown) => {
        if (
          cancelled ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }
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
      controller.abort();
    };
  }, [searchParams, locale, openTool, router, pathname, kicker]);

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
