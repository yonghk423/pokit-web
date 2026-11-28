import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { appName, siteName } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { breadcrumbJsonLd, libraryCollectionJsonLd } from "@/lib/json-ld";
import { getInitialLibraryChart, getInitialLibraryData } from "@/lib/library-shelves";
import { localeAlternates, localeOpenGraph } from "@/lib/locale-path";
import { LibraryExperience } from "./library-experience";

export const revalidate = 1800;

const LIBRARY_COPY = {
  ko: {
    title: "오늘의 책장",
    description:
      "산문, 소설, 산책과 휴식, 계절의 책을 골라 소개하는 POKIT 책장입니다. 한국어 도서는 YES24 정보를 바탕으로 살펴보고, 사진과 글로 하루를 기록하는 Daylight 앱도 만나보세요.",
    breadcrumb: "책장",
  },
  en: {
    title: "Your book shelf",
    description:
      "Explore a thoughtful shelf of essays, fiction, walking, rest, and seasonal reads, with English-language book details from Apple Books. Discover POKIT and Daylight, the app for keeping a photo diary of everyday life.",
    breadcrumb: "Book shelf",
  },
  ja: {
    title: "今日の本棚",
    description:
      "エッセイ、小説、散歩、休息、季節の本を集めたPOKITの本棚です。日本語の書籍情報はApple Booksをもとに紹介します。写真と言葉で日々を記録するDaylightアプリもご覧ください。",
    breadcrumb: "本棚",
  },
  "zh-TW": {
    title: "今日書架",
    description:
      "POKIT 精選散文、小說、散步、休息與季節主題書籍，繁體中文書籍資訊來自 Apple Books。也歡迎認識 Daylight，以照片和文字記錄日常生活的應用程式。",
    breadcrumb: "書架",
  },
} as const;

const OG_IMAGE = {
  url: "/pokit-logo.png",
  alt: "POKIT",
  width: 512,
  height: 512,
} as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = LIBRARY_COPY[locale];
  const alternates = localeAlternates(locale, "/app/library");
  return {
    title: `${copy.title} | ${appName(locale)}`,
    description: copy.description,
    alternates,
    openGraph: {
      title: `${copy.title} | ${siteName()}`,
      description: copy.description,
      url: alternates.canonical,
      siteName: siteName(),
      locale: localeOpenGraph(locale),
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title: `${copy.title} | ${siteName()}`,
      description: copy.description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function LibraryPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [initialData, initialChart] = await Promise.all([getInitialLibraryData(locale), getInitialLibraryChart(locale)]);
  const copy = LIBRARY_COPY[locale];
  const books = initialData.shelves.flatMap((shelf) => shelf.books).filter(
    (book, index, all) =>
      all.findIndex((item) => item.itemId === book.itemId) === index,
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: siteName(), path: "/" },
            { name: copy.breadcrumb, path: "/app/library" },
          ],
          locale,
        )}
      />
      <JsonLd
        data={libraryCollectionJsonLd({
          locale,
          name: copy.title,
          description: copy.description,
          books,
        })}
      />
      <LibraryExperience initialChart={initialChart} locale={locale} initialData={initialData} />
    </>
  );
}
