import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import {
  defaultLocale,
  localeToHtmlLang,
  localeToIntl,
  localeToOgLocale,
  locales,
} from "@/i18n/config";

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

type LocaleAlternatesOptions = {
  /** Locales that have a real equivalent page. Defaults to all site locales. */
  availableLocales?: readonly Locale[];
};

export function localeAlternates(
  locale: Locale,
  path: string,
  options?: LocaleAlternatesOptions,
) {
  const available =
    options?.availableLocales && options.availableLocales.length > 0
      ? options.availableLocales
      : locales;
  const localized = (value: Locale) => `${site.siteUrl}${withLocale(value, path)}`;
  const canonicalLocale = available.includes(locale) ? locale : available[0];

  const languages: Record<string, string> = {};
  for (const value of available) {
    languages[value] = localized(value);
  }
  languages["x-default"] = available.includes(defaultLocale)
    ? localized(defaultLocale)
    : localized(available[0]);

  return {
    canonical: localized(canonicalLocale),
    languages,
  };
}

export function localeOpenGraph(locale: Locale) {
  return localeToOgLocale(locale);
}

export { localeToHtmlLang, localeToIntl, localeToOgLocale };
