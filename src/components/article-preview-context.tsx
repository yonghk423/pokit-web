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
import type { ArticleCardData } from "@/sanity/types";

export type ArticlePreviewOrigin = {
  top: number;
  left: number;
  width: number;
  height: number;
  imageUrl: string | null;
};

type OpenArgs = {
  article: ArticleCardData;
  origin: ArticlePreviewOrigin;
};

type ArticlePreviewContextValue = {
  locale: Locale;
  open: (args: OpenArgs) => void;
  close: () => void;
  active: OpenArgs | null;
};

const ArticlePreviewContext = createContext<ArticlePreviewContextValue | null>(
  null,
);

type ProviderProps = {
  locale: Locale;
  children: ReactNode;
};

export function ArticlePreviewProvider({ locale, children }: ProviderProps) {
  const [active, setActive] = useState<OpenArgs | null>(null);

  const close = useCallback(() => {
    setActive(null);
  }, []);

  const open = useCallback(({ article, origin }: OpenArgs) => {
    setActive({ article, origin });
  }, []);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  const value = useMemo(
    () => ({ locale, open, close, active }),
    [locale, open, close, active],
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
