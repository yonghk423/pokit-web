import prompts from "@/content/article-recording-prompts.ko.json";
import type { Locale } from "@/i18n/config";
import type { RecordingPrompt } from "@/components/article-recording-prompt";
import type { ArticleDocument } from "@/sanity/types";

const copy = {
  ko: { heading: "Daylight에 남겨볼 이야기", text: (topic: string) => `‘${topic}’에서 오늘 해보고 싶은 일을 하나 골라보세요. 해본 뒤 기억하고 싶은 장면을 사진으로 남기고, 다음번에도 이어가고 싶은 점을 한 줄 적어보세요.`, fallback: "이 글에서 오늘 해보고 싶은 일을 하나 골라보세요. 해본 뒤 기억하고 싶은 장면을 사진으로 남기고, 다음번에도 이어가고 싶은 점을 한 줄 적어보세요." },
  en: { heading: "A moment to save in Daylight", text: (topic: string) => `What would you like to try from “${topic}”? After trying it, save a photo of one detail you want to remember and add a line about what you would do again.`, fallback: "Choose one small idea from this article to try today. Save a photo of one detail you want to remember, then add a line about what you would do again." },
  ja: { heading: "Daylightに残したいひとコマ", text: (topic: string) => `「${topic}」から、今日試したいことを一つ選んでみましょう。試したあとで覚えておきたい場面を写真に残し、次も続けたいことを一行添えてみてください。`, fallback: "この記事から、今日試したいことを一つ選びましょう。覚えておきたい場面を写真に残し、次も続けたいことを一行添えてください。" },
  "zh-TW": { heading: "在 Daylight 留下這一刻", text: (topic: string) => `讀完〈${topic}〉，挑一件今天想試的事。試過之後，拍下想記住的細節，再寫一句下次想繼續做的事。`, fallback: "從這篇文章挑一件今天想試的事。試過之後，拍下想記住的細節，再寫一句下次想繼續做的事。" },
};

export function getArticleRecordingPrompt(article: ArticleDocument, locale: Locale): RecordingPrompt {
  const language = copy[locale];
  if (locale === "ko" && Object.prototype.hasOwnProperty.call(prompts, article.slug)) {
    return { heading: language.heading, text: prompts[article.slug as keyof typeof prompts].text };
  }
  const isTranslated = {
    ko: true,
    en: article.hasEnglishTranslation === true,
    ja: article.hasJapaneseTranslation === true,
    "zh-TW": article.hasTraditionalChineseTranslation === true,
  }[locale];
  if (!isTranslated) return { heading: language.heading, text: language.fallback };
  const section = article.body?.find(
    block => block._type === "block" && ["h2", "h3"].includes(String(block.style)),
  );
  const topic = section?.children
    ?.map(child => ("text" in child ? child.text : ""))
    .join("")
    .trim() || article.title;
  return { heading: language.heading, text: language.text(topic) };
}
