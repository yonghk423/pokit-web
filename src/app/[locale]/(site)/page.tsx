import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomeAbout } from "@/components/home-about";
import { HomeHero } from "@/components/home-hero";
import { HomeLabs } from "@/components/home-labs";
import { HomePreviewShell } from "@/components/home-preview-shell";
import { HomeWorkRows, type HomeWorkSection } from "@/components/home-work-rows";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/config/site";
import { homeSections } from "@/content/home";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { websiteJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
import { newArrivalsPath } from "@/lib/new-arrivals-path";
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
  const alternates = localeAlternates(rawLocale, "/");

  return {
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    alternates,
    openGraph: {
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [
        {
          url: "/pokit5.png",
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      images: ["/pokit5.png"],
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
    sleepStoriesSection,
    sleepCarousel,
    cityGuidesSection,
    wellnessCarousel,
    newArrivals,
  } = await getHomePageWithCarousels(locale, dict);

  const routine = dict.home.sections.routine;
  const commute = dict.home.sections.commute;
  const space = dict.home.sections.space;
  const sleep = dict.home.sections.sleep;
  const wellness = dict.home.sections.wellness;
  const categoryLabels = dict.categories;

  const feedArticles = [...weeklyHero, ...weeklyRail].filter(
    (article, index, list) =>
      list.findIndex((item) => item.slug === article.slug) === index,
  );

  const workSections: HomeWorkSection[] = [
    {
      id: homeSections.routine.id,
      name: routine.nav,
      title: spotlightRowSection?.title ?? routine.title,
      viewAllHref: articlesArchiveHref(
        locale,
        1,
        homeSections.routine.archiveCategory,
      ),
      articles: routineCarousel,
      prevLabel: dict.home.carouselPrev(routine.nav),
      nextLabel: dict.home.carouselNext(routine.nav),
    },
    {
      id: homeSections.commute.id,
      name: commute.nav,
      title: radioLatestSection?.title ?? commute.title,
      viewAllHref: articlesArchiveHref(
        locale,
        1,
        homeSections.commute.archiveCategory,
      ),
      articles: commuteCarousel,
      prevLabel: dict.home.carouselPrev(commute.nav),
      nextLabel: dict.home.carouselNext(commute.nav),
    },
    {
      id: homeSections.space.id,
      name: space.nav,
      title: designAwardsSection?.title ?? space.title,
      viewAllHref: articlesArchiveHref(
        locale,
        1,
        undefined,
        undefined,
        homeSections.space.archiveSection,
      ),
      articles: spaceCarousel,
      prevLabel: dict.home.carouselPrev(space.nav),
      nextLabel: dict.home.carouselNext(space.nav),
    },
    {
      id: homeSections.sleep.id,
      name: sleep.nav,
      title: sleepStoriesSection?.title ?? sleep.title,
      viewAllHref: articlesArchiveHref(
        locale,
        1,
        homeSections.sleep.archiveCategory,
      ),
      articles: sleepCarousel,
      prevLabel: dict.home.carouselPrev(sleep.nav),
      nextLabel: dict.home.carouselNext(sleep.nav),
    },
    {
      id: homeSections.wellness.id,
      name: wellness.nav,
      title: cityGuidesSection?.title ?? wellness.title,
      viewAllHref: articlesArchiveHref(
        locale,
        1,
        homeSections.wellness.archiveCategory,
      ),
      articles: wellnessCarousel,
      prevLabel: dict.home.carouselPrev(wellness.nav),
      nextLabel: dict.home.carouselNext(wellness.nav),
    },
  ];

  return (
    <>
      <JsonLd data={websiteJsonLd(dict.meta.siteDescription, locale)} />
      <main className="pb-8">
        <HomePreviewShell
          locale={locale}
          categoryLabels={categoryLabels}
          closeLabel={dict.home.closePreview}
          addToPokit={dict.article.addToPokit}
        >
          {(weeklyHero.length > 0 || feedArticles.length > 0) && (
            <div data-hide-in-pokit-app>
              <HomeHero
                locale={locale}
                line1={dict.home.heroLine1}
                accent={dict.home.heroAccent}
                rest={dict.home.heroRest}
                feedTitle={dict.home.feedTitle}
                heroArticles={weeklyHero.length > 0 ? weeklyHero : feedArticles}
                feedArticles={feedArticles.length > 0 ? feedArticles : weeklyHero}
                categoryLabels={categoryLabels}
              />
            </div>
          )}

          <HomeWorkRows
            line1={dict.home.workLine1}
            accent={dict.home.workAccent}
            rest={dict.home.workRest}
            viewAllLabel={dict.home.exploreAll}
            viewAllHref={withLocale(locale, "/articles")}
            sections={workSections}
            locale={locale}
          />

          {newArrivals && newArrivals.items.length > 0 && (
            <HomeLabs
              roundup={newArrivals}
              locale={locale}
              line1={dict.home.labsLine1}
              accent={dict.home.labsAccent}
              rest={dict.home.labsRest}
              viewAllHref={newArrivalsPath(locale)}
              viewAllLabel={dict.newArrivals.viewAll}
              kicker={dict.newArrivals.kicker}
            />
          )}

          <div data-hide-in-pokit-app>
            <HomeAbout locale={locale} dict={dict} />
          </div>
        </HomePreviewShell>
      </main>
    </>
  );
}
