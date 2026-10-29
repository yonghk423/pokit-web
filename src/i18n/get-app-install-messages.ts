import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/app-install.json";

export type AppInstallMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/app-install.json").then((module) => module.default),
  en: () => import("./messages/en/app-install.json").then((module) => module.default),
  ja: () => import("./messages/ja/app-install.json").then((module) => module.default),
  "zh-TW": () => import("./messages/zh-TW/app-install.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<AppInstallMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getAppInstallMessages(locale: Locale): Promise<AppInstallMessages> {
  return messages[locale]();
}
