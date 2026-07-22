import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";

/** Detail: /{locale}/tools/{slug} */
export function routineToolPath(locale: Locale, slug: string) {
  return withLocale(locale, `/tools/${encodeURIComponent(slug)}`);
}
