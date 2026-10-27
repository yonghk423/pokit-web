import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/privacy.json";

export type PrivacyMessages = Record<keyof typeof sourceMessages, string>;
const messages = {
  ko: () => import("./messages/ko/privacy.json").then(module => module.default),
  en: () => import("./messages/en/privacy.json").then(module => module.default),
  ja: () => import("./messages/ja/privacy.json").then(module => module.default),
} satisfies Record<Locale, () => Promise<PrivacyMessages>>;

export function getPrivacyMessages(locale: Locale): Promise<PrivacyMessages> {
  return messages[locale]();
}
