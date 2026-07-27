/** 사이트 기본 설정 — 새 컨셉에 맞게 수정하세요 */
export const site = {
  name: "POKIT",
  tagline: "",
  siteUrl: "https://www.pokitstory.com",
  supportEmail: "pokit.app.help@gmail.com",
  appStoreId: "6762331629",
  appStoreUrls: {
    ko: "https://apps.apple.com/kr/app/id6762331629",
    en: "https://apps.apple.com/app/id6762331629",
  },
} as const;

export function appStoreUrl(locale: "ko" | "en") {
  return site.appStoreUrls[locale];
}
