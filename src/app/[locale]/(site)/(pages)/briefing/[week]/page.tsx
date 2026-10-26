import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { WellnessNewsDigest } from "@/components/wellness-news-digest";
import { appName } from "@/config/site";
import { isLocale, locales, localeToIntl, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getBriefingMessages } from "@/i18n/get-briefing-messages";
import { createBriefingDescription } from "@/content/briefing-copy";
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
  url: "/pokit-logo.png",
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
  const t = createTranslator(await getBriefingMessages(locale));
  const digest = await getWellnessDigestByWeek(locale, week);
  if (!digest) {
    return {};
  }

  const weekLabel = formatWeekLabel(week, locale);
  const title = t("{{weekLabel}} 웰니스 브리핑", { weekLabel });
  const description = createBriefingDescription(t,
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
      siteName: appName(locale),
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
  const t = createTranslator(await getBriefingMessages(locale));
  const digest = await getWellnessDigestByWeek(locale, week);
  if (!digest) {
    notFound();
  }

  const weekLabel = formatWeekLabel(week, locale);
  const pageTitle = t("{{weekLabel}} 웰니스 브리핑", { weekLabel });
  const description = createBriefingDescription(t,
    digest.items.map((item) => item.headline),
  );

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: appName(locale), path: "/" },
            { name: t("웰니스 브리핑"), path: "/briefing" },
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
          {t("← 브리핑 목록")}
        </Link>
      </p>

      <WellnessNewsDigest
        digest={{ ...digest, title: pageTitle }}
        locale={locale}
        kicker={t("주간 브리핑")}
        sourceLabel={t("출처")}
        readSourceLabel={t("원문 보기")}
        showExtras
        editorNoteLabel={t("POKIT 노트")}
        relatedLabel={t("같이 읽으면 좋은 이야기")}
        titleAs="h1"
      />
    </main>
  );
}
