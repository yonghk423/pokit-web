import type { createTranslator } from "@/i18n/create-translator";
import type { NewArrivalsMessages } from "@/i18n/get-new-arrivals-messages";

/** Keep the first three tool names, or use the existing empty-summary copy. */
export function createNewArrivalsDescription(
  t: ReturnType<typeof createTranslator<NewArrivalsMessages>>,
  names: readonly string[],
): string {
  const joined = names.slice(0, 3).join(" · ");
  return joined
    ? t("{{names}} — POKIT 루틴 도구 추천", { names: joined })
    : t("생산성·웰니스를 돕는 도구를 추천하는 POKIT 루틴 도구");
}
