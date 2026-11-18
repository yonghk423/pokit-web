/** POKIT is the editorial website; Daylight is the photo diary app. */
export const site = {
  name: "POKIT",
  tagline: "",
  siteUrl: "https://www.pokitstory.com",
  supportEmail: "pokit.app.help@gmail.com",
  appStoreId: "6762331629",
  appStoreUrls: {
    ko: "https://apps.apple.com/kr/app/id6762331629",
    /** Explicit US storefront — bare `/app/id…` geo-redirects to the scanner's country (often KR). */
    en: "https://apps.apple.com/us/app/id6762331629",
    ja: "https://apps.apple.com/jp/app/id6762331629",
    "zh-TW": "https://apps.apple.com/tw/app/id6762331629",
  },
} as const;

export function appStoreUrl(locale: keyof typeof site.appStoreUrls) {
  return site.appStoreUrls[locale];
}

/** Official display name; identifiers and links keep their existing values. */
export function appName(_locale: keyof typeof site.appStoreUrls) {
  // Retain the locale argument for existing callers; the brand is the same in every language.
  void _locale;
  return "Daylight";
}

/** The editorial website keeps its own brand, separate from the app. */
export function siteName() {
  return "POKIT";
}
