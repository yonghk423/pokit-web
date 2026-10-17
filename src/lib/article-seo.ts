import type { Locale } from "@/i18n/config";
import type { ArticleCardData } from "@/sanity/types";

/** Korean is the source; advertise only translations with a title and body. */
export function articleAvailableLocales(article: Pick<ArticleCardData,
  "hasEnglishTranslation" | "hasJapaneseTranslation">): Locale[] {
  const available: Locale[] = ["ko"];
  if (article.hasEnglishTranslation === true) available.push("en");
  if (article.hasJapaneseTranslation === true) available.push("ja");
  return available;
}

export function articleSeo(article: ArticleCardData, locale: Locale) {
  const availableLocales = articleAvailableLocales(article);
  const translated = availableLocales.includes(locale);
  return {
    availableLocales,
    contentLocale: translated ? locale : "ko" as const,
    indexable: translated,
    title: article.seoTitle?.trim() || article.title,
    description: article.seoDescription?.trim() || article.description?.trim() || article.title,
  };
}
