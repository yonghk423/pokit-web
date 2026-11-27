import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { appName } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { getInitialLibraryData } from "@/lib/library-shelves";
import { localeAlternates } from "@/lib/locale-path";
import { LibraryExperience } from "./library-experience";

export const revalidate = 1800;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = {
    ko: ["오늘의 책장", "YES24 도서 정보를 살펴보고 마음에 드는 책을 발견해 보세요."],
    en: ["Your book shelf", "Explore book recommendations and discover your next read on Apple Books."],
    ja: ["今日の本棚", "Apple Books の書籍情報から、次に読みたい一冊を見つけましょう。"],
    "zh-TW": ["今日書架", "瀏覽 Apple Books 繁體中文書籍，尋找下一本想讀的書。"],
  }[locale];
  return {
    title: `${copy[0]} | ${appName(locale)}`,
    description: copy[1],
    alternates: localeAlternates(locale, "/app/library"),
  };
}

export default async function LibraryPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const initialData = await getInitialLibraryData(locale);
  return <LibraryExperience locale={locale} initialData={initialData} />;
}
