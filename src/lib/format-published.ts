import type { Locale } from "@/i18n/config";
import { localeToIntl } from "@/i18n/config";

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale}:${JSON.stringify(options)}`;
  const existing = formatters.get(key);
  if (existing) {
    return existing;
  }
  const formatter = new Intl.DateTimeFormat(locale, options);
  formatters.set(key, formatter);
  return formatter;
}

function parsePublishedAt(iso?: string | null) {
  if (!iso) {
    return null;
  }

  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 예: 일요일 / Sunday */
export function formatPublishedWeekday(iso: string | null | undefined, locale: Locale) {
  const date = parsePublishedAt(iso);
  const intl = localeToIntl(locale);
  return date
    ? getFormatter(intl, { weekday: "long" }).format(date)
    : null;
}

/** 예: 일요일 · 2026년 6월 20일 / Sunday · June 29, 2026 */
export function formatPublishedLabel(iso: string | null | undefined, locale: Locale) {
  const date = parsePublishedAt(iso);
  if (!date) {
    return null;
  }

  const intl = localeToIntl(locale);
  const weekday = getFormatter(intl, { weekday: "long" }).format(date);
  const dateLabel = getFormatter(intl, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  return `${weekday} · ${dateLabel}`;
}
