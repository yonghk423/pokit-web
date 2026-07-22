import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";

/** Hub: /{locale}/new-arrivals */
export function newArrivalsPath(locale: Locale) {
  return withLocale(locale, "/new-arrivals");
}

/** Weekly: /{locale}/new-arrivals/YYYY-MM-DD */
export function newArrivalsWeekPath(locale: Locale, weekOf: string) {
  return withLocale(locale, `/new-arrivals/${encodeURIComponent(weekOf)}`);
}

const WEEK_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isNewArrivalsWeekParam(week: string) {
  return WEEK_RE.test(week);
}
