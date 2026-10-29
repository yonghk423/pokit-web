import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/home-section-content.json";

export type HomeSectionContentMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/home-section-content.json").then((module) => module.default),
  en: () => import("./messages/en/home-section-content.json").then((module) => module.default),
  ja: () => import("./messages/ja/home-section-content.json").then((module) => module.default),
  "zh-TW": () => import("./messages/zh-TW/home-section-content.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<HomeSectionContentMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getHomeSectionContentMessages(locale: Locale): Promise<HomeSectionContentMessages> {
  return messages[locale]();
}
