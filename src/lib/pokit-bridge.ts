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

export type PokitSendResult = "sent" | "deep_link" | "browser";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    POKIT_APP?: boolean;
    webkit?: {
      messageHandlers?: Record<string, { postMessage: (body: unknown) => void }>;
    };
  }
}

function isMobileDevice() {
  return typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/** POKIT 앱 WebView 안인지 (브릿지 유무와 별개) */
export function isPokitAppContext() {
  if (typeof window === "undefined") return false;

  if (window.ReactNativeWebView?.postMessage) return true;
  if (window.POKIT_APP === true) return true;
  if (window.webkit?.messageHandlers?.pokit?.postMessage) return true;

  if (/POKIT/i.test(navigator.userAgent)) return true;

  const params = new URLSearchParams(window.location.search);
  if (params.get("pokit_app") === "1") return true;

  return false;
}

export function isPokitAppWebView() {
  return isPokitAppContext();
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

function tryPostMessage(payload: PokitAddRoutinePayload) {
  const message = JSON.stringify(payload);

  if (window.ReactNativeWebView?.postMessage) {
    window.ReactNativeWebView.postMessage(message);
    return true;
  }

  const handler = window.webkit?.messageHandlers?.pokit;
  if (handler?.postMessage) {
    handler.postMessage(payload);
    return true;
  }

  return false;
}

/** 보조: 앱이 onShouldStartLoadWithRequest로 가로챌 수 있는 커스텀 스킴 */
export function buildPokitDeepLink(article: PokitRoutineArticle) {
  const params = new URLSearchParams({
    slug: article.slug,
    minutes: String(article.durationMinutes),
    title: article.title,
  });
  if (article.description) {
    params.set("summary", article.description);
  }
  return `pokit://add-routine?${params.toString()}`;
}

export function sendToPokitApp(
  payload: PokitAddRoutinePayload,
  article: PokitRoutineArticle,
): PokitSendResult {
  if (typeof window === "undefined") {
    return "browser";
  }

  if (tryPostMessage(payload)) {
    return "sent";
  }

  // 앱 WebView이거나 모바일: postMessage 없을 때 딥링크 시도 (앱이 URL 가로채기)
  if (isPokitAppContext() || isMobileDevice()) {
    window.location.href = buildPokitDeepLink(article);
    return "deep_link";
  }

  return "browser";
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
