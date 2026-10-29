import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/briefing.json";

export type BriefingMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/briefing.json").then((module) => module.default),
  en: () => import("./messages/en/briefing.json").then((module) => module.default),
  ja: () => import("./messages/ja/briefing.json").then((module) => module.default),
  "zh-TW": () => import("./messages/zh-TW/briefing.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<BriefingMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getBriefingMessages(locale: Locale): Promise<BriefingMessages> {
  return messages[locale]();
}
