import { AppScrollMotion } from "@/components/app-scroll-motion";
import { AppHeroVideo } from "@/components/app-hero-video";
import { getHomeVideoMessages } from "@/i18n/get-home-video-messages";
import { AppDemo } from "@/components/app-demo";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AppStoreBadge } from "@/components/app-store-badge";
import { AppScreenGallery } from "@/components/app-screen-gallery";
import { JsonLd } from "@/components/json-ld";
import { appStoreUrl, site, appName } from "@/config/site";
import { appBoardArt, appBoards, appHeroArt, appScreenArt, appTabletArt } from "@/content/app-features";
import { isLocale, locales } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getAppDownloadMessages } from "@/i18n/get-app-download-messages";
import { getAppPageMessages } from "@/i18n/get-app-page-messages";
import { getCommonMessages } from "@/i18n/get-common-messages";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
import styles from "@/components/app-intro.module.css";

type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = createTranslator(await getAppPageMessages(locale));
  const title = t("POKIT, 나의 하루를, 한 장면씩.");
  const description = t("장면을 고르고, 생각을 적고, 작은 할 일을 챙겨보세요. POKIT에서 평범한 하루가 나만의 이야기가 됩니다.");
  const alternates = localeAlternates(locale, "/app");
  const hero = appHeroArt(locale);
  return {
    title: { absolute: title }, description, alternates,
    openGraph: { title, description, url: alternates.canonical, siteName: appName(locale),
      locale: localeOpenGraph(locale), type: "website", images: [{ url: hero.src, width: hero.width, height: hero.height }] },
    twitter: { card: "summary_large_image", title, description, images: [hero.src] },
  };
}

export default async function AppIntroPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [pageMessages, downloadMessages, commonMessages, videoMessages] = await Promise.all([
    getAppPageMessages(locale), getAppDownloadMessages(locale), getCommonMessages(locale), getHomeVideoMessages(locale),
  ]);
  const t = createTranslator(pageMessages);
  const downloadT = createTranslator(downloadMessages);
  const videoT = createTranslator(videoMessages);
  const commonT = createTranslator(commonMessages);
  const labels = [t("장면"), t("메모"), t("하루"), t("메이트"), t("위젯"), t("홈")];
  const alts = [t("나의 하루를, 한 장면씩."), t("떠오른 생각과 작은 할 일을 함께."), t("흩어진 순간이 나만의 한 페이지로."), t("하루를 챙기는 작은 메이트."), t("앱을 열기 전에도, 오늘이 보여요."), t("기억하고 싶은 순간, 홈 화면 가까이에.")];
  const screens = appScreenArt(locale);
  const description = t("장면을 고르고, 생각을 적고, 작은 할 일을 챙겨보세요. POKIT에서 평범한 하루가 나만의 이야기가 됩니다.");
  const features = [
    { id: "scenes", title: t("오늘을 닮은 장면에,\n내 이야기를 더해요."), description: t("책을 고른 오후, 잠깐의 산책, 커피 한 잔. 하루와 닮은 손그림 장면을 고르고 그때의 생각을 남겨보세요."),
      points: [[t("기억하고 싶은 순간"), t("손그림 장면을 골라 나만의 하루에 담아요.")], [t("생각과 할 일, 한곳에"), t("장면마다 메모를 남기고, 함께 떠오른 할 일도 체크해요.")]], indices: [0, 1] },
    { id: "day", title: t("하루를 펼쳐 보고,\n작은 것부터 챙겨요."), description: t("흩어진 장면은 한 페이지에 모으고, 챙기고 싶은 일은 메이트 카드에 담아보세요."),
      points: [[t("한눈에 보는 나의 하루"), t("남겨둔 장면을 모아 보고, 오늘의 흐름을 돌아봐요.")], [t("일상 곁의 메이트 카드"), t("준비할 것, 독서, 메모와 습관을 카드로 정리해요.")]], indices: [2, 3] },
    { id: "widget", title: t("좋아하는 장면을,\n가장 가까운 화면에."), description: t("앱을 열지 않아도 오늘의 장면을 만날 수 있어요. 홈 화면에 어울리는 크기로 골라보세요."),
      points: [[t("장면과 할 일을 함께"), t("큰 위젯에서 장면과 오늘 할 일을 함께 확인해요.")], [t("작은 공간에도 나의 장면"), t("작은 위젯으로 좋아하는 순간을 가까이 두세요.")]], indices: [4, 5] },
  ];
  return (
    <main id="app-intro-page" className={styles.page}>
      <AppScrollMotion />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: appName(locale),
        applicationCategory: "LifestyleApplication", operatingSystem: "iOS, iPadOS", description,
        url: `${site.siteUrl}/${locale}/app`, image: `${site.siteUrl}/pokit-logo.png`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, downloadUrl: appStoreUrl(locale) }} />
      <section className={styles.hero} aria-labelledby="app-title">
        <div className={styles.heroHeading}>
          <div className={styles.heroBackdrop} aria-hidden="true">
            <Image src={appHeroArt(locale)} alt="" fill preload sizes="(max-width: 1440px) 100vw, 1440px" />
          </div>
          <div className={styles.heroHeadingContent}>
            <p className={styles.eyebrow}>{appName(locale)} <span aria-hidden="true"> / </span> iPhone &amp; iPad</p>
            <h1 id="app-title">{t("나의 하루를, 한 장면씩.")}</h1>
            <p className={styles.heroDescription}>{t("손그림 장면으로 남기는 나만의 이야기")}</p>
            <div className={styles.actions}>
              <AppStoreBadge locale={locale} label={downloadT("App Store에서 받기")} />
              <a className={styles.textLink} href="#try-pokit">{t("직접 체험하기")} <span aria-hidden="true">↘</span></a>
            </div>
          </div>
        </div>
        <AppHeroVideo label={videoT("POKIT 앱 소개 영상")} playLabel={videoT("영상 재생")} pauseLabel={videoT("영상 정지")} />
        <nav className={styles.featureNav} aria-label={t("기능 살펴보기")}>
          {appBoards.map((board, index) => <a key={board.id} href={`#${board.id}`}><span>{board.index}</span>{labels[index]}</a>)}
        </nav>
      </section>
      <section className={styles.intro} data-reveal="text">
        <p className={styles.eyebrow}>{t("나만의 하루를 담는 작은 공간")}</p>
        <h2>{t("기록은 가볍게.\n하루는 나답게.")}</h2>
        <p>{t("거창한 일기가 아니어도 괜찮아요. 오늘 마음에 남은 순간 하나면 충분해요.")}</p>
      </section>
      <AppDemo locale={locale} copy={{
          title: t("오늘의 한 장면을 만들어보세요."),
          intro: t("장면을 고르고, 한 줄을 남기고, 작은 할 일을 체크해보세요."),
          choose: t("장면 고르기"),
          note: t("한 줄 남기기"),
          placeholder: t("오늘 기억하고 싶은 순간은?"),
          task: t("작은 할 일 더하기"),
          taskPlaceholder: t("예: 책 한 장 읽기"),
          add: t("추가"),
          remove: t("삭제"),
          reset: t("다시 시작하기"),
          empty: t("당신의 이야기를 여기에 남겨보세요."),
          complete: t("작은 기록 하나, 작은 완료 하나. 앱에서도 이어갈 습관이에요."),
          cta: t("이런 순간을 매일 모으고 싶다면, POKIT에서 시작해요."),
          notice: t("가입 없는 웹 체험입니다. 새로고침하면 초기화되며, 입력한 내용은 저장되거나 앱으로 옮겨지지 않습니다."),
          scenes: [t("커피 한 잔"), t("잠깐의 산책"), t("서점에서")], download: downloadT("App Store에서 받기"),
      }} />
      {features.map((feature, groupIndex) => (
        <section key={feature.id} id={feature.id} className={`${styles.feature} ${groupIndex === 1 ? styles.reverse : ""} ${groupIndex === 2 ? styles.widgets : ""}`} aria-labelledby={`${feature.id}-title`}>
          <div className={styles.featureInner}>
            <div className={styles.featureCopy}>
              <p data-reveal="text" className={styles.eyebrow}>{String(groupIndex + 1).padStart(2, "0")} <span aria-hidden="true"> / </span> {labels[feature.indices[0]]} &amp; {labels[feature.indices[1]]}</p>
              <h2 data-reveal="text" data-reveal-delay="80" id={`${feature.id}-title`}>{feature.title}</h2>
              <p data-reveal="text" data-reveal-delay="160" className={styles.description}>{feature.description}</p>
              <dl className={styles.points}>
                {feature.points.map(([title, text], index) => <div key={title} data-reveal="text" data-reveal-delay={index * 120}><dt><span aria-hidden="true">0{index + 1}</span>{title}</dt><dd>{text}</dd></div>)}
              </dl>
            </div>
            <div className={styles.screenPair}>
              {feature.indices.map((index, position) => (
                <figure key={index} data-reveal={position === 0 ? "screen-left" : "screen-right"} data-reveal-delay={position * 180} id={position === 1 ? appBoards[index].id : undefined} className={styles.screen}>
                  <div className={styles.screenFrame}><Image src={screens[index]} alt={alts[index]} sizes="(max-width: 760px) 44vw, (max-width: 1200px) 25vw, 280px" /></div>
                  <figcaption><span>{appBoards[index].index}</span> {labels[index]}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section id="screenshots" className={styles.gallerySection} aria-labelledby="screenshots-title">
        <div className={styles.galleryHeading} data-reveal="text">
          <div><p className={styles.eyebrow}>{appName(locale)} / {t("앱 둘러보기")}</p><h2 id="screenshots-title">{t("화면으로 만나보는 POKIT")}</h2></div>
          <p>{t("화면을 옆으로 넘기거나 선택해 크게 볼 수 있어요.")}</p>
        </div>
        <AppScreenGallery phone={appBoardArt(locale)} tablet={appTabletArt(locale)} labels={alts} copy={{ device: t("기기 선택"), previous: t("이전 화면"), next: t("다음 화면"), open: t("화면 크게 보기") }} />
      </section>
      <section className={styles.closing}>
        <p className={styles.eyebrow}>{appName(locale)}</p>
        <h2 data-reveal="text">{t("오늘의 첫 장면을\n남겨볼까요?")}</h2>
        <p>{t("가볍게 시작해요. 나의 하루를, 한 장면씩.")}</p>
        <div className={styles.actions}>
          <AppStoreBadge locale={locale} label={downloadT("App Store에서 받기")} className="border border-white/30" />
          <a className={styles.textLink} href={withLocale(locale, "/support")}>{commonT("앱 지원")} <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </main>
  );
}
