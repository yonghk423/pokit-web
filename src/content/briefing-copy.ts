import type { createTranslator } from "@/i18n/create-translator";
import type { BriefingMessages } from "@/i18n/get-briefing-messages";

/** Preserve the first-three-headlines summary and the empty-digest fallback. */
export function createBriefingDescription(
  t: ReturnType<typeof createTranslator<BriefingMessages>>,
  headlines: readonly string[],
): string {
  const joined = headlines.slice(0, 3).join(" · ");
  return joined
    ? t("{{headlines}} — POKIT 주간 웰니스 브리핑", { headlines: joined })
    : t("공공·국제 웰니스 소식을 일상 루틴으로 연결하는 POKIT 주간 브리핑");
}
