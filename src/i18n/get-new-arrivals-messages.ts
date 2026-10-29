import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/new-arrivals.json";

export type NewArrivalsMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/new-arrivals.json").then((module) => module.default),
  en: () => import("./messages/en/new-arrivals.json").then((module) => module.default),
  ja: () => import("./messages/ja/new-arrivals.json").then((module) => module.default),
  "zh-TW": () => import("./messages/zh-TW/new-arrivals.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<NewArrivalsMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getNewArrivalsMessages(locale: Locale): Promise<NewArrivalsMessages> {
  return messages[locale]();
}
