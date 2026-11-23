import prompts from "@/content/article-recording-prompts.ko.json";
import type { Locale } from "@/i18n/config";
import type { RecordingPrompt } from "@/components/article-recording-prompt";

/** Editorial copy for the 191 Korean articles; no title/category interpolation. */
export function getArticleRecordingPrompt(slug: string, locale: Locale): RecordingPrompt | null {
  if (locale !== "ko" || !Object.prototype.hasOwnProperty.call(prompts, slug)) return null;
  const entry = prompts[slug as keyof typeof prompts];
  return { heading: "Daylight에 남겨볼 이야기", text: entry.text };
}
