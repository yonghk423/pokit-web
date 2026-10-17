import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/common.json";

export type CommonMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/common.json").then((module) => module.default),
  en: () => import("./messages/en/common.json").then((module) => module.default),
  ja: () => import("./messages/ja/common.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<CommonMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getCommonMessages(locale: Locale): Promise<CommonMessages> {
  return messages[locale]();
}
