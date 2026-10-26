/** 사이트 기본 설정 — 새 컨셉에 맞게 수정하세요 */
export const site = {
  name: "Your Day",
  tagline: "",
  siteUrl: "https://www.pokitstory.com",
  supportEmail: "pokit.app.help@gmail.com",
  appStoreId: "6762331629",
  appStoreUrls: {
    ko: "https://apps.apple.com/kr/app/id6762331629",
    /** Explicit US storefront — bare `/app/id…` geo-redirects to the scanner's country (often KR). */
    en: "https://apps.apple.com/us/app/id6762331629",
    ja: "https://apps.apple.com/jp/app/id6762331629",
  },
} as const;

export function appStoreUrl(locale: keyof typeof site.appStoreUrls) {
  return site.appStoreUrls[locale];
}

/** Official display name; identifiers and links keep their existing values. */
export function appName(locale: keyof typeof site.appStoreUrls) {
  return locale === "ko" ? "오늘의 주인공" : "Your Day";
}
