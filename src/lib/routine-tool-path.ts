import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidToolSlug(slug: string) {
  return SLUG_PATTERN.test(slug);
}

/** Home preview deep link (tool detail pages redirect here). */
export function routineToolPath(locale: Locale, slug: string) {
  return `${withLocale(locale, "/")}?tool=${encodeURIComponent(slug)}`;
}
