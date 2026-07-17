import type { Locale } from "@/i18n/config";

export type DisplayTitleParts = {
  /** Full CMS/SEO title (keep for meta, aria, JSON-LD). */
  full: string;
  /** Main headline without the SEO wrapper. */
  headline: string;
};

const KO_PREFIX = /^(일상 공간 루틴|일상 루틴):\s*(.+)$/;
const KO_EM_DASH_SUFFIX = /^(.+?)\s*[—–-]\s*(일상 웰니스 루틴)$/;
const KO_TRAILING_ROUTINE = /^(.+?)\s+(루틴)$/;
const EN_SUFFIX = /^(.+?):\s*(a daily(?: wellness| space)? routine)$/i;

/**
 * Split SEO-oriented title wrappers for calmer on-page typography.
 * Meta tags should still use `full`.
 */
export function splitDisplayTitle(title: string): DisplayTitleParts {
  const full = title.trim();
  if (!full) {
    return { full: "", headline: "" };
  }

  const koPrefix = full.match(KO_PREFIX);
  if (koPrefix) {
    return { full, headline: koPrefix[2].trim() };
  }

  const koSuffix = full.match(KO_EM_DASH_SUFFIX);
  if (koSuffix) {
    return { full, headline: koSuffix[1].trim() };
  }

  const enSuffix = full.match(EN_SUFFIX);
  if (enSuffix) {
    return { full, headline: enSuffix[1].trim() };
  }

  const koTrail = full.match(KO_TRAILING_ROUTINE);
  if (koTrail && !/^(일상|웰니스)/.test(koTrail[1])) {
    return { full, headline: koTrail[1].trim() };
  }

  return { full, headline: full };
}

function unique(tags: string[]) {
  return [...new Set(tags)].slice(0, 2);
}

/**
 * Pick 1–2 brand keywords that fit this story (category + copy signals).
 * Avoids stamping the same trio on every card.
 */
export function brandTagsForArticle(
  locale: Locale,
  category: string,
  title: string,
  description?: string,
): string[] {
  const { headline } = splitDisplayTitle(title);
  const text = `${headline} ${description ?? ""}`;

  if (locale === "en") {
    const tags: string[] = [];
    switch (category) {
      case "Wellness":
        tags.push("wellness");
        if (/\broutine\b|\bhabit\b|\bminutes?\b/i.test(text)) tags.push("routine");
        else tags.push("daily");
        break;
      case "Routine":
        tags.push("routine");
        if (/\bwellness\b|\bbody\b|\bsleep\b|\bstretch/i.test(text)) tags.push("wellness");
        else tags.push("daily");
        break;
      case "Space":
        tags.push("daily");
        if (/\broutine\b|\bhabit\b/i.test(text)) tags.push("routine");
        break;
      case "Commute":
        tags.push("daily");
        if (/\bwellness\b|\bbreath\b|\bwalk\b/i.test(text)) tags.push("wellness");
        else if (/\broutine\b/i.test(text)) tags.push("routine");
        break;
      case "Weekly":
        tags.push("daily");
        if (/\broutine\b|\bhabit\b|\breview\b/i.test(text)) tags.push("routine");
        break;
      default:
        tags.push("daily");
        break;
    }
    return unique(tags);
  }

  const tags: string[] = [];
  switch (category) {
    case "Wellness":
      tags.push("웰니스");
      if (/루틴|습관|분/.test(text)) tags.push("루틴");
      else tags.push("일상");
      break;
    case "Routine":
      tags.push("루틴");
      if (/웰니스|몸|수면|스트레칭|호흡/.test(text)) tags.push("웰니스");
      else tags.push("일상");
      break;
    case "Space":
      tags.push("일상");
      if (/루틴|정리|습관/.test(text)) tags.push("루틴");
      break;
    case "Commute":
      tags.push("일상");
      if (/웰니스|숨|걷기|스트레칭/.test(text)) tags.push("웰니스");
      else if (/루틴|습관/.test(text)) tags.push("루틴");
      break;
    case "Weekly":
      tags.push("일상");
      if (/루틴|습관|회고|계획/.test(text)) tags.push("루틴");
      break;
    default:
      tags.push("일상");
      break;
  }
  return unique(tags);
}
