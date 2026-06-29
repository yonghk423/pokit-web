import { articlePath } from "@/lib/article-path";
import { resolveCategoryKey } from "@/lib/category-key";
import { site } from "@/config/site";
import type { ArticleDocument, PokitRoutineArticle } from "@/sanity/types";

export const POKIT_ADD_ROUTINE_TYPE = "pokit_add_routine" as const;
export const POKIT_BRIDGE_VERSION = 1 as const;

export type PokitAddRoutineTarget = "today" | "fixed_routine";

export type PokitAddRoutinePayload = {
  type: typeof POKIT_ADD_ROUTINE_TYPE;
  version: typeof POKIT_BRIDGE_VERSION;
  source: "pokitstory";
  article: {
    id: string;
    slug: string;
    url: string;
    title: string;
    summary?: string;
    category?: string;
    categoryKey?: string;
    durationMinutes: number;
    publishedAt?: string;
  };
  suggestedTargets: PokitAddRoutineTarget[];
  defaultTarget: PokitAddRoutineTarget;
};

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export function isPokitAppWebView() {
  return typeof window !== "undefined" && window.ReactNativeWebView !== undefined;
}

export function formatPublishedDate(publishedAt?: string) {
  if (!publishedAt) return undefined;
  const date = publishedAt.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
}

export function buildAddRoutinePayload(article: PokitRoutineArticle): PokitAddRoutinePayload {
  const categoryKey = resolveCategoryKey(article.category, article.categoryKey);

  return {
    type: POKIT_ADD_ROUTINE_TYPE,
    version: POKIT_BRIDGE_VERSION,
    source: "pokitstory",
    article: {
      id: article.slug,
      slug: article.slug,
      url: `${site.siteUrl}${articlePath(article.slug)}`,
      title: article.title,
      ...(article.description ? { summary: article.description } : {}),
      category: article.category,
      categoryKey,
      durationMinutes: article.durationMinutes,
      publishedAt: formatPublishedDate(article.publishedAt),
    },
    suggestedTargets: ["today", "fixed_routine"],
    defaultTarget: "today",
  };
}

export function sendToPokitApp(payload: PokitAddRoutinePayload) {
  if (!isPokitAppWebView()) {
    return false;
  }

  window.ReactNativeWebView!.postMessage(JSON.stringify(payload));
  return true;
}

/** 보조: 앱이 onShouldStartLoadWithRequest로 가로챌 수 있는 커스텀 스킴 */
export function buildPokitDeepLink(article: PokitRoutineArticle) {
  const params = new URLSearchParams({
    slug: article.slug,
    minutes: String(article.durationMinutes),
    title: article.title,
  });
  return `pokit://add-routine?${params.toString()}`;
}

export const DEFAULT_DURATION_MINUTES = 10;

export function shouldShowPokitCta(_article: ArticleDocument) {
  return true;
}

export function toPokitRoutineArticle(article: ArticleDocument): PokitRoutineArticle {
  const durationMinutes =
    typeof article.durationMinutes === "number" && article.durationMinutes > 0
      ? article.durationMinutes
      : DEFAULT_DURATION_MINUTES;

  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    categoryKey: article.categoryKey,
    durationMinutes,
    publishedAt: article.publishedAt,
  };
}
