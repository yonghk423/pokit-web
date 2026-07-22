import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { NewArrivalsSection } from "@/components/new-arrivals-section";
import { site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { cn, monoContainer, sectionSpacing } from "@/lib/cn";
import { briefingCollectionJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph } from "@/lib/locale-path";
import {
  newArrivalsPath,
  newArrivalsWeekPath,
} from "@/lib/new-arrivals-path";
import {
  getLatestNewArrivals,
  listNewArrivals,
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
  const latest = await getLatestNewArrivals(locale);
  const description = latest
    ? dict.newArrivals.metaDescriptionFromItems(
        latest.items.map((item) => item.name),
      )
    : dict.newArrivals.hubDescription;
  const alternates = localeAlternates(locale, "/new-arrivals");

  return {
    title: dict.newArrivals.hubTitle,
    description,
    alternates,
    openGraph: {
      title: dict.newArrivals.hubTitle,
      description,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(locale),
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title: dict.newArrivals.hubTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function NewArrivalsHubPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const [latest, archive] = await Promise.all([
    getLatestNewArrivals(locale),
    listNewArrivals(locale),
  ]);

  const pastWeeks = archive.filter((item) => item.weekOf !== latest?.weekOf);
  const description = latest
    ? dict.newArrivals.metaDescriptionFromItems(
        latest.items.map((item) => item.name),
      )
    : dict.newArrivals.hubDescription;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: site.name, path: "/" },
            { name: dict.newArrivals.hubTitle, path: "/new-arrivals" },
          ],
          locale,
        )}
      />
      {latest && (
        <JsonLd
          data={briefingCollectionJsonLd({
            locale,
            path: "/new-arrivals",
            name: dict.newArrivals.hubTitle,
            description,
            items: latest.items.map((item) => ({
              headline: item.name,
              summary: item.summary,
              sourceUrl: newArrivalsPath(locale),
            })),
            datePublished: latest.weekOf,
          })}
        />
      )}

      {latest ? (
        <NewArrivalsSection
          roundup={latest}
          locale={locale}
          kicker={dict.newArrivals.kicker}
          sectionTitle={dict.newArrivals.hubTitle}
          titleAs="h1"
          sectionId="new-arrivals-hub"
        />
      ) : (
        <section className={cn(monoContainer, sectionSpacing)}>
          <h1 className="m-0 text-[clamp(1.85rem,3.5vw,2.75rem)] font-extrabold tracking-[-0.03em]">
            {dict.newArrivals.hubTitle}
          </h1>
          <p className="mt-4 font-sans text-muted">{dict.newArrivals.empty}</p>
        </section>
      )}

      {latest?.weekOf && (
        <p className={cn(monoContainer, "pb-4 font-sans text-[0.9rem]")}>
          <Link
            href={newArrivalsWeekPath(locale, latest.weekOf)}
            className="font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
          >
            {dict.newArrivals.viewFull} → {latest.weekOf}
          </Link>
        </p>
      )}

      {pastWeeks.length > 0 && (
        <section className={cn(monoContainer, "border-t-2 border-black py-12 pb-16")}>
          <h2 className="m-0 mb-6 text-[1.25rem] font-extrabold tracking-[-0.02em]">
            {dict.newArrivals.archiveTitle}
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0">
            {pastWeeks.map((item) => (
              <li key={item.weekOf}>
                <Link
                  href={newArrivalsWeekPath(locale, item.weekOf)}
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
