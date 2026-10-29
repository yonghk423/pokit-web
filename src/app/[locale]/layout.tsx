import type { Metadata } from "next";
import { siteName } from "@/config/site";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { isLocale, locales } from "@/i18n/config";
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

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const name = siteName();
  return { title: { default: name, template: `%s | ${name}` } };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale) && rawLocale !== "zh-TW") {
    notFound();
  }

  const locale = rawLocale;
  const headerList = await headers();
  const pokitApp = headerList.get(POKIT_APP_HEADER) === "1";

  return (
    <html
      lang={locale === "zh-TW" ? "zh-Hant" : localeToHtmlLang(locale)}
      suppressHydrationWarning
      className={`${fontVariables} scrollbar-hide`}
      {...(pokitApp ? { "data-pokit-app": "1" } : {})}
    >
      <body>{children}</body>
    </html>
  );
}
