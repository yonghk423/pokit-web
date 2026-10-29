import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/home-section-nav.json";

export type HomeSectionNavMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/home-section-nav.json").then((module) => module.default),
  en: () => import("./messages/en/home-section-nav.json").then((module) => module.default),
  ja: () => import("./messages/ja/home-section-nav.json").then((module) => module.default),
  "zh-TW": () => import("./messages/zh-TW/home-section-nav.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<HomeSectionNavMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getHomeSectionNavMessages(locale: Locale): Promise<HomeSectionNavMessages> {
  return messages[locale]();
}
