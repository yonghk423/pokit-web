import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/home.json";

export type HomeMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/home.json").then((module) => module.default),
  en: () => import("./messages/en/home.json").then((module) => module.default),
  ja: () => import("./messages/ja/home.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<HomeMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getHomeMessages(locale: Locale): Promise<HomeMessages> {
  return messages[locale]();
}
