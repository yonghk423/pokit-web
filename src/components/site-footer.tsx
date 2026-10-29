"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appName, siteName } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { CommonMessages } from "@/i18n/get-common-messages";
import { createTranslator } from "@/i18n/create-translator";
import { withLocale } from "@/lib/locale-path";

export function SiteFooter({ locale, messages }: { locale: Locale; messages: CommonMessages }) {
  const t = createTranslator(messages);
  const pathname = usePathname();
  const yourdayStoryHref = withLocale(locale, "/app/yourday-story");
  const isYourdayStory = pathname === yourdayStoryHref || pathname.startsWith(`${yourdayStoryHref}/`);
  return <footer data-hide-in-pokit-app className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 border-t border-black/10 px-6 py-7 text-xs text-black/60">
    <span>{isYourdayStory ? appName(locale) : siteName()}</span>
    <nav aria-label="Information" className="flex gap-5">
      <Link href={withLocale(locale, "/privacy")} className="underline underline-offset-4">{t("개인정보 처리 안내")}</Link>
      <Link href={withLocale(locale, "/support")} className="underline underline-offset-4">{t("앱 지원")}</Link>
    </nav>
  </footer>;
}
