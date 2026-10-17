import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/home-video.json";

export type HomeVideoMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/home-video.json").then((module) => module.default),
  en: () => import("./messages/en/home-video.json").then((module) => module.default),
  ja: () => import("./messages/ja/home-video.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<HomeVideoMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getHomeVideoMessages(locale: Locale): Promise<HomeVideoMessages> {
  return messages[locale]();
}
