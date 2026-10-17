import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/app-page.json";

export type AppPageMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/app-page.json").then((module) => module.default),
  en: () => import("./messages/en/app-page.json").then((module) => module.default),
  ja: () => import("./messages/ja/app-page.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<AppPageMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getAppPageMessages(locale: Locale): Promise<AppPageMessages> {
  return messages[locale]();
}
