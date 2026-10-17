import { notFound } from "next/navigation";

import { AppDownload } from "@/components/app-download";
import { HomeHero } from "@/components/home-hero";
import { HomeLabs } from "@/components/home-labs";
import { HomeWorkRows, type HomeWorkSection } from "@/components/home-work-rows";
import { JsonLd } from "@/components/json-ld";
import { ScrollReveal } from "@/components/scroll-reveal";
import { homeSections } from "@/content/home";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getHomeVideoMessages } from "@/i18n/get-home-video-messages";
import { websiteJsonLd } from "@/lib/json-ld";
import { withLocale } from "@/lib/locale-path";
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

export default async function Home({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const [dict, videoMessages] = await Promise.all([
    getDictionary(locale),
    getHomeVideoMessages(locale),
  ]);
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
    pastRoutineTools,
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
      <main>
          {(weeklyHero.length > 0 || feedArticles.length > 0) && (
            <div data-hide-in-pokit-app>
              <HomeHero
                locale={locale}
                line1={dict.home.heroLine1}
                accent={dict.home.heroAccent}
                rest={dict.home.heroRest}
                feedTitle={dict.home.feedTitle}
                feedPrevLabel={dict.home.carouselPrev(dict.home.feedTitle)}
                feedNextLabel={dict.home.carouselNext(dict.home.feedTitle)}
                heroArticles={weeklyHero.length > 0 ? weeklyHero : feedArticles}
                feedArticles={feedArticles.length > 0 ? feedArticles : weeklyHero}
                categoryLabels={categoryLabels}
                videoMessages={videoMessages}
                download={dict.appDownload}
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
              pastTools={pastRoutineTools}
              locale={locale}
              line1={dict.home.labsLine1}
              accent={dict.home.labsAccent}
              rest={dict.home.labsRest}
              viewAllHref={newArrivalsPath(locale)}
              viewAllLabel={dict.newArrivals.viewAll}
              pastLabel={dict.newArrivals.pastTools}
              kicker={dict.newArrivals.kicker}
            />
          )}

          <div data-hide-in-pokit-app>
            <ScrollReveal>
              <AppDownload
                locale={locale}
                size="large"
                variant="editorial"
                sectionId="download"
                copy={{
                  ...dict.appDownload,
                  kicker: dict.appPage.ctaKicker,
                  title: dict.appPage.ctaTitle,
                  body: dict.appPage.ctaBody,
                  download: dict.appPage.download,
                  qrHint: dict.appPage.ctaQrHint,
                }}
              />
            </ScrollReveal>
          </div>
      </main>
    </>
  );
}
