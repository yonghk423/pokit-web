import type { Locale } from "@/i18n/config";
import type sourceMessages from "@/i18n/messages/ko/article.json";

export type ArticleMessages = Record<keyof typeof sourceMessages, string>;

const messages = {
  ko: () => import("./messages/ko/article.json").then((module) => module.default),
  en: () => import("./messages/en/article.json").then((module) => module.default),
  ja: () => import("./messages/ja/article.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<ArticleMessages>>;

/** Load on the server and pass only this scope's strings to the client. */
export function getArticleMessages(locale: Locale): Promise<ArticleMessages> {
  return messages[locale]();
}
