import { AppDownload } from "@/components/app-download";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getHomePageContent } from "@/sanity/lib/fetch";

function SectionHeading({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <header className="section-heading">
      {kicker && <p>{kicker}</p>}
      <h2>{title}</h2>
    </header>
  );
}

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
    featuredArticle,
    leadStories,
    spotlightRow,
    spotlightRowSection,
    radioLatestSection,
    radioArticles,
    designAwardsSection,
    designAwards,
    cityGuidesSection,
    cityGuides,
  } = await getHomePageContent();

  const hasTopStories = featuredArticle || leadStories.length > 0;

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
            {featuredArticle && (
              <div className="top-stories__lead">
                <ArticleCard article={featuredArticle} variant="feature" />
              </div>
            )}
            {leadStories.length > 0 && (
              <div className="top-stories__rail">
                {leadStories.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    variant="compact"
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {spotlightRow.length > 0 && (
          <section id="spotlight" className="below-fold mono-container">
            <SectionHeading
              kicker={spotlightRowSection?.kicker}
              title={spotlightRowSection?.title ?? "지금 주목할 이야기"}
            />
            <div className="below-fold__grid">
              {spotlightRow.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  variant="vertical"
                />
              ))}
            </div>
          </section>
        )}

        <section id="radio" className="radio-latest mono-container">
          <SectionHeading
            kicker={radioLatestSection?.kicker}
            title={radioLatestSection?.title ?? "Latest from POKIT radio"}
          />
          {radioArticles.length > 0 ? (
            <div className="radio-latest__grid">
              {radioArticles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  variant="vertical"
                />
              ))}
            </div>
          ) : (
            <p className="section-empty">Home Page → POKIT Radio에서 기사 3개를 연결해주세요.</p>
          )}
        </section>

        {designAwards.length > 0 && (
          <section id="design" className="editorial-section mono-container">
            <SectionHeading
              kicker={designAwardsSection?.kicker}
              title={designAwardsSection?.title ?? "Design Awards"}
            />
            <div className="editorial-grid editorial-grid--3">
              {designAwards.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  variant="vertical"
                />
              ))}
            </div>
          </section>
        )}

        {cityGuides.length > 0 && (
          <section id="wellness" className="tinted-section">
            <div className="mono-container">
              <SectionHeading
                kicker={cityGuidesSection?.kicker}
                title={cityGuidesSection?.title ?? "City Guides"}
              />
              <div className="city-grid">
                {cityGuides.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    variant="vertical"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <AppDownload />
      </main>

      <SiteFooter />
    </>
  );
}
