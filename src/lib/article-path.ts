import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidArticleSlug(slug: string) {
  return SLUG_PATTERN.test(slug);
}

/** Home preview deep link (article detail pages redirect here). */
export function articlePath(locale: Locale, slug: string) {
  return `${withLocale(locale, "/")}?article=${encodeURIComponent(slug)}`;
}
