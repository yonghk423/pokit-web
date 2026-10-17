import type { Locale } from "@/i18n/config";
import { createCommonCopy } from "./create-common-copy";
import { createHomeCopy } from "./create-home-copy";
import { getCommonMessages } from "./get-common-messages";
import { getHomeMessages } from "./get-home-messages";
import { getHomeSectionNavMessages } from "./get-home-section-nav-messages";
import { getHomeSectionContentMessages } from "./get-home-section-content-messages";
import type { Dictionary, LegacyDictionary } from "@/i18n/types";

const dictionaries: Record<Locale, () => Promise<LegacyDictionary>> = {
  ko: () => import("@/i18n/dictionaries/ko").then((module) => module.default),
  en: () => import("@/i18n/dictionaries/en").then((module) => module.default),
  ja: () => import("@/i18n/dictionaries/ja").then((module) => module.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const [legacy, common, home, sectionNav, sectionContent] = await Promise.all([
    dictionaries[locale](),
    getCommonMessages(locale),
    getHomeMessages(locale),
    getHomeSectionNavMessages(locale),
    getHomeSectionContentMessages(locale),
  ]);
  return {
    ...legacy,
    ...createCommonCopy(common),
    home: createHomeCopy(home, sectionNav, sectionContent),
  };
}
