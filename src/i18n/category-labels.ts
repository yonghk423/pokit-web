import type { CommonMessages } from "./get-common-messages";
import type { ArticleCategoryId } from "@/content/categories";

export type CategoryLabels = Record<ArticleCategoryId | "design", string>;

/** Shared CMS category IDs mapped to the selected locale's display strings. */
export function createCategoryLabels(t: (key: keyof CommonMessages) => string): CategoryLabels {
  return {
    Weekly: t("이번 주"),
    Routine: t("루틴"),
    Commute: t("이동·휴식"),
    Space: t("공간"),
    Sleep: t("하루 마무리"),
    Wellness: t("웰니스"),
    design: t("공간"),
  };
}
