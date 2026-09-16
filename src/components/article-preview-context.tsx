"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Locale } from "@/i18n/config";
import type { ArticleCardData, NewArrivalsItem } from "@/sanity/types";

export type ArticlePreviewOrigin = {
  top: number;
  left: number;
  width: number;
  height: number;
  imageUrl: string | null;
  blurDataURL?: string | null;
};

type ArticleOpenArgs = {
  kind: "article";
  article: ArticleCardData;
  origin: ArticlePreviewOrigin;
};

type ToolOpenArgs = {
  kind: "tool";
  tool: Pick<NewArrivalsItem, "slug" | "name" | "summary" | "imageAlt">;
  origin: ArticlePreviewOrigin;
  kicker: string;
};

export type PreviewActive = ArticleOpenArgs | ToolOpenArgs;

type ArticlePreviewContextValue = {
  locale: Locale;
  open: (args: {
    article: ArticleCardData;
    origin: ArticlePreviewOrigin;
  }) => void;
  openTool: (args: {
    tool: Pick<NewArrivalsItem, "slug" | "name" | "summary" | "imageAlt">;
    origin: ArticlePreviewOrigin;
    kicker: string;
  }) => void;
  close: () => void;
  active: PreviewActive | null;
};

const ArticlePreviewContext = createContext<ArticlePreviewContextValue | null>(
  null,
);

type ProviderProps = {
  locale: Locale;
  children: ReactNode;
};

export function ArticlePreviewProvider({ locale, children }: ProviderProps) {
  const [active, setActive] = useState<PreviewActive | null>(null);

  const close = useCallback(() => {
    setActive(null);
  }, []);

  const open = useCallback(
    ({
      article,
      origin,
    }: {
      article: ArticleCardData;
      origin: ArticlePreviewOrigin;
    }) => {
      setActive({ kind: "article", article, origin });
    },
    [],
  );

  const openTool = useCallback(
    ({
      tool,
      origin,
      kicker,
    }: {
      tool: Pick<NewArrivalsItem, "slug" | "name" | "summary" | "imageAlt">;
      origin: ArticlePreviewOrigin;
      kicker: string;
    }) => {
      setActive({ kind: "tool", tool, origin, kicker });
    },
    [],
  );

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  const value = useMemo(
    () => ({ locale, open, openTool, close, active }),
    [locale, open, openTool, close, active],
  );

  return (
    <ArticlePreviewContext.Provider value={value}>
      {children}
    </ArticlePreviewContext.Provider>
  );
}

export function useArticlePreview() {
  const ctx = useContext(ArticlePreviewContext);
  if (!ctx) {
    throw new Error("useArticlePreview must be used within ArticlePreviewProvider");
  }
  return ctx;
}

export function useOptionalArticlePreview() {
  return useContext(ArticlePreviewContext);
}
