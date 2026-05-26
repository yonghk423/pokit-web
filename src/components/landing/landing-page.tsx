import Link from "next/link";
import {
  faq,
  featureGroupLabels,
  features,
  hero,
  horizons,
  lockScreenMemo,
  nav,
  problems,
  site,
  solutions,
  steps,
  trust,
} from "@/content/landing";

function storeHref(campaign: string) {
  const url = new URL(site.appStoreUrl);
  url.searchParams.set("utm_source", "website");
  url.searchParams.set("utm_medium", "cta");
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

export function LandingPage() {
  return (
    <div className="landing">
      <header className="header">
        <Link href="/" className="logo">
          {site.name}
        </Link>
        <nav className="nav" aria-label="주요 메뉴">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-primary header-cta" href={storeHref("header")}>
          App Store 받기
        </a>
      </header>

      <main>
        {/* Hero */}
        <section id="hero" className="hero section">
          <div className="hero-copy">
            <p className="eyebrow">{hero.brandLine}</p>
            <h1>{hero.headline}</h1>
            <p className="lead">{hero.subheadline}</p>
            <ul className="badges" aria-label="앱 특징">
              {hero.badges.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="hero-actions">
              <a className="btn btn-primary" href={storeHref("hero")}>
                App Store에서 받기
              </a>
              <a className="btn btn-ghost" href="#features">
                스크린샷으로 더 보기
              </a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden>
            <div className="phones">
              <div className="phone phone-back">
                <div className="phone-screen lock-preview">
                  <span className="screen-label">잠금화면</span>
                  <span className="lock-time">09:41</span>
                  <div className="lock-memo-input">
                    빠른 메모…
                  </div>
                  <p className="lock-hint">떠오른 할 일 바로 적기</p>
                </div>
              </div>
              <div className="phone phone-front">
                <div className="phone-screen today-preview">
                  <div className="horizon-tabs">
                    <span className="active">데일리</span>
                    <span>위클리</span>
                    <span>먼슬리</span>
                  </div>
                  <span className="focus-window">데일리 루틴 · 09:00 – 22:00</span>
                  <ol>
                    <li className="flow active">
                      <span>1</span> 아침 루틴 <em>루틴</em>
                    </li>
                    <li className="flow">
                      <span>2</span> 독서 <em>30분</em>
                    </li>
                    <li className="flow">
                      <span>3</span> 운동 <em>45분</em>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            <p className="visual-note">실제 앱 스크린샷으로 교체 예정</p>
          </div>
        </section>

        {/* Problem → Solution */}
        <section id="problem-solution" className="section section-alt">
          <div className="section-head">
            <h2>할 일 앱이 아니라, 우선순위·집중 도구</h2>
            <p className="section-lead">
              POKIT은 시간표를 채우는 앱이 아니라, 오늘의 순서를 정하고 한
              플로우에만 집중하게 돕는 iOS 앱이에요.
            </p>
          </div>
          <div className="two-col">
            <div className="card card-problem">
              <h3>이런 고민, 있으시죠</h3>
              <ul>
                {problems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="card card-solution">
              <h3>POKIT이 돕는 방식</h3>
              <ul>
                {solutions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Daily · Weekly · Monthly */}
        <section id="horizons" className="section">
          <div className="section-head">
            <h2>데일리 · 위클리 · 먼슬리</h2>
            <p className="section-lead">
              오늘 실행부터 이번 주·이번 달 계획까지, 주기별로 나눠 관리해요.
              완료한 주·월 투두는 히스토리에 남습니다.
            </p>
          </div>
          <div className="horizon-grid">
            {horizons.map((h) => (
              <article key={h.id} className="card horizon-card">
                <span className="horizon-label">{h.label}</span>
                <h3>{h.title}</h3>
                <p>{h.description}</p>
                <ul className="horizon-highlights">
                  {h.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <article className="card lock-memo-card">
            <div className="lock-memo-copy">
              <h3>{lockScreenMemo.title}</h3>
              <p>{lockScreenMemo.description}</p>
              <p className="lock-memo-note">{lockScreenMemo.note}</p>
            </div>
          </article>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="section section-alt">
          <div className="section-head">
            <h2>사용 방법</h2>
            <p className="section-lead">
              데일리·위클리·먼슬리를 세우고, 메모하고, 집중하고, 히스토리로
              돌아봐요.
            </p>
          </div>
          <ol className="steps">
            {steps.map((step, i) => (
              <li key={step.title} className="step card">
                <span className="step-num">{i + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="section-cta">
            <a className="btn btn-primary" href={storeHref("how-it-works")}>
              App Store에서 받기
            </a>
          </p>
        </section>

        {/* Features */}
        <section id="features" className="section">
          <div className="section-head">
            <h2>기능</h2>
            <p className="section-lead">
              데일리 루틴 · 위클리·먼슬리 투두·전략 · 히스토리 · 잠금화면
              빠른 메모 · 집중 세션
            </p>
          </div>
          <div className="feature-grid">
            {features.map((f) => (
              <article key={f.title} className="card feature-card">
                <span className="feature-tag">
                  {featureGroupLabels[f.group] ?? f.group}
                </span>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Privacy / Trust */}
        <section id="privacy" className="section section-alt">
          <div className="section-head">
            <h2>데이터는 iPhone 안에만</h2>
            <p className="section-lead">
              서버 없이, 계정 없이. 개인 일과는 기기 로컬에만 남아요.
            </p>
          </div>
          <div className="trust-grid">
            {trust.map((item) => (
              <article key={item.title} className="card trust-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <p className="fine-print">
            이 웹사이트 방문·문의에 대한 처리는{" "}
            <Link href="/privacy">개인정보 처리방침</Link>을 참고해 주세요.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="section section-alt">
          <div className="section-head">
            <h2>자주 묻는 질문</h2>
          </div>
          <div className="faq-list">
            {faq.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Download */}
        <section id="download" className="section download">
          <div className="download-card card">
            <h2>오늘의 첫 번째만 보면 돼요</h2>
            <p className="section-lead">
              POKIT이 나머지 순서는 기억합니다. iPhone에서 시작해 보세요.
            </p>
            <a className="btn btn-primary btn-lg" href={storeHref("download")}>
              App Store에서 받기
            </a>
            <p className="ios-note">
              iPhone에서만 이용할 수 있어요 · {site.minIos}
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-brand">{site.name}</p>
          <p className="footer-tag">
            데일리·위클리·먼슬리로 계획하는 iOS 집중 앱
          </p>
          <nav className="footer-nav" aria-label="푸터">
            <Link href="/privacy">개인정보 처리방침</Link>
            <Link href="/support">지원</Link>
            <a href={storeHref("footer")}>App Store</a>
          </nav>
          <p className="copyright">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </footer>

      <a
        className="sticky-cta btn btn-primary"
        href={storeHref("sticky")}
        aria-label="App Store에서 POKIT 받기"
      >
        App Store 받기
      </a>
    </div>
  );
}
