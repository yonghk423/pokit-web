"use client";

import { SiteAppPromotions } from "./site-app-promotions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteName } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { CommonMessages } from "@/i18n/get-common-messages";
import { createTranslator } from "@/i18n/create-translator";
import { withLocale } from "@/lib/locale-path";

export function SiteFooter({ locale, messages }: { locale: Locale; messages: CommonMessages }) {
  const t = createTranslator(messages);
  const pathname = usePathname();
  const appHref = withLocale(locale, "/app");
  const isAppPage = pathname === appHref || pathname.startsWith(`${appHref}/`);
  return (
    <footer data-hide-in-pokit-app className="border-t border-neutral-200 bg-white text-neutral-800">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10">
        <SiteAppPromotions locale={locale} />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-200 pt-5 text-sm sm:border-0 sm:pt-0">
          {!isAppPage && <span>{siteName()}</span>}
          <nav aria-label="Information" className="flex flex-wrap gap-x-5 gap-y-2 text-neutral-600">
            <Link href={withLocale(locale, "/privacy")} className="hover:underline underline-offset-4">{t("개인정보 처리 안내")}</Link>
            <Link href={withLocale(locale, "/support")} className="hover:underline underline-offset-4">{t("앱 지원")}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
