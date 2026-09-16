import { notFound } from "next/navigation";
import Script from "next/script";

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

const POKIT_APP_BOOT = `(function(){try{var q=new URLSearchParams(location.search);if(q.get("pokit_app")==="1"||/POKIT/i.test(navigator.userAgent)||window.ReactNativeWebView||window.POKIT_APP===true){document.documentElement.dataset.pokitApp="1";}}catch(e){}})();`;

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
      <body>
        <Script id="pokit-app-boot" strategy="beforeInteractive">
          {POKIT_APP_BOOT}
        </Script>
        {children}
      </body>
    </html>
  );
}
