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
  const messages = await getCommonMessages(locale);

  return (
    <>
      <PokitAppDocumentFlag />
      <GoogleAnalytics />
      <div data-hide-in-pokit-app>
        <SiteHeader locale={locale} messages={messages} />
      </div>
      {children}
    </>
  );
}
