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
    weeklyHero,
    weeklyRail,
    spotlightRowSection,
    routineCarousel,
    radioLatestSection,
    commuteCarousel,
    designAwardsSection,
    spaceCarousel,
    cityGuidesSection,
    wellnessCarousel,
  } = await getHomePageWithCarousels(locale, dict);

  const weekly = dict.home.sections.weekly;
  const routine = dict.home.sections.routine;
  const commute = dict.home.sections.commute;
  const space = dict.home.sections.space;
  const wellness = dict.home.sections.wellness;
  const categoryLabels = dict.categories;

  const hasTopStories = weeklyHero.length > 0 || weeklyRail.length > 0;
  const weeklyStoriesAria = dict.home.storiesAria(weekly.nav);
  const digestArticles = buildDigestArticlePool(
    weeklyHero,
    weeklyRail,
    routineCarousel,
    commuteCarousel,
    spaceCarousel,
    wellnessCarousel,
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
          routineArticles={routineCarousel}
          commuteArticles={commuteCarousel}
          categoryLabels={categoryLabels}
        />

        {hasTopStories && (
          <section id="weekly" className={cn(monoContainer, sectionSpacing)}>
            <SectionHeading
              kicker={weekly.kicker}
              title={weekly.title}
              viewAllHref={articlesArchiveHref(locale, 1, homeSections.weekly.archiveCategory)}
              viewAllLabel={dict.sectionHeading.viewAll}
            />
            <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(0,0.95fr)] items-start gap-[1.4rem] max-nav:grid-cols-1">
              {weeklyHero.length > 0 && (
                <div className="min-w-0 border-r-2 border-black pr-[1.4rem] max-nav:border-r-0 max-nav:pr-0">
                  <FeaturedHeadlineCarousel
                    articles={weeklyHero}
                    locale={locale}
                    categoryLabels={categoryLabels}
                    ariaLabel={weeklyStoriesAria}
                    prevAria={dict.home.carouselPrev(weeklyStoriesAria)}
                    nextAria={dict.home.carouselNext(weeklyStoriesAria)}
                    autoPlay
                  />
                </div>
              )}
              {weeklyRail.length > 0 && (
                <div className="min-w-0">
                  <ArticleSectionCarousel
                    articles={weeklyRail}
                    locale={locale}
                    categoryLabels={categoryLabels}
                    variant="compact"
                    layout="rail"
                    ariaLabel={dict.home.storiesAria(weekly.nav)}
                    autoPlay
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {routineCarousel.length > 0 && (
          <section id="routine" className={cn(monoContainer, sectionSpacing)}>
            <SectionHeading
              kicker={spotlightRowSection?.kicker ?? routine.kicker}
              title={spotlightRowSection?.title ?? routine.title}
              viewAllHref={articlesArchiveHref(
                locale,
                1,
                homeSections.routine.archiveCategory,
              )}
              viewAllLabel={dict.sectionHeading.viewAll}
            />
            <ArticleSectionCarousel
              articles={routineCarousel}
              locale={locale}
              categoryLabels={categoryLabels}
              variant="vertical"
              layout="grid"
              columns={4}
              ariaLabel={dict.home.storiesAria(routine.nav)}
              autoPlay
            />
          </section>
        )}

        <section id="commute" className={cn(monoContainer, sectionSpacing)}>
          <SectionHeading
            kicker={radioLatestSection?.kicker ?? commute.kicker}
            title={radioLatestSection?.title ?? commute.title}
            viewAllHref={articlesArchiveHref(locale, 1, homeSections.commute.archiveCategory)}
            viewAllLabel={dict.sectionHeading.viewAll}
          />
          {commuteCarousel.length > 0 ? (
            <ArticleSectionCarousel
              articles={commuteCarousel}
              locale={locale}
              categoryLabels={categoryLabels}
              variant="vertical"
              layout="grid"
              columns={4}
              ariaLabel={dict.home.storiesAria(commute.nav)}
              autoPlay
            />
          ) : (
            <p className="m-0 border-t-2 border-black py-6 font-sans text-[0.9rem] text-muted">
              {dict.home.radioEmpty(commute.nav)}
            </p>
          )}
        </section>

        {spaceCarousel.length > 0 && (
          <section id="space" className={cn(monoContainer, sectionSpacing)}>
            <SectionHeading
              kicker={designAwardsSection?.kicker ?? space.kicker}
              title={designAwardsSection?.title ?? space.title}
              viewAllHref={articlesArchiveHref(
                locale,
                1,
                undefined,
                undefined,
                homeSections.space.archiveSection,
              )}
              viewAllLabel={dict.sectionHeading.viewAll}
            />
            <ArticleSectionCarousel
              articles={spaceCarousel}
              locale={locale}
              categoryLabels={categoryLabels}
              variant="vertical"
              layout="grid"
              columns={4}
              ariaLabel={dict.home.storiesAria(space.nav)}
              autoPlay
            />
          </section>
        )}

        {wellnessCarousel.length > 0 && (
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
                articles={wellnessCarousel}
                locale={locale}
                categoryLabels={categoryLabels}
                variant="vertical"
                layout="grid"
                columns={4}
                ariaLabel={dict.home.storiesAria(wellness.nav)}
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
