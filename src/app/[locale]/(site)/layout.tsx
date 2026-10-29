import { SiteFooter } from "@/components/site-footer";
import { SiteAppPromotions } from "@/components/site-app-promotions";
import { getAppDownloadMessages } from "@/i18n/get-app-download-messages";
import { notFound } from "next/navigation";

import { GoogleAnalytics } from "@/components/google-analytics";
import { PokitAppDocumentFlag } from "@/components/pokit-app-chrome";
import { SiteHeader } from "@/components/site-header";
import { isLocale, type Locale } from "@/i18n/config";
import { getCommonMessages } from "@/i18n/get-common-messages";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SiteLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const [messages, promoMessages] = await Promise.all([getCommonMessages(locale), getAppDownloadMessages(locale)]);

  return (
    <>
      <PokitAppDocumentFlag />
      <GoogleAnalytics />
      <SiteHeader locale={locale} messages={messages} />
      <SiteAppPromotions locale={locale} messages={promoMessages} position="top" />
      {children}
      <SiteFooter locale={locale} messages={messages} />
      <SiteAppPromotions locale={locale} messages={promoMessages} position="bottom" />
    </>
  );
}
