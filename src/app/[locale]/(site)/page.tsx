import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppDownload } from "@/components/app-download";
import { ArticleSectionCarousel } from "@/components/article-section-carousel";
import { FeaturedHeadlineCarousel } from "@/components/featured-headline-carousel";
import { HomeDigestStrip } from "@/components/home-digest-strip";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { homeSections } from "@/content/home";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { cn, monoContainer, sectionSpacing } from "@/lib/cn";
import { buildDigestArticlePool } from "@/lib/digest-articles";
import { websiteJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
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
  const digestArticles = buildDigestArticlePool(
    affairsHero,
    affairsRail,
    spotlightCarousel,
    radioCarousel,
    designCarousel,
    cityCarousel,
  );

  return (
    <>
      <JsonLd data={websiteJsonLd(dict.meta.siteDescription, locale)} />
      <main>
        <section className="border-b-2 border-black bg-beige py-6 text-center">
          <p className="m-0 label-caps text-green">
            {dict.home.inboxTagline}
          </p>
        </section>

        <HomeDigestStrip
          dict={dict}
          locale={locale}
          articles={digestArticles}
          spotlightArticles={spotlightCarousel}
          radioArticles={radioCarousel}
          categoryLabels={categoryLabels}
        />

        {hasTopStories && (
          <section id="affairs" className={cn(monoContainer, sectionSpacing)}>
            <SectionHeading
              kicker={affairs.kicker}
              title={affairs.title}
              viewAllHref={articlesArchiveHref(locale, 1, homeSections.affairs.archiveCategory)}
              viewAllLabel={dict.sectionHeading.viewAll}
            />
            <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(0,0.95fr)] items-start gap-[1.4rem] max-nav:grid-cols-1">
              {affairsHero.length > 0 && (
                <div className="min-w-0 border-r-2 border-black pr-[1.4rem] max-nav:border-r-0 max-nav:pr-0">
                  <FeaturedHeadlineCarousel
                    articles={affairsHero}
                    locale={locale}
                    categoryLabels={categoryLabels}
                    ariaLabel={affairsStoriesAria}
                    prevAria={dict.home.carouselPrev(affairsStoriesAria)}
                    nextAria={dict.home.carouselNext(affairsStoriesAria)}
                    shuffle
                    autoPlay
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
                    shuffle
                    autoPlay
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {spotlightCarousel.length > 0 && (
          <section id="spotlight" className={cn(monoContainer, sectionSpacing)}>
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
              shuffle
              autoPlay
            />
          </section>
        )}

        <section id="radio" className={cn(monoContainer, sectionSpacing)}>
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
              shuffle
              autoPlay
            />
          ) : (
            <p className="m-0 border-t-2 border-black py-6 font-sans text-[0.9rem] text-muted">
              {dict.home.radioEmpty(radio.nav)}
            </p>
          )}
        </section>

        {designCarousel.length > 0 && (
          <section id="design" className={cn(monoContainer, sectionSpacing)}>
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
              shuffle
              autoPlay
            />
          </section>
        )}

        {cityCarousel.length > 0 && (
          <section
            id="wellness"
            className="mt-16 border-y-2 border-black bg-wash py-14"
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
                shuffle
                autoPlay
              />
            </div>
          </section>
        )}

        <section
          className={cn(
            monoContainer,
            "border-t-2 border-black py-12 text-center font-sans text-[0.92rem] [&_a]:inline-block [&_a]:border-2 [&_a]:border-black [&_a]:bg-panel [&_a]:px-6 [&_a]:py-3 [&_a]:font-bold [&_a]:hover:bg-wash",
          )}
        >
          <Link href={withLocale(locale, "/articles")}>{dict.home.viewAllStories}</Link>
        </section>

        <AppDownload locale={locale} copy={dict.appDownload} />
      </main>
    </>
  );
}
