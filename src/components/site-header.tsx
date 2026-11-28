import { headers } from "next/headers";
import { POKIT_APP_HEADER } from "@/lib/pokit-app-header";
import { SiteHeaderNav } from "@/components/site-header-nav";
import type { Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import type { CommonMessages } from "@/i18n/get-common-messages";

type Props = {
  locale: Locale;
  messages: CommonMessages;
};

export async function SiteHeader({ locale, messages }: Props) {
  const t = createTranslator(messages);
  return (
    <SiteHeaderNav
      initialInApp={(await headers()).get(POKIT_APP_HEADER) === "1"}
      locale={locale}
      tagline={t("일상 루틴과 웰니스를 위한 포켓 가이드")}
      homeAria={t("POKIT 홈")}
      app={t("App")}
      library="Daylight Library"
      contact={t("Contact")}
      languageLabels={{
        label: t("Language"),
        ko: t("한국어"),
        en: t("English"),
        ja: t("日本語"),
        "zh-TW": t("繁體中文"),
      }}
    />
  );
}
