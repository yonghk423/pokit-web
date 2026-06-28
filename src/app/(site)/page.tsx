import type { Metadata } from "next";
import Link from "next/link";

import { AppDownload } from "@/components/app-download";
import { FeaturedHeadlineCarousel } from "@/components/featured-headline-carousel";
import { ArticleSectionCarousel } from "@/components/article-section-carousel";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/config/site";
import { articlesArchiveHref } from "@/sanity/lib/articles";
import { getHomePageWithCarousels } from "@/sanity/lib/fetch";
import { homeSections } from "@/content/home";
import { cn, monoContainer } from "@/lib/cn";
import { websiteJsonLd } from "@/lib/json-ld";

const HOME_TITLE = `${site.name} — 일상 웰니스 가이드`;
const HOME_DESCRIPTION =
  "일상의 작은 루틴으로 웰니스를 만드는 가이드와 앱. POKIT에서 루틴·웰니스 이야기를 만나보세요.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: site.siteUrl,
    siteName: site.name,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/pokitstory.png",
        alt: site.name,
        width: 512,
        height: 512,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/pokitstory.png"],
  },
};

export const revalidate = false;

function RadioWidget() {
  return (
    <section
      className={cn(
        monoContainer,
        "mt-[1.2rem] grid grid-cols-[0.9fr_1.8fr_1.5fr] gap-4 border border-line bg-green p-4 font-sans text-white max-nav:mt-[0.85rem] max-nav:grid-cols-1 max-nav:p-[0.85rem] max-nav:gap-[0.85rem]",
      )}
      aria-label="POKIT Radio"
    >
      <div className="border-r border-white/25 pr-4 max-nav:border-r-0 max-nav:border-b max-nav:pb-4 max-nav:pr-0">
        <p className="m-0 text-[0.72rem] font-extrabold tracking-[0.1em] text-brand uppercase">
          POKIT Radio
        </p>
        <strong className="mt-1 block text-[1.1rem]">On Air</strong>
      </div>
      <div className="border-r border-white/25 pr-4 max-nav:border-r-0 max-nav:border-b max-nav:pb-4 max-nav:pr-0">
        <p className="m-0 text-[0.72rem] font-extrabold tracking-[0.06em] text-brand-soft uppercase">
          The Wellness Desk
        </p>
        <h2 className="mt-[0.35rem] mb-0 text-[1.05rem] leading-[1.25] max-[640px]:text-[0.98rem]">
          책상 앞에서 잃어버린 몸의 리듬을 되찾는 방법
        </h2>
        <span className="mt-[0.4rem] block text-[0.78rem] text-white/68">
          Listen Live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1 max-[640px]:pr-0">
        <article>
          <p className="m-0 text-[0.72rem] font-extrabold tracking-[0.06em] text-brand-soft uppercase">
            The Continental Shift
          </p>
          <span className="mt-[0.4rem] block text-[0.78rem] text-white/68">
            부드러운 아침 음악과 루틴 뉴스
          </span>
        </article>
        <article>
          <p className="m-0 text-[0.72rem] font-extrabold tracking-[0.06em] text-brand-soft uppercase">
            Top of the Hour
          </p>
          <span className="mt-[0.4rem] block text-[0.78rem] text-white/68">
            하루를 정돈하는 짧은 헤드라인
          </span>
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
      <JsonLd data={websiteJsonLd(HOME_DESCRIPTION)} />
      <main>
        <section className="border-b border-fine-line bg-paper py-[1.1rem] text-center">
          <p className="m-0 font-sans text-[0.78rem] font-bold text-green">
            Daily inbox intelligence from POKIT
          </p>
        </section>

        <RadioWidget />

        {hasTopStories && (
          <section id="affairs" className={cn(monoContainer, "mt-[1.4rem]")}>
            <SectionHeading
              kicker={homeSections.affairs.kicker}
              title={homeSections.affairs.title}
              viewAllHref={articlesArchiveHref(1, homeSections.affairs.archiveCategory)}
            />
            <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(0,0.95fr)] items-start gap-[1.4rem] max-nav:grid-cols-1">
              {affairsHero.length > 0 && (
                <div className="min-w-0 border-r border-line pr-[1.4rem] max-nav:border-r-0 max-nav:pr-0">
                  <FeaturedHeadlineCarousel articles={affairsHero} />
                </div>
              )}
              {affairsRail.length > 0 && (
                <div className="min-w-0">
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
          <section id="spotlight" className={cn(monoContainer, "mt-[2.7rem]")}>
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
              columns={4}
              ariaLabel={`${homeSections.spotlight.nav} 이야기`}
            />
          </section>
        )}

        <section id="radio" className={cn(monoContainer, "mt-[2.7rem]")}>
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
              columns={4}
              ariaLabel={`${homeSections.radio.nav} 이야기`}
            />
          ) : (
            <p className="m-0 border-t border-fine-line py-[1.2rem] font-sans text-[0.9rem] text-muted">
              Home Page → {homeSections.radio.nav}에서 이야기 3개를 연결해주세요.
            </p>
          )}
        </section>

        {designCarousel.length > 0 && (
          <section id="design" className={cn(monoContainer, "mt-[2.7rem]")}>
            <SectionHeading
              kicker={designAwardsSection?.kicker ?? homeSections.design.kicker}
              title={designAwardsSection?.title ?? homeSections.design.title}
              viewAllHref={articlesArchiveHref(1)}
            />
            <ArticleSectionCarousel
              articles={designCarousel}
              variant="vertical"
              layout="grid"
              columns={4}
              ariaLabel={`${homeSections.design.nav} 이야기`}
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

        <section
          className={cn(
            monoContainer,
            "border-t border-fine-line py-8 pb-10 text-center font-sans text-[0.92rem] [&_a]:underline [&_a]:underline-offset-[0.14em] [&_a:hover]:text-green",
          )}
        >
          <Link href="/articles">모든 이야기 한 번에 보기 →</Link>
        </section>

        <AppDownload />
      </main>
    </>
  );
}
