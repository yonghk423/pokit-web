import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { NewArrivalsSection } from "@/components/new-arrivals-section";
import { site } from "@/config/site";
import { isLocale, locales, localeToIntl, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { cn, monoContainer } from "@/lib/cn";
import { briefingCollectionJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph } from "@/lib/locale-path";
import {
  isNewArrivalsWeekParam,
  newArrivalsPath,
} from "@/lib/new-arrivals-path";
import {
  getNewArrivalsByWeek,
  listNewArrivals,
} from "@/sanity/lib/fetch";

export const revalidate = false;

type Props = {
  params: Promise<{ locale: string; week: string }>;
};

const OG_IMAGE = {
  url: "/pokit5.png",
  width: 512,
  height: 512,
} as const;

function formatWeekLabel(weekOf: string, locale: Locale) {
  const date = new Date(`${weekOf}T12:00:00`);
  if (Number.isNaN(date.getTime())) return weekOf;
  return new Intl.DateTimeFormat(localeToIntl(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function generateStaticParams() {
  const roundups = await listNewArrivals("ko");
  return locales.flatMap((locale) =>
    roundups.map((item) => ({ locale, week: item.weekOf })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, week } = await params;
  if (!isLocale(rawLocale) || !isNewArrivalsWeekParam(week)) {
    return {};
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const roundup = await getNewArrivalsByWeek(locale, week);
  if (!roundup) {
    return {};
  }

  const weekLabel = formatWeekLabel(week, locale);
  const title = dict.newArrivals.weekTitle(weekLabel);
  const description = dict.newArrivals.metaDescriptionFromItems(
    roundup.items.map((item) => item.name),
  );
  const alternates = localeAlternates(locale, `/new-arrivals/${week}`);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(locale),
      type: "article",
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

export default async function NewArrivalsWeekPage({ params }: Props) {
  const { locale: rawLocale, week } = await params;
  if (!isLocale(rawLocale) || !isNewArrivalsWeekParam(week)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const roundup = await getNewArrivalsByWeek(locale, week);
  if (!roundup) {
    notFound();
  }

  const weekLabel = formatWeekLabel(week, locale);
  const pageTitle = dict.newArrivals.weekTitle(weekLabel);
  const description = dict.newArrivals.metaDescriptionFromItems(
    roundup.items.map((item) => item.name),
  );

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: site.name, path: "/" },
            { name: dict.newArrivals.hubTitle, path: "/new-arrivals" },
            { name: pageTitle, path: `/new-arrivals/${week}` },
          ],
          locale,
        )}
      />
      <JsonLd
        data={briefingCollectionJsonLd({
          locale,
          path: `/new-arrivals/${week}`,
          name: pageTitle,
          description,
          items: roundup.items.map((item) => ({
            headline: item.name,
            summary: item.summary,
            sourceUrl: newArrivalsPath(locale),
          })),
          datePublished: roundup.weekOf,
        })}
      />

      <p className={cn(monoContainer, "pt-8 font-sans text-[0.9rem]")}>
        <Link
          href={newArrivalsPath(locale)}
          className="font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
        >
          {dict.newArrivals.backToHub}
        </Link>
      </p>

      <NewArrivalsSection
        roundup={{ ...roundup, title: pageTitle }}
        locale={locale}
        kicker={dict.newArrivals.kicker}
        titleAs="h1"
        sectionId="new-arrivals-week"
      />
    </main>
  );
}
