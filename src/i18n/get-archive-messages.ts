import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/archive.json";

export type ArchiveMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/archive.json").then((module) => module.default),
  en: () => import("./messages/en/archive.json").then((module) => module.default),
  ja: () => import("./messages/ja/archive.json").then((module) => module.default),
  "zh-TW": () => import("./messages/zh-TW/archive.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<ArchiveMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getArchiveMessages(locale: Locale): Promise<ArchiveMessages> {
  return messages[locale]();
}
