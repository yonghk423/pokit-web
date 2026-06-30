import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ko: () => import("@/i18n/dictionaries/ko").then((module) => module.default),
  en: () => import("@/i18n/dictionaries/en").then((module) => module.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
