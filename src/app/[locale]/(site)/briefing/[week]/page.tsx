import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { WellnessNewsDigest } from "@/components/wellness-news-digest";
import { site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { briefingPath, isBriefingWeekParam } from "@/lib/briefing-path";
import { cn, monoContainer } from "@/lib/cn";
import { briefingCollectionJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph } from "@/lib/locale-path";
import {
  getWellnessDigestByWeek,
  listWellnessDigests,
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
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function generateStaticParams() {
  const digests = await listWellnessDigests("ko");
  return locales.flatMap((locale) =>
    digests.map((digest) => ({ locale, week: digest.weekOf })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, week } = await params;
  if (!isLocale(rawLocale) || !isBriefingWeekParam(week)) {
    return {};
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const digest = await getWellnessDigestByWeek(locale, week);
  if (!digest) {
    return {};
  }

  const weekLabel = formatWeekLabel(week, locale);
  const title = dict.briefing.weekTitle(weekLabel);
  const description = dict.briefing.metaDescriptionFromItems(
    digest.items.map((item) => item.headline),
  );
  const alternates = localeAlternates(locale, `/briefing/${week}`);

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

export default async function BriefingWeekPage({ params }: Props) {
  const { locale: rawLocale, week } = await params;
  if (!isLocale(rawLocale) || !isBriefingWeekParam(week)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const digest = await getWellnessDigestByWeek(locale, week);
  if (!digest) {
    notFound();
  }

  const weekLabel = formatWeekLabel(week, locale);
  const pageTitle = dict.briefing.weekTitle(weekLabel);
  const description = dict.briefing.metaDescriptionFromItems(
    digest.items.map((item) => item.headline),
  );

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: site.name, path: "/" },
            { name: dict.briefing.hubTitle, path: "/briefing" },
            { name: pageTitle, path: `/briefing/${week}` },
          ],
          locale,
        )}
      />
      <JsonLd
        data={briefingCollectionJsonLd({
          locale,
          path: `/briefing/${week}`,
          name: pageTitle,
          description,
          items: digest.items,
          datePublished: digest.weekOf,
        })}
      />

      <p className={cn(monoContainer, "pt-8 font-sans text-[0.9rem]")}>
        <Link
          href={briefingPath(locale)}
          className="font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
        >
          {dict.briefing.backToHub}
        </Link>
      </p>

      <WellnessNewsDigest
        digest={{ ...digest, title: pageTitle }}
        locale={locale}
        kicker={dict.briefing.kicker}
        sourceLabel={dict.briefing.sourceLabel}
        readSourceLabel={dict.briefing.readSourceLabel}
        showExtras
        editorNoteLabel={dict.briefing.editorNoteLabel}
        relatedLabel={dict.briefing.relatedLabel}
        titleAs="h1"
      />
    </main>
  );
}
