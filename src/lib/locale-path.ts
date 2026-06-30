import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { localeToHtmlLang, localeToIntl, localeToOgLocale, locales } from "@/i18n/config";

export function withLocale(locale: Locale, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}

export function switchLocalePath(pathname: string, target: Locale) {
  const segments = pathname.split("/");
  if (segments[1] && locales.includes(segments[1] as Locale)) {
    segments[1] = target;
    const next = segments.join("/");
    return next === "" ? `/${target}` : next;
  }
  return withLocale(target, pathname);
}

export function localeAlternates(locale: Locale, path: string) {
  const localized = (value: Locale) => `${site.siteUrl}${withLocale(value, path)}`;

  return {
    canonical: localized(locale),
    languages: {
      ko: localized("ko"),
      en: localized("en"),
      "x-default": localized("en"),
    },
  };
}

export function localeOpenGraph(locale: Locale) {
  return localeToOgLocale(locale);
}

export { localeToHtmlLang, localeToIntl, localeToOgLocale };
