import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";

/** Hub: /{locale}/briefing */
export function briefingPath(locale: Locale) {
  return withLocale(locale, "/briefing");
}

/** Weekly: /{locale}/briefing/YYYY-MM-DD */
export function briefingWeekPath(locale: Locale, weekOf: string) {
  return withLocale(locale, `/briefing/${encodeURIComponent(weekOf)}`);
}

const WEEK_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isBriefingWeekParam(week: string) {
  return WEEK_RE.test(week);
}
