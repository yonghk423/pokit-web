import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/config/site";
import {
  cityGuides,
  designAwards,
  featuredArticle,
  latestRadio,
  leadStories,
  shopItems,
} from "@/content/home";

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

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="inbox-strip">
          <p>Daily inbox intelligence from POKIT</p>
        </section>

        <RadioWidget />

        <section id="affairs" className="top-stories mono-container">
          <div className="top-stories__lead">
            <ArticleCard article={featuredArticle} variant="feature" />
          </div>
          <div className="top-stories__rail">
            {leadStories.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="compact" />
            ))}
          </div>
        </section>

        <section className="below-fold mono-container">
          <div className="below-fold__grid">
            {cityGuides.slice(0, 3).map((article) => (
              <ArticleCard key={article.slug} article={article} variant="vertical" />
            ))}
          </div>
        </section>

        <section className="radio-latest mono-container">
          <SectionHeading title="Latest from POKIT radio" />
          <div className="radio-latest__grid">
            {latestRadio.map((item) => (
              <article key={item.title} className="episode-card">
                <p>{item.show}</p>
                <h3>{item.title}</h3>
                <span>{item.length}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="design" className="editorial-section mono-container">
          <SectionHeading kicker="Design Awards" title="더 나은 하루를 만드는 작은 디자인" />
          <div className="editorial-grid editorial-grid--3">
            {designAwards.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="vertical" />
            ))}
          </div>
        </section>

        <section id="wellness" className="tinted-section">
          <div className="mono-container">
            <SectionHeading kicker="City Guides" title="도시의 리듬으로 배우는 웰니스" />
            <div className="city-grid">
              {cityGuides.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="vertical" />
              ))}
            </div>
          </div>
        </section>

        <section id="shop" className="shop-section mono-container">
          <SectionHeading kicker="From the POKIT shop" title="루틴을 돕는 작은 도구들" />
          <div className="shop-grid">
            {shopItems.map((item) => (
              <article key={item.name} className="product-card">
                <p>{item.brand}</p>
                <h3>{item.name}</h3>
                <span>{item.price}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="app" className="newsletter-block mono-container">
          <div>
            <p>Want more stories like these in your pocket?</p>
            <h2>POKIT 앱에서 루틴을 기록하고, 하루를 정리하세요.</h2>
          </div>
          <a href={site.appStoreUrl}>Download the app</a>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
