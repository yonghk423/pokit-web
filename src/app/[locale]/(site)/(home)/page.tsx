import { AppPromotion } from "@/components/app-promotion";
import { notFound } from "next/navigation";

import { AppDownload } from "@/components/app-download";
import { HomeHero } from "@/components/home-hero";
import { HomeLabs } from "@/components/home-labs";
import { HomeWorkRows, type HomeWorkSection } from "@/components/home-work-rows";
import { JsonLd } from "@/components/json-ld";
import { ScrollReveal } from "@/components/scroll-reveal";
import { homeSections } from "@/content/home";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getCommonMessages } from "@/i18n/get-common-messages";
import { createCategoryLabels } from "@/i18n/category-labels";
import { createHomeSectionLabels } from "@/i18n/home-section-labels";
import { getHomeSectionNavMessages } from "@/i18n/get-home-section-nav-messages";
import { getHomeSectionContentMessages } from "@/i18n/get-home-section-content-messages";
import { createTranslator } from "@/i18n/create-translator";
import { getHomeMessages } from "@/i18n/get-home-messages";
import { getHomeVideoMessages } from "@/i18n/get-home-video-messages";
import { getNewArrivalsMessages } from "@/i18n/get-new-arrivals-messages";
import { getAppDownloadMessages } from "@/i18n/get-app-download-messages";
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
  const [commonMessages, videoMessages, downloadMessages, homeMessages, toolMessages, sectionNav, sectionContent] = await Promise.all([
    getCommonMessages(locale),
    getHomeVideoMessages(locale),
    getAppDownloadMessages(locale),
    getHomeMessages(locale),
    getNewArrivalsMessages(locale),
    getHomeSectionNavMessages(locale),
    getHomeSectionContentMessages(locale),
  ]);
  const t = createTranslator(homeMessages);
  const commonT = createTranslator(commonMessages);
  const categoryLabels = createCategoryLabels(createTranslator(commonMessages));
  const sectionLabels = createHomeSectionLabels(
    createTranslator(sectionNav),
    createTranslator(sectionContent),
  );
  const toolT = createTranslator(toolMessages);
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
  } = await getHomePageWithCarousels(locale, sectionLabels);

  const routine = sectionLabels.routine;
  const commute = sectionLabels.commute;
  const space = sectionLabels.space;
  const sleep = sectionLabels.sleep;
  const wellness = sectionLabels.wellness;

  const feedArticles = [...weeklyHero, ...weeklyRail].filter(
    (article, index, list) =>
      list.findIndex((item) => item.slug === article.slug) === index,
  );

  const workSections: HomeWorkSection[] = [
    {
      id: homeSections.routine.id,
      name: routine.nav,
      storiesLabel: t("{{label}} 이야기", { label: routine.nav }),
      title: spotlightRowSection?.title ?? routine.title,
      viewAllHref: articlesArchiveHref(
        locale,
        1,
        homeSections.routine.archiveCategory,
      ),
      articles: routineCarousel,
      prevLabel: t("{{label}} 이전", { label: routine.nav }),
      nextLabel: t("{{label}} 다음", { label: routine.nav }),
    },
    {
      id: homeSections.commute.id,
      name: commute.nav,
      storiesLabel: t("{{label}} 이야기", { label: commute.nav }),
      title: radioLatestSection?.title ?? commute.title,
      viewAllHref: articlesArchiveHref(
        locale,
        1,
        homeSections.commute.archiveCategory,
      ),
      articles: commuteCarousel,
      prevLabel: t("{{label}} 이전", { label: commute.nav }),
      nextLabel: t("{{label}} 다음", { label: commute.nav }),
    },
    {
      id: homeSections.space.id,
      name: space.nav,
      storiesLabel: t("{{label}} 이야기", { label: space.nav }),
      title: designAwardsSection?.title ?? space.title,
      viewAllHref: articlesArchiveHref(
        locale,
        1,
        undefined,
        undefined,
        homeSections.space.archiveSection,
      ),
      articles: spaceCarousel,
      prevLabel: t("{{label}} 이전", { label: space.nav }),
      nextLabel: t("{{label}} 다음", { label: space.nav }),
    },
    {
      id: homeSections.sleep.id,
      name: sleep.nav,
      storiesLabel: t("{{label}} 이야기", { label: sleep.nav }),
      title: sleepStoriesSection?.title ?? sleep.title,
      viewAllHref: articlesArchiveHref(
        locale,
        1,
        homeSections.sleep.archiveCategory,
      ),
      articles: sleepCarousel,
      prevLabel: t("{{label}} 이전", { label: sleep.nav }),
      nextLabel: t("{{label}} 다음", { label: sleep.nav }),
    },
    {
      id: homeSections.wellness.id,
      name: wellness.nav,
      storiesLabel: t("{{label}} 이야기", { label: wellness.nav }),
      title: cityGuidesSection?.title ?? wellness.title,
      viewAllHref: articlesArchiveHref(
        locale,
        1,
        homeSections.wellness.archiveCategory,
      ),
      articles: wellnessCarousel,
      prevLabel: t("{{label}} 이전", { label: wellness.nav }),
      nextLabel: t("{{label}} 다음", { label: wellness.nav }),
    },
  ];

  return (
    <>
      <JsonLd data={websiteJsonLd(commonT("일상 속 작은 루틴으로 웰니스를 가꾸는 가이드와 앱. POKIT에서 일상·루틴·웰니스 이야기를 만나보세요."), locale)} />
      <main>
          {(weeklyHero.length > 0 || feedArticles.length > 0) && (
            <div data-hide-in-pokit-app>
              <HomeHero
                locale={locale}
                line1={t("일상 루틴과 웰니스.")}
                accent={t("포켓")}
                rest={t("가이드.")}
                feedTitle={t("최신 이야기")}
                feedPrevLabel={t("{{label}} 이전", { label: t("최신 이야기") })}
                feedNextLabel={t("{{label}} 다음", { label: t("최신 이야기") })}
                heroArticles={weeklyHero.length > 0 ? weeklyHero : feedArticles}
                feedArticles={feedArticles.length > 0 ? feedArticles : weeklyHero}
                categoryLabels={categoryLabels}
                videoMessages={videoMessages}
                downloadMessages={downloadMessages}
              />
            </div>
          )}

          <div className="mx-auto mt-12 max-w-[1320px] px-4 nav:px-6"><AppPromotion locale={locale} messages={downloadMessages} placement="home-between-stories" /></div>

          <HomeWorkRows
            line1={t("하루의 장면을")}
            accent={t("루틴으로")}
            rest={t("이어 갑니다.")}
            viewAllLabel={t("모두 보기")}
            viewAllHref={withLocale(locale, "/articles")}
            sections={workSections}
            locale={locale}
          />

          {newArrivals && newArrivals.items.length > 0 && (
            <HomeLabs
              roundup={newArrivals}
              pastTools={pastRoutineTools}
              locale={locale}
              line1={t("하루를 붙잡는")}
              accent={t("루틴")}
              rest={t("도구.")}
              viewAllHref={newArrivalsPath(locale)}
              viewAllLabel={toolT("도구 전체")}
              pastLabel={toolT("지난 도구")}
              kicker={toolT("루틴 도구")}
            />
          )}

          <div data-hide-in-pokit-app>
            <ScrollReveal>
              <AppDownload
                locale={locale}
                size="large"
                variant="editorial"
                sectionId="download"
                messages={downloadMessages}
              />
            </ScrollReveal>
          </div>
      </main>
    </>
  );
}
