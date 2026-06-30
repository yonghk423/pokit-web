"use client";

import { useEffect } from "react";

import type { Locale } from "@/i18n/config";
import { localeToHtmlLang } from "@/lib/locale-path";

type Props = {
  locale: Locale;
};

export function SetHtmlLang({ locale }: Props) {
  useEffect(() => {
    document.documentElement.lang = localeToHtmlLang(locale);
  }, [locale]);

  return null;
}
