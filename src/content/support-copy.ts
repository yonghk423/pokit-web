import { supportEn } from "@/content/support-en";
import { supportJa } from "@/content/support-ja";
import { supportKo } from "@/content/support-ko";
import type { SupportCopy } from "@/content/support-types";
import type { Locale } from "@/i18n/config";

export function getSupportCopy(locale: Locale): SupportCopy {
  if (locale === "ja") return supportJa;
  if (locale === "en") return supportEn;
  return supportKo;
}
