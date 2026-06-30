import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidArticleSlug(slug: string) {
  return SLUG_PATTERN.test(slug);
}

/** Article 상세 페이지 경로 (slug URL 인코딩) */
export function articlePath(locale: Locale, slug: string) {
  return withLocale(locale, `/articles/${encodeURIComponent(slug)}`);
}
