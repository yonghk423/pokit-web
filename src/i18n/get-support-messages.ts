import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/support.json";

export type SupportMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/support.json").then((module) => module.default),
  en: () => import("./messages/en/support.json").then((module) => module.default),
  ja: () => import("./messages/ja/support.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<SupportMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getSupportMessages(locale: Locale): Promise<SupportMessages> {
  return messages[locale]();
}
