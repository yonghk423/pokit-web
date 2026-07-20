import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { WellnessNewsDigest } from "@/components/wellness-news-digest";
import { site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { briefingWeekPath } from "@/lib/briefing-path";
import { cn, monoContainer, sectionSpacing } from "@/lib/cn";
import { briefingCollectionJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph } from "@/lib/locale-path";
import {
  getLatestWellnessDigest,
  listWellnessDigests,
} from "@/sanity/lib/fetch";

export const revalidate = false;

type Props = {
  params: Promise<{ locale: string }>;
};

const OG_IMAGE = {
  url: "/pokitstory.png",
  width: 512,
  height: 512,
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const latest = await getLatestWellnessDigest(locale);
  const description = latest
    ? dict.briefing.metaDescriptionFromItems(
        latest.items.map((item) => item.headline),
      )
    : dict.briefing.hubDescription;
  const alternates = localeAlternates(locale, "/briefing");

  return {
    title: dict.briefing.hubTitle,
    description,
    alternates,
    openGraph: {
      title: dict.briefing.hubTitle,
      description,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(locale),
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title: dict.briefing.hubTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function BriefingHubPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const [latest, archive] = await Promise.all([
    getLatestWellnessDigest(locale),
    listWellnessDigests(locale),
  ]);

  const pastWeeks = archive.filter((item) => item.weekOf !== latest?.weekOf);
  const description = latest
    ? dict.briefing.metaDescriptionFromItems(
        latest.items.map((item) => item.headline),
      )
    : dict.briefing.hubDescription;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: site.name, path: "/" },
            { name: dict.briefing.hubTitle, path: "/briefing" },
          ],
          locale,
        )}
      />
      {latest && (
        <JsonLd
          data={briefingCollectionJsonLd({
            locale,
            path: "/briefing",
            name: dict.briefing.hubTitle,
            description,
            items: latest.items,
            datePublished: latest.weekOf,
          })}
        />
      )}

      {latest ? (
        <WellnessNewsDigest
          digest={latest}
          locale={locale}
          kicker={dict.briefing.kicker}
          sourceLabel={dict.briefing.sourceLabel}
          readSourceLabel={dict.briefing.readSourceLabel}
          showExtras
          editorNoteLabel={dict.briefing.editorNoteLabel}
          relatedLabel={dict.briefing.relatedLabel}
          titleAs="h1"
        />
      ) : (
        <section className={cn(monoContainer, sectionSpacing)}>
          <h1 className="m-0 text-[clamp(1.85rem,3.5vw,2.75rem)] font-extrabold tracking-[-0.03em]">
            {dict.briefing.hubTitle}
          </h1>
          <p className="mt-4 font-sans text-muted">{dict.briefing.empty}</p>
        </section>
      )}

      {latest?.weekOf && (
        <p className={cn(monoContainer, "pb-4 font-sans text-[0.9rem]")}>
          <Link
            href={briefingWeekPath(locale, latest.weekOf)}
            className="font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
          >
            {dict.briefing.viewFull} → {latest.weekOf}
          </Link>
        </p>
      )}

      {pastWeeks.length > 0 && (
        <section className={cn(monoContainer, "border-t-2 border-black py-12 pb-16")}>
          <h2 className="m-0 mb-6 text-[1.25rem] font-extrabold tracking-[-0.02em]">
            {dict.briefing.archiveTitle}
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0">
            {pastWeeks.map((item) => (
              <li key={item.weekOf}>
                <Link
                  href={briefingWeekPath(locale, item.weekOf)}
                  className="font-sans text-[0.95rem] font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
                >
                  <time dateTime={item.weekOf}>{item.weekOf}</time>
                  <span className="mx-2 text-muted">·</span>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
