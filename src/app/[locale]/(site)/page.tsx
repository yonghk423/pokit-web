import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppDownload } from "@/components/app-download";
import { FeaturedHeadlineCarousel } from "@/components/featured-headline-carousel";
import { ArticleSectionCarousel } from "@/components/article-section-carousel";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { homeSections } from "@/content/home";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
import { cn, monoContainer } from "@/lib/cn";
import { websiteJsonLd } from "@/lib/json-ld";
import { articlesArchiveHref } from "@/sanity/lib/articles";
import { getHomePageWithCarousels } from "@/sanity/lib/fetch";

export const revalidate = false;

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const dict = await getDictionary(rawLocale);

  return {
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    alternates: localeAlternates(rawLocale, "/"),
    openGraph: {
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: localeAlternates(rawLocale, "/").canonical,
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [
        {
          url: "/pokitstory.png",
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      images: ["/pokitstory.png"],
    },
  };
}

function RadioWidget({ dict }: { dict: Awaited<ReturnType<typeof getDictionary>> }) {
  const radio = dict.home.radio;

  return (
    <section
      className={cn(
        monoContainer,
        "mt-[1.2rem] grid grid-cols-[0.9fr_1.8fr_1.5fr] gap-4 border border-line bg-green p-4 font-sans text-white max-nav:mt-[0.85rem] max-nav:grid-cols-1 max-nav:p-[0.85rem] max-nav:gap-[0.85rem]",
      )}
      aria-label={radio.ariaLabel}
    >
      <div className="border-r border-white/25 pr-4 max-nav:border-r-0 max-nav:border-b max-nav:pb-4 max-nav:pr-0">
        <p className="m-0 text-[0.72rem] font-extrabold tracking-[0.1em] text-brand uppercase">
          POKIT Radio
        </p>
        <strong className="mt-1 block text-[1.1rem]">{radio.onAir}</strong>
      </div>
      <div className="border-r border-white/25 pr-4 max-nav:border-r-0 max-nav:border-b max-nav:pb-4 max-nav:pr-0">
        <p className="m-0 text-[0.72rem] font-extrabold tracking-[0.06em] text-brand-soft uppercase">
          {radio.deskKicker}
        </p>
        <h2 className="mt-[0.35rem] mb-0 text-[1.05rem] leading-[1.25] max-[640px]:text-[0.98rem]">
          {radio.deskTitle}
        </h2>
        <span className="mt-[0.4rem] block text-[0.78rem] text-white/68">
          {radio.listenLive}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1 max-[640px]:pr-0">
        <article>
          <p className="m-0 text-[0.72rem] font-extrabold tracking-[0.06em] text-brand-soft uppercase">
            {radio.continentalKicker}
          </p>
          <span className="mt-[0.4rem] block text-[0.78rem] text-white/68">
            {radio.continentalDesc}
          </span>
        </article>
        <article>
          <p className="m-0 text-[0.72rem] font-extrabold tracking-[0.06em] text-brand-soft uppercase">
            {radio.topHourKicker}
          </p>
          <span className="mt-[0.4rem] block text-[0.78rem] text-white/68">
            {radio.topHourDesc}
          </span>
        </article>
      </div>
    </section>
  );
}

export default async function Home({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const {
    affairsHero,
    affairsRail,
    spotlightRowSection,
    spotlightCarousel,
    radioLatestSection,
    radioCarousel,
    designAwardsSection,
    designCarousel,
    cityGuidesSection,
    cityCarousel,
  } = await getHomePageWithCarousels(locale, dict);

  const affairs = dict.home.sections.affairs;
  const spotlight = dict.home.sections.spotlight;
  const radio = dict.home.sections.radio;
  const design = dict.home.sections.design;
  const wellness = dict.home.sections.wellness;
  const categoryLabels = dict.categories;

  const hasTopStories = affairsHero.length > 0 || affairsRail.length > 0;
  const affairsStoriesAria = dict.home.storiesAria(affairs.nav);

  return (
    <>
      <JsonLd data={websiteJsonLd(dict.meta.siteDescription, locale)} />
      <main>
        <section className="border-b border-fine-line bg-paper py-[1.1rem] text-center">
          <p className="m-0 font-sans text-[0.78rem] font-bold text-green">
            {dict.home.inboxTagline}
          </p>
        </section>

        <RadioWidget dict={dict} />

        {hasTopStories && (
          <section id="affairs" className={cn(monoContainer, "mt-[1.4rem]")}>
            <SectionHeading
              kicker={affairs.kicker}
              title={affairs.title}
              viewAllHref={articlesArchiveHref(locale, 1, homeSections.affairs.archiveCategory)}
              viewAllLabel={dict.sectionHeading.viewAll}
            />
            <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(0,0.95fr)] items-start gap-[1.4rem] max-nav:grid-cols-1">
              {affairsHero.length > 0 && (
                <div className="min-w-0 border-r border-line pr-[1.4rem] max-nav:border-r-0 max-nav:pr-0">
                  <FeaturedHeadlineCarousel
                    articles={affairsHero}
                    locale={locale}
                    categoryLabels={categoryLabels}
                    ariaLabel={affairsStoriesAria}
                    prevAria={dict.home.carouselPrev(affairsStoriesAria)}
                    nextAria={dict.home.carouselNext(affairsStoriesAria)}
                  />
                </div>
              )}
              {affairsRail.length > 0 && (
                <div className="min-w-0">
                  <ArticleSectionCarousel
                    articles={affairsRail}
                    locale={locale}
                    categoryLabels={categoryLabels}
                    variant="compact"
                    layout="rail"
                    ariaLabel={dict.home.storiesAria(affairs.nav)}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {spotlightCarousel.length > 0 && (
          <section id="spotlight" className={cn(monoContainer, "mt-[2.7rem]")}>
            <SectionHeading
              kicker={spotlightRowSection?.kicker ?? spotlight.kicker}
              title={spotlightRowSection?.title ?? spotlight.title}
              viewAllHref={articlesArchiveHref(
                locale,
                1,
                homeSections.spotlight.archiveCategory,
              )}
              viewAllLabel={dict.sectionHeading.viewAll}
            />
            <ArticleSectionCarousel
              articles={spotlightCarousel}
              locale={locale}
              categoryLabels={categoryLabels}
              variant="vertical"
              layout="grid"
              columns={4}
              ariaLabel={dict.home.storiesAria(spotlight.nav)}
            />
          </section>
        )}

        <section id="radio" className={cn(monoContainer, "mt-[2.7rem]")}>
          <SectionHeading
            kicker={radioLatestSection?.kicker ?? radio.kicker}
            title={radioLatestSection?.title ?? radio.title}
            viewAllHref={articlesArchiveHref(locale, 1, homeSections.radio.archiveCategory)}
            viewAllLabel={dict.sectionHeading.viewAll}
          />
          {radioCarousel.length > 0 ? (
            <ArticleSectionCarousel
              articles={radioCarousel}
              locale={locale}
              categoryLabels={categoryLabels}
              variant="vertical"
              layout="grid"
              columns={4}
              ariaLabel={dict.home.storiesAria(radio.nav)}
            />
          ) : (
            <p className="m-0 border-t border-fine-line py-[1.2rem] font-sans text-[0.9rem] text-muted">
              {dict.home.radioEmpty(radio.nav)}
            </p>
          )}
        </section>

        {designCarousel.length > 0 && (
          <section id="design" className={cn(monoContainer, "mt-[2.7rem]")}>
            <SectionHeading
              kicker={designAwardsSection?.kicker ?? design.kicker}
              title={designAwardsSection?.title ?? design.title}
              viewAllHref={articlesArchiveHref(
                locale,
                1,
                undefined,
                undefined,
                homeSections.design.archiveSection,
              )}
              viewAllLabel={dict.sectionHeading.viewAll}
            />
            <ArticleSectionCarousel
              articles={designCarousel}
              locale={locale}
              categoryLabels={categoryLabels}
              variant="vertical"
              layout="grid"
              columns={4}
              ariaLabel={dict.home.storiesAria(design.nav)}
            />
          </section>
        )}

        {cityCarousel.length > 0 && (
          <section
            id="wellness"
            className="mt-12 border-y border-fine-line bg-wash py-[2.2rem] pb-[2.6rem]"
          >
            <div className={monoContainer}>
              <SectionHeading
                kicker={cityGuidesSection?.kicker ?? wellness.kicker}
                title={cityGuidesSection?.title ?? wellness.title}
                viewAllHref={articlesArchiveHref(locale, 1, homeSections.wellness.archiveCategory)}
                viewAllLabel={dict.sectionHeading.viewAll}
              />
              <ArticleSectionCarousel
                articles={cityCarousel}
                locale={locale}
                categoryLabels={categoryLabels}
                variant="vertical"
                layout="grid"
                columns={4}
                ariaLabel={dict.home.storiesAria(wellness.nav)}
              />
            </div>
          </section>
        )}

        <section
          className={cn(
            monoContainer,
            "border-t border-fine-line py-8 pb-10 text-center font-sans text-[0.92rem] [&_a]:underline [&_a]:underline-offset-[0.14em] [&_a:hover]:text-green",
          )}
        >
          <Link href={withLocale(locale, "/articles")}>{dict.home.viewAllStories}</Link>
        </section>

        <AppDownload locale={locale} copy={dict.appDownload} />
      </main>
    </>
  );
}
