import Link from "next/link";

import { AppDownload } from "@/components/app-download";
import { FeaturedHeadlineCarousel } from "@/components/featured-headline-carousel";
import { ArticleSectionCarousel } from "@/components/article-section-carousel";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { articlesArchiveHref } from "@/sanity/lib/articles";
import { getHomePageWithCarousels } from "@/sanity/lib/fetch";
import { homeSections } from "@/content/home";

function RadioWidget() {
  return (
    <section className="radio-widget mono-container" aria-label="POKIT Radio">
      <div className="radio-widget__intro">
        <p className="radio-widget__label">POKIT Radio</p>
        <strong>On Air</strong>
      </div>
      <div className="radio-widget__current">
        <p>The Wellness Desk</p>
        <h2>책상 앞에서 잃어버린 몸의 리듬을 되찾는 방법</h2>
        <span>Listen Live</span>
      </div>
      <div className="radio-widget__schedule">
        <article>
          <p>The Continental Shift</p>
          <span>부드러운 아침 음악과 루틴 뉴스</span>
        </article>
        <article>
          <p>Top of the Hour</p>
          <span>하루를 정돈하는 짧은 헤드라인</span>
        </article>
      </div>
    </section>
  );
}

export default async function Home() {
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
  } = await getHomePageWithCarousels();

  const hasTopStories = affairsHero.length > 0 || affairsRail.length > 0;

  return (
    <>
      <SiteHeader />

      <main>
        <section className="inbox-strip">
          <p>Daily inbox intelligence from POKIT</p>
        </section>

        <RadioWidget />

        {hasTopStories && (
          <section id="affairs" className="top-stories mono-container">
            <SectionHeading
              kicker={homeSections.affairs.kicker}
              title={homeSections.affairs.title}
              viewAllHref={articlesArchiveHref(1, homeSections.affairs.archiveCategory)}
            />
            <div className="top-stories__layout">
              {affairsHero.length > 0 && (
                <div className="top-stories__lead">
                  <FeaturedHeadlineCarousel articles={affairsHero} />
                </div>
              )}
              {affairsRail.length > 0 && (
                <div className="top-stories__rail">
                  <ArticleSectionCarousel
                    articles={affairsRail}
                    variant="compact"
                    layout="rail"
                    ariaLabel={`${homeSections.affairs.nav} 이야기`}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {spotlightCarousel.length > 0 && (
          <section id="spotlight" className="below-fold mono-container">
            <SectionHeading
              kicker={spotlightRowSection?.kicker ?? homeSections.spotlight.kicker}
              title={spotlightRowSection?.title ?? homeSections.spotlight.title}
              viewAllHref={articlesArchiveHref(
                1,
                homeSections.spotlight.archiveCategory,
              )}
            />
            <ArticleSectionCarousel
              articles={spotlightCarousel}
              variant="vertical"
              layout="grid"
              ariaLabel={`${homeSections.spotlight.nav} 이야기`}
            />
          </section>
        )}

        <section id="radio" className="radio-latest mono-container">
          <SectionHeading
            kicker={radioLatestSection?.kicker ?? homeSections.radio.kicker}
            title={radioLatestSection?.title ?? homeSections.radio.title}
            viewAllHref={articlesArchiveHref(1, homeSections.radio.archiveCategory)}
          />
          {radioCarousel.length > 0 ? (
            <ArticleSectionCarousel
              articles={radioCarousel}
              variant="vertical"
              layout="grid"
              ariaLabel={`${homeSections.radio.nav} 이야기`}
            />
          ) : (
            <p className="section-empty">
              Home Page → {homeSections.radio.nav}에서 이야기 3개를 연결해주세요.
            </p>
          )}
        </section>

        {designCarousel.length > 0 && (
          <section id="design" className="editorial-section mono-container">
            <SectionHeading
              kicker={designAwardsSection?.kicker ?? homeSections.design.kicker}
              title={designAwardsSection?.title ?? homeSections.design.title}
              viewAllHref={articlesArchiveHref(1)}
            />
            <ArticleSectionCarousel
              articles={designCarousel}
              variant="vertical"
              layout="grid"
              ariaLabel={`${homeSections.design.nav} 이야기`}
            />
          </section>
        )}

        {cityCarousel.length > 0 && (
          <section id="wellness" className="tinted-section">
            <div className="mono-container">
              <SectionHeading
                kicker={cityGuidesSection?.kicker ?? homeSections.wellness.kicker}
                title={cityGuidesSection?.title ?? homeSections.wellness.title}
                viewAllHref={articlesArchiveHref(1, homeSections.wellness.archiveCategory)}
              />
              <ArticleSectionCarousel
                articles={cityCarousel}
                variant="vertical"
                layout="grid"
                columns={4}
                ariaLabel={`${homeSections.wellness.nav} 이야기`}
              />
            </div>
          </section>
        )}

        <section className="home-archive-cta mono-container">
          <Link href="/articles">모든 이야기 한 번에 보기 →</Link>
        </section>

        <AppDownload />
      </main>

      <SiteFooter />
    </>
  );
}
