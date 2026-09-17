import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { GoogleAnalytics } from "@/components/google-analytics";
import { PokitAppDocumentFlag } from "@/components/pokit-app-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

function isHomePath(pathname: string, locale: Locale) {
  return pathname === `/${locale}` || pathname === `/${locale}/`;
}

export default async function SiteLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const pathname = (await headers()).get("x-pathname") ?? "";
  const showFooter = !isHomePath(pathname, locale);

  return (
    <>
      <PokitAppDocumentFlag />
      <GoogleAnalytics />
      <div data-hide-in-pokit-app>
        <SiteHeader locale={locale} dict={dict} />
      </div>
      {children}
      {showFooter ? (
        <div data-hide-in-pokit-app>
          <SiteFooter locale={locale} dict={dict} />
        </div>
      ) : null}
    </>
  );
}
