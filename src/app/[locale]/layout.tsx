import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { isLocale, locales, type Locale } from "@/i18n/config";
import { fontVariables } from "@/lib/fonts";
import { POKIT_APP_HEADER } from "@/lib/pokit-app-header";
import { localeToHtmlLang } from "@/lib/locale-path";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const headerList = await headers();
  const pokitApp = headerList.get(POKIT_APP_HEADER) === "1";

  return (
    <html
      lang={localeToHtmlLang(locale)}
      suppressHydrationWarning
      className={fontVariables}
      {...(pokitApp ? { "data-pokit-app": "1" } : {})}
    >
      <body>{children}</body>
    </html>
  );
}
