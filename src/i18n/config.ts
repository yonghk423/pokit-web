export const locales = ["ko", "en", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

const OG_LOCALES: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
};

const INTL_LOCALES: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localeToOgLocale(locale: Locale) {
  return OG_LOCALES[locale];
}

export function localeToIntl(locale: Locale) {
  return INTL_LOCALES[locale];
}

export function localeToHtmlLang(locale: Locale) {
  return locale;
}
