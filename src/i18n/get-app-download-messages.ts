import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/app-download.json";

export type AppDownloadMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/app-download.json").then((module) => module.default),
  en: () => import("./messages/en/app-download.json").then((module) => module.default),
  ja: () => import("./messages/ja/app-download.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<AppDownloadMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getAppDownloadMessages(locale: Locale): Promise<AppDownloadMessages> {
  return messages[locale]();
}
