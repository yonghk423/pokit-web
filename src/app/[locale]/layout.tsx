import { notFound } from "next/navigation";

import { SetHtmlLang } from "@/components/set-html-lang";
import { isLocale, locales, type Locale } from "@/i18n/config";

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
    <>
      <SetHtmlLang locale={locale} />
      {children}
    </>
  );
}
