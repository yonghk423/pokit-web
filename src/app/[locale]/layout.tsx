import { notFound } from "next/navigation";

import { isLocale, locales, type Locale } from "@/i18n/config";
import { fontVariables } from "@/lib/fonts";
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

  return (
    <html
      lang={localeToHtmlLang(locale)}
      suppressHydrationWarning
      className={fontVariables}
    >
      <body>{children}</body>
    </html>
  );
}
