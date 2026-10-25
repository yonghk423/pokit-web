import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AppDownload } from "@/components/app-download";
import { AppStoreBadge } from "@/components/app-store-badge";
import { JsonLd } from "@/components/json-ld";
import { ScrollReveal } from "@/components/scroll-reveal";
import { appStoreUrl, site } from "@/config/site";
import { appBoardArt, appBoards } from "@/content/app-features";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getAppDownloadMessages } from "@/i18n/get-app-download-messages";
import { getAppPageMessages } from "@/i18n/get-app-page-messages";
import { getCommonMessages } from "@/i18n/get-common-messages";
import { cn, monoContainer } from "@/lib/cn";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";

type Props = {
  params: Promise<{ locale: string }>;
};

const OG_IMAGE = {
  url: "/pokit-logo.png",
  width: 512,
  height: 512,
} as const;

const paper = "bg-[#f4f3ef]";
const descriptionKey = "평범한 순간도 소중한 장면으로 남겨요.";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const t = createTranslator(await getAppPageMessages(rawLocale));
  const alternates = localeAlternates(rawLocale, "/app");
  const title = t("POKIT, 기록하고, 챙기고, 다정하게.");
  const description = t(descriptionKey);

  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function AppIntroPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const [commonMessages, pageMessages, downloadMessages] = await Promise.all([
    getCommonMessages(locale),
    getAppPageMessages(locale),
    getAppDownloadMessages(locale),
  ]);
  const commonT = createTranslator(commonMessages);
  const t = createTranslator(pageMessages);
  const downloadT = createTranslator(downloadMessages);
  const boards = appBoardArt(locale);
  const description = t(descriptionKey);

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS",
    description,
    url: `${site.siteUrl}/${locale}/app`,
    image: `${site.siteUrl}/pokit-logo.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    downloadUrl: appStoreUrl(locale),
  };

  return (
    <main className={paper}>
      <JsonLd data={softwareJsonLd} />

      <section className={cn(monoContainer, "w-full pb-8 pt-14 nav:pb-12 nav:pt-20")}>
        <h1 className="m-0 max-w-4xl text-left font-serif text-[clamp(1.85rem,3.2vw,2.85rem)] font-normal italic leading-[1.25] tracking-[-0.03em] text-ink">
          {t("기록하고, 챙기고, 다정하게.")}
        </h1>
        <div className="mt-8 flex w-full flex-col items-start gap-5 nav:flex-row nav:items-center nav:gap-8">
          <AppStoreBadge locale={locale} label={downloadT("App Store에서 받기")} className="shrink-0" />
          <p className="m-0 max-w-3xl text-left font-sans text-[clamp(1.05rem,1.6vw,1.35rem)] leading-[1.5] tracking-[-0.02em] text-ink/70">
            {t(descriptionKey)}
          </p>
        </div>
        <nav
          aria-label={t(descriptionKey)}
          className="mt-10 grid w-full grid-cols-2 gap-3 nav:grid-cols-4"
        >
          {appBoards.map((board) => (
            <a
              key={board.id}
              href={`#${board.id}`}
                className="flex w-full items-center justify-center rounded-full border border-ink/15 px-4 py-3 font-sans text-[0.95rem] tracking-[-0.01em] text-ink/80 transition-colors hover:bg-ink hover:text-[#f4f3ef]"
            >
              {board.index} {t(board.label)}
            </a>
          ))}
        </nav>
      </section>

      <div className="mx-auto flex w-full max-w-[24rem] flex-col">
        {appBoards.map((board, index) => (
          <ScrollReveal key={board.id} threshold={0.12}>
            <figure id={board.id} className="m-0 scroll-mt-24">
              <Image
                src={boards[index]}
                alt={t(board.alt)}
                priority={index === 0}
                sizes="(min-width: 900px) 384px, 100vw"
                className="h-auto w-full"
              />
            </figure>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <AppDownload
          locale={locale}
          size="large"
          variant="editorial"
          resourceLinks={[
            { href: withLocale(locale, "/support"), label: commonT("앱 지원") },
          ]}
          messages={{
            ...downloadMessages,
            "POKIT 깔고, 오늘부터 천천히 채워 보세요.": t("기록하고, 챙기고, 다정하게."),
            "오늘 필요한 것들을, POKIT에 담아보세요. 루틴도, 메모도, 해야 할 일도. 하루에 필요한 작은 것부터 하나씩. POKIT과 함께 오늘을 가볍게 시작해보세요.":
              t(descriptionKey),
          }}
        />
      </ScrollReveal>
    </main>
  );
}
