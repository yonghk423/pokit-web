import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HomePreviewShell } from "@/components/home-preview-shell";
import { JsonLd } from "@/components/json-ld";
import { ToolArchiveCard } from "@/components/tool-archive-card";
import { site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { cn, monoContainer } from "@/lib/cn";
import { briefingCollectionJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
import { newArrivalsPath } from "@/lib/new-arrivals-path";
import { listAllRoutineTools } from "@/sanity/lib/fetch";

export const revalidate = false;

type Props = {
  params: Promise<{ locale: string }>;
};

const OG_IMAGE = {
  url: "/pokit-logo.png",
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
  const tools = await listAllRoutineTools(locale);
  const description = tools.length
    ? dict.newArrivals.metaDescriptionFromItems(tools.map((item) => item.name))
    : dict.newArrivals.hubDescription;
  const title = dict.newArrivals.allTools;
  const alternates = localeAlternates(locale, "/new-arrivals");

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

export default async function NewArrivalsHubPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const tools = await listAllRoutineTools(locale);
  const description = tools.length
    ? dict.newArrivals.metaDescriptionFromItems(tools.map((item) => item.name))
    : dict.newArrivals.hubDescription;

  return (
    <HomePreviewShell
      locale={locale}
      closeLabel={dict.home.closePreview}
      toolKicker={dict.newArrivals.kicker}
    >
    <main className="pb-8">
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: site.name, path: "/" },
            { name: dict.newArrivals.allTools, path: "/new-arrivals" },
          ],
          locale,
        )}
      />
      {tools.length > 0 && (
        <JsonLd
          data={briefingCollectionJsonLd({
            locale,
            path: "/new-arrivals",
            name: dict.newArrivals.allTools,
            description,
            items: tools.map((item) => ({
              headline: item.name,
              summary: item.summary,
              sourceUrl: newArrivalsPath(locale),
            })),
          })}
        />
      )}

      <section className={cn(monoContainer, "pt-10 pb-16 max-nav:pt-8")}>
        <header className="mb-10 max-nav:mb-8">
          <p className="m-0 font-sans text-[0.72rem] font-semibold tracking-[0.08em] text-muted uppercase">
            {dict.newArrivals.kicker}
          </p>
          <h1 className="m-0 mt-3 max-w-[40rem] font-sans text-[clamp(2.35rem,5.5vw,4rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink">
            {dict.newArrivals.allTools}
          </h1>
          <p className="mt-4 mb-0 max-w-[36rem] font-sans text-[0.95rem] leading-relaxed text-muted">
            {tools.length > 0
              ? dict.newArrivals.allToolsCount(tools.length)
              : dict.newArrivals.empty}
          </p>
        </header>

        {tools.length > 0 ? (
          <div className="grid grid-cols-4 gap-x-4 gap-y-8 max-nav:grid-cols-2 max-archive:grid-cols-1">
            {tools.map((item) => (
              <ToolArchiveCard
                key={item.slug}
                item={item}
                kicker={dict.newArrivals.kicker}
              />
            ))}
          </div>
        ) : null}

        <p className="mt-14 mb-0 border-t border-ink/8 pt-8">
          <Link
            href={withLocale(locale, "/")}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-sans text-[0.8rem] font-semibold text-white no-underline transition-colors hover:bg-indigo"
          >
            {dict.archive.backHome}
          </Link>
        </p>
      </section>
    </main>
    </HomePreviewShell>
  );
}
