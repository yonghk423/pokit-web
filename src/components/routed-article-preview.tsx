"use client";

import type { AppInstallMessages } from "@/i18n/get-app-install-messages";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { articlePath } from "@/lib/article-path";
import { ArticlePreviewModal } from "@/components/article-preview-modal";
import { useArticlePreview, type PreviewActive } from "@/components/article-preview-context";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { ArticleCardData } from "@/sanity/types";

export function RoutedArticlePreview({ article, locale, imageUrl, categoryLabels, closeLabel, installMessages, seo }: {
  seo: { title: string; description: string; canonical: string; languages: Record<string, string>; robots: string };
  article: ArticleCardData;
  locale: Locale;
  imageUrl: string | null;
  categoryLabels: Dictionary["categories"];
  closeLabel: string;
  installMessages: AppInstallMessages;
}) {
  const router = useRouter();
  const { active: pending } = useArticlePreview();
  const isHomePreview = pending?.kind === "article" && pending.article.slug === article.slug;
  const close = useCallback(() => router.back(), [router]);
  const active = useMemo<PreviewActive>(() => ({
    kind: "article",
    article,
    origin: pending?.kind === "article" && pending.article.slug === article.slug
      ? pending.origin
      : { top: 80, left: 24, width: 240, height: 300, imageUrl },
  }), [article, pending, imageUrl]);

  // Only home cards provide an animation origin. Other entry points keep the
  // standalone detail page instead of being intercepted into the home modal.
  useEffect(() => {
    if (!isHomePreview) window.location.replace(articlePath(locale, article.slug));
  }, [isHomePreview, locale, article.slug]);

  // The preserved home route keeps its head during intercepted navigation.
  // Reflect the article while the modal is mounted, then restore on history navigation.
  useEffect(() => {
    if (!isHomePreview) return;
    const previousTitle = document.title;
    document.title = seo.title;
    const restore: Array<() => void> = [];
    function update(selector: string, attribute: string, value: string) {
      const element = document.head.querySelector(selector);
      if (!element) {
        const created = document.createElement("meta");
        const name = selector.match(/meta\[name="([^"]+)"\]/)?.[1];
        if (!name) return;
        created.name = name;
        created.setAttribute(attribute, value);
        document.head.appendChild(created);
        restore.push(() => created.remove());
        return;
      }
      const previous = element.getAttribute(attribute);
      element.setAttribute(attribute, value);
      restore.push(() => {
        if (element.getAttribute(attribute) !== value) return;
        if (previous === null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, previous);
      });
    }
    update('link[rel="canonical"]', "href", seo.canonical);
    const previousAlternates = Array.from(document.head.querySelectorAll('link[rel="alternate"][hreflang]'));
    previousAlternates.forEach(link => link.remove());
    const alternates = Object.entries(seo.languages).map(([lang, href]) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.href = href;
      document.head.appendChild(link);
      return link;
    });
    restore.push(() => {
      alternates.forEach(link => link.remove());
      previousAlternates.forEach(link => document.head.appendChild(link));
    });
    update('meta[name="robots"]', "content", seo.robots);
    update('meta[name="description"]', "content", seo.description);
    update('meta[property="og:title"]', "content", seo.title);
    update('meta[property="og:description"]', "content", seo.description);
    update('meta[property="og:url"]', "content", seo.canonical);
    update('meta[name="twitter:title"]', "content", seo.title);
    update('meta[name="twitter:description"]', "content", seo.description);
    return () => {
      if (document.title === seo.title) document.title = previousTitle;
      restore.forEach(reset => reset());
    };
  }, [seo, isHomePreview]);

  useEffect(() => {
    if (!isHomePreview) return;
    const focused = document.activeElement;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); close(); }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (focused instanceof HTMLElement && focused.isConnected) focused.focus({ preventScroll: true });
    };
  }, [close, isHomePreview]);

  if (!isHomePreview) return null;

  return <ArticlePreviewModal categoryLabels={categoryLabels} closeLabel={closeLabel}
    installMessages={installMessages} preview={{ locale, active, close }} />;
}
