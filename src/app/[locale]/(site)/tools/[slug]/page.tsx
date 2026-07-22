import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { cn, monoContainer } from "@/lib/cn";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph } from "@/lib/locale-path";
import { newArrivalsPath } from "@/lib/new-arrivals-path";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import {
  getRoutineToolBySlug,
  listRoutineToolSlugs,
} from "@/sanity/lib/fetch";

export const revalidate = false;
export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const OG_IMAGE = {
  url: "/pokitstory.png",
  width: 512,
  height: 512,
} as const;

export async function generateStaticParams() {
  if (!isSanityConfigured()) {
    return [];
  }
  const slugs = await listRoutineToolSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug: rawSlug } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const slug = decodeURIComponent(rawSlug);
  const tool = await getRoutineToolBySlug(locale, slug);
  if (!tool) {
    return {};
  }

  const description = tool.summary || dict.newArrivals.hubDescription;
  const alternates = localeAlternates(locale, `/tools/${slug}`);

  return {
    title: tool.name,
    description,
    alternates,
    openGraph: {
      title: tool.name,
      description,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(locale),
      type: "article",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title: tool.name,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function RoutineToolPage({ params }: Props) {
  const { locale: rawLocale, slug: rawSlug } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const slug = decodeURIComponent(rawSlug);
  const tool = await getRoutineToolBySlug(locale, slug);
  if (!tool) {
    notFound();
  }

  const imageUrl =
    isSanityConfigured() && tool.image
      ? coverImageUrl(tool.image, 1400, 933)
      : null;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: site.name, path: "/" },
            { name: dict.newArrivals.hubTitle, path: "/new-arrivals" },
            { name: tool.name, path: `/tools/${slug}` },
          ],
          locale,
        )}
      />

      <article className={cn(monoContainer, "pb-16 pt-8")}>
        <p className="m-0 mb-6 font-sans text-[0.9rem]">
          <Link
            href={newArrivalsPath(locale)}
            className="font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
          >
            {dict.newArrivals.backToHub}
          </Link>
        </p>

        <p className="m-0 label-caps text-green">{dict.newArrivals.kicker}</p>
        <h1 className="m-0 mt-2 text-[clamp(1.85rem,3.5vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
          {tool.name}
        </h1>
        <p className="m-0 mt-4 max-w-2xl font-sans text-[1.05rem] leading-relaxed text-muted">
          {tool.summary}
        </p>

        <figure
          className={cn(
            "relative mt-8 aspect-[3/2] w-full overflow-hidden border-2 border-black bg-beige",
            !imageUrl &&
              "grid min-h-[14rem] place-items-center font-sans text-[0.72rem] font-extrabold tracking-[0.1em] text-indigo uppercase",
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={tool.imageAlt || tool.name}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-cover"
              {...imageBlurProps(tool.imageLqip)}
            />
          ) : (
            <span>POKIT</span>
          )}
        </figure>

        {tool.body && tool.body.length > 0 ? (
          <div className="prose mt-10 max-w-2xl font-sans text-[1.02rem] leading-relaxed">
            <PortableText value={tool.body} />
          </div>
        ) : null}

        <p className="m-0 mt-12 font-sans text-[0.9rem]">
          <Link
            href={newArrivalsPath(locale)}
            className="font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
          >
            {dict.newArrivals.viewAll} →
          </Link>
        </p>
      </article>
    </main>
  );
}
