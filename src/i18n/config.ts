export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localeToOgLocale(locale: Locale) {
  return locale === "ko" ? "ko_KR" : "en_US";
}

export function localeToIntl(locale: Locale) {
  return locale === "ko" ? "ko-KR" : "en-US";
}

export function localeToHtmlLang(locale: Locale) {
  return locale === "ko" ? "ko" : "en";
}
