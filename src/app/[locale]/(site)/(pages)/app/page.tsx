import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { notFound } from "next/navigation";

import { AppDownload } from "@/components/app-download";
import { AppScreenImage, PhoneFrame } from "@/components/app-phone-frame";
import { AppScreenGallery } from "@/components/app-screen-gallery";
import { AppStoreBadge } from "@/components/app-store-badge";
import { JsonLd } from "@/components/json-ld";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StationeryScatter } from "@/components/stationery-scatter";
import { appStoreUrl, site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { createTranslator } from "@/i18n/create-translator";
import { getHomeMessages } from "@/i18n/get-home-messages";
import { getAppPageMessages } from "@/i18n/get-app-page-messages";
import { getAppDownloadMessages } from "@/i18n/get-app-download-messages";
import { getAppFeatures, type AppFeatureId } from "@/content/app-features";
import heroArt from "@/assets/app-promo/app-hero.webp";
import { appScreen, type AppScreenFile } from "@/lib/app-screens";
import { cn, monoContainer } from "@/lib/cn";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";

type Props = {
  params: Promise<{ locale: string }>;
};

const OG_IMAGE = {
  url: "/pokit-logo.png",
  width: 512,
  height: 512,
} as const;

type FeatureVisual = {
  primary: AppScreenFile;
  secondary?: AppScreenFile;
  /** Full device screenshot already includes iOS chrome; skip PhoneFrame. */
  frame?: "phone" | "homescreen";
};

function localizeVisual(
  locale: Locale,
  visual: FeatureVisual,
): {
  primary: StaticImageData;
  secondary?: StaticImageData;
  frame: "phone" | "homescreen";
} {
  return {
    primary: appScreen(locale, visual.primary),
    secondary: visual.secondary
      ? appScreen(locale, visual.secondary)
      : undefined,
    frame: visual.frame ?? "phone",
  };
}

const FEATURE_VISUALS: Record<AppFeatureId, FeatureVisual> = {
  routines: { primary: "routines.webp", secondary: "first-launch.webp" },
  puzzle: { primary: "puzzle.webp", frame: "homescreen" },
  memo: {
    primary: "daily-memo-lock.webp",
    secondary: "daily-memo-editor.webp",
    frame: "homescreen",
  },
  widgets: { primary: "home-widgets.webp", frame: "homescreen" },
  notes: { primary: "today-note.webp", frame: "homescreen" },
  todos: { primary: "todos.webp" },
  history: { primary: "history.webp" },
  library: { primary: "library.webp" },
};

const GALLERY = [
  { file: "first-launch.webp" as const, featureId: "routines" },
  { file: "routines.webp" as const, featureId: "routines" },
  { file: "puzzle.webp" as const, featureId: "puzzle" },
  { file: "memo-editor.webp" as const, featureId: "memo" },
  { file: "lock-screen-memo.webp" as const, featureId: "memo" },
  { file: "todos.webp" as const, featureId: "todos" },
  { file: "today-note.webp" as const, featureId: "notes" },
  { file: "history.webp" as const, featureId: "history" },
  { file: "library.webp" as const, featureId: "library" },
] as const;

const FEATURE_TONES = [
  "bg-[#f3efe6]",
  "bg-[#ebe4d6]",
  "bg-[#f0ebe3]",
  "bg-[#e7efe9]",
  "bg-[#f3efe6]",
  "bg-[#ebe4d6]",
  "bg-[#f0ebe3]",
  "bg-[#e7efe9]",
] as const;

const PUZZLE_BACKGROUNDS = [
  "/스크린샷 2026-10-11 오후 6.58.42.png",
  "/스크린샷 2026-10-11 오후 6.58.15.png",
  "/스크린샷 2026-10-11 오후 6.57.55.png",
] as const;

const FEATURE_TEXT_GLOWS = [
  "#f3efe6",
  "#ebe4d6",
  "#f0ebe3",
  "#e7efe9",
  "#f3efe6",
  "#ebe4d6",
  "#f0ebe3",
  "#e7efe9",
] as const;

function FeatureVisualCluster({
  visual,
  alt,
  secondaryAlt,
  secondaryFirst = false,
  priority = false,
  align = "center",
  className,
}: {
  visual: {
    primary: StaticImageData;
    secondary?: StaticImageData;
    frame: "phone" | "homescreen";
  };
  alt: string;
  secondaryAlt?: string;
  secondaryFirst?: boolean;
  priority?: boolean;
  align?: "start" | "end" | "center";
  className?: string;
}) {
  const alignClass =
    align === "start"
      ? "mr-auto justify-start"
      : align === "end"
        ? "ml-auto justify-end"
        : "mx-auto justify-center";

  if (visual.frame === "homescreen") {
    const deviceClass = cn(
      "overflow-hidden rounded-[2.05rem] bg-black shadow-[0_28px_56px_-20px_rgba(24,26,46,0.38)] ring-1 ring-black/8",
      "min-w-0",
    );

    if (!visual.secondary) {
      return (
        <div
          className={cn(
            deviceClass,
            "w-[13.5rem] nav:w-[18rem]",
            alignClass,
            className,
          )}
        >
          <AppScreenImage
            src={visual.primary}
            alt={alt}
            sizes="(max-width: 640px) 55vw, 288px"
            priority={priority}
            eager={priority}
          />
        </div>
      );
    }

    const left = secondaryFirst
      ? { src: visual.secondary, alt: secondaryAlt ?? alt }
      : { src: visual.primary, alt };
    const right = secondaryFirst
      ? { src: visual.primary, alt }
      : { src: visual.secondary, alt: secondaryAlt ?? alt };

    return (
      <div
        className={cn(
          "flex w-full max-w-lg items-center gap-3 nav:w-[36rem] nav:max-w-none",
          alignClass,
          className,
        )}
      >
        <div className={cn(deviceClass, "flex-1")}>
          <AppScreenImage
            src={left.src}
            alt={left.alt}
            sizes="(max-width: 640px) 42vw, 260px"
            priority={priority}
            eager={priority}
          />
        </div>
        <div className={cn(deviceClass, "flex-1")}>
          <AppScreenImage
            src={right.src}
            alt={right.alt}
            sizes="(max-width: 640px) 42vw, 260px"
            priority={priority}
            eager={priority}
          />
        </div>
      </div>
    );
  }

  if (!visual.secondary) {
    return (
      <PhoneFrame
        src={visual.primary}
        alt={alt}
        elevated
        finish="soft"
        priority={priority}
        eager={priority}
        className={cn(
          "w-60 nav:w-80",
          alignClass,
          className,
        )}
      />
    );
  }

  const left = secondaryFirst
    ? { src: visual.secondary, alt: secondaryAlt ?? alt, elevated: false }
    : { src: visual.primary, alt, elevated: true };
  const right = secondaryFirst
    ? { src: visual.primary, alt, elevated: true }
    : { src: visual.secondary, alt: secondaryAlt ?? alt, elevated: false };

  return (
    <div
      className={cn(
        "flex w-full max-w-lg items-center gap-3 nav:w-[36rem] nav:max-w-none nav:gap-3",
        alignClass,
        className,
      )}
    >
      <PhoneFrame
        src={left.src}
        alt={left.alt}
        elevated={left.elevated}
        finish="soft"
        priority={priority}
        eager={priority}
        className="min-w-0 flex-1"
      />
      <PhoneFrame
        src={right.src}
        alt={right.alt}
        elevated={right.elevated}
        finish="soft"
        priority={priority}
        eager={priority}
        className="min-w-0 flex-1"
      />
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const t = createTranslator(await getAppPageMessages(rawLocale));
  const alternates = localeAlternates(rawLocale, "/app");

  const title = t("POKIT - 투두 시간 관리 루틴");
  const description = t("하루의 시작과 끝을 정하고, 루틴·할 일·메모·기록을 한곳에서. POKIT 앱으로 일상을 가볍게 가꿔 보세요.");

  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function AppIntroPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const [dict, pageMessages, downloadMessages, homeMessages] = await Promise.all([
    getDictionary(locale),
    getAppPageMessages(locale),
    getAppDownloadMessages(locale),
    getHomeMessages(locale),
  ]);
  const t = createTranslator(pageMessages);
  const homeT = createTranslator(homeMessages);
  const downloadT = createTranslator(downloadMessages);
  const features = getAppFeatures(t);
  const storeUrl = appStoreUrl(locale);
  const featureById = Object.fromEntries(
    features.map((feature) => [feature.id, feature]),
  );
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS",
    description: t("하루의 시작과 끝을 정하고, 루틴·할 일·메모·기록을 한곳에서. POKIT 앱으로 일상을 가볍게 가꿔 보세요."),
    url: `${site.siteUrl}/${locale}/app`,
    image: `${site.siteUrl}/pokit-logo.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    downloadUrl: storeUrl,
  };

  return (
    <main className="overflow-x-clip">
      <JsonLd data={softwareJsonLd} />

      <section className="relative isolate overflow-hidden bg-[#ebe4d6] text-ink nav:h-[calc(100svh-5rem)]">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden nav:flex nav:items-center nav:justify-end nav:pr-[clamp(1rem,1.8vw,1.5rem)]"
          aria-hidden="true"
        >
          <Image
            src={heroArt}
            alt=""
            priority
            unoptimized
            placeholder="blur"
            sizes="(min-width: 900px) 92vw, 100vw"
            className="app-hero-phone h-[min(68vh,calc((100vw-4rem)/2.55))] w-auto max-w-none"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[min(32rem,42%)] bg-linear-to-r from-[#ebe4d6] from-40% via-[#ebe4d6]/80 to-transparent nav:block"
          aria-hidden="true"
        />

        <div
          className={cn(
            monoContainer,
            "relative z-10 flex flex-col py-12 max-nav:gap-10 nav:h-full nav:flex-row nav:items-center nav:py-20",
          )}
        >
          <div className="w-full max-w-[34rem] shrink-0 nav:-translate-y-14">
            <h1 className="app-hero-rise app-hero-rise-1 m-0 font-sans text-[clamp(2.4rem,9vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.04em]">
              {site.name}
            </h1>
            <p className="app-hero-rise app-hero-rise-2 mt-4 mb-0 font-serif text-[clamp(1.35rem,4.5vw,2.35rem)] font-normal italic leading-[1.25] tracking-[-0.02em] text-ink/90 nav:mt-5">
              {t("하루를 담는 포켓, POKIT")}
            </p>
            <p className="app-hero-rise app-hero-rise-3 mt-5 mb-0 max-w-[30rem] whitespace-pre-line font-sans text-[0.98rem] font-normal leading-[1.7] tracking-[-0.01em] text-ink/65 nav:mt-7 nav:text-[1.05rem]">
              {t("오늘 필요한 것들을, 하나의 포켓에. 루틴부터 할 일, 메모와 기록까지. 매일 필요한 작은 것들을 POKIT에 담아두세요.")}
            </p>

            <div className="app-hero-rise app-hero-rise-4 mt-8 flex flex-col items-start gap-3 nav:mt-10 nav:flex-row nav:flex-wrap nav:items-center nav:gap-5">
              <AppStoreBadge locale={locale} label={downloadT("App Store에서 받기")} />
              <span className="font-sans text-[0.88rem] font-normal tracking-[-0.01em] text-ink/55 nav:text-[0.92rem]">
                {t("루틴도 메모도 할 일도, 여기 한곳에")}
              </span>
            </div>
          </div>

          <div className="app-hero-phone relative mx-auto w-full max-w-[28rem] nav:hidden">
            <Image
              src={heroArt}
              alt={t("하루 루틴을 POKIT 앱으로 챙기는 일러스트")}
              sizes="92vw"
              priority
              unoptimized
              placeholder="blur"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section aria-label={t("앱을 열면, 이렇게 쓰게 될 거예요")}>
        {features.map((feature, index) => {
          const visual = FEATURE_VISUALS[feature.id];
          if (!visual) return null;
          const reverse = index % 2 === 1;
          const tone = FEATURE_TONES[index % FEATURE_TONES.length];
          const textGlow =
            FEATURE_TEXT_GLOWS[index % FEATURE_TEXT_GLOWS.length];
          const dualPhones = Boolean(visual.secondary);

          return (
            <article
              key={feature.id}
              className={cn("relative overflow-hidden", tone)}
            >
              {feature.id === "puzzle" ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 z-0 grid h-[34rem] grid-cols-3 gap-2 p-3 nav:inset-y-4 nav:right-3 nav:left-auto nav:h-auto nav:w-[min(82%,76rem)]"
                >
                  {PUZZLE_BACKGROUNDS.map((src) => (
                    <div
                      key={src}
                      className="relative min-h-48 overflow-hidden rounded-[1.15rem] nav:min-h-0"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(min-width: 900px) 16vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              <StationeryScatter
                variant={index}
                fillSide={reverse ? "left" : "right"}
              />
              <div
                className={cn(
                  monoContainer,
                  "relative z-10 py-16 nav:py-20",
                )}
              >
                <div
                  className={cn(
                    "mx-auto flex w-fit max-w-full flex-col items-center gap-6",
                    "nav:flex-row nav:items-start",
                    dualPhones ? "nav:gap-x-12" : "nav:gap-x-32",
                    reverse && "nav:flex-row-reverse",
                  )}
                >
                  <ScrollReveal className="relative z-10 w-full max-w-[36rem] nav:w-[36rem] nav:shrink-0 nav:pt-6">
                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -inset-x-4 -inset-y-3 -z-10 rounded-[1.75rem]",
                        feature.id === "puzzle" ? "bg-[#ebe4d6]/82" : tone,
                      )}
                      style={
                        feature.id === "puzzle"
                          ? undefined
                          : { boxShadow: `0 0 52px 40px ${textGlow}` }
                      }
                    />
                    <p className="m-0 font-sans text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-ink">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 mb-0 font-serif text-[clamp(1.85rem,3.6vw,2.55rem)] font-normal italic leading-[1.22] tracking-[-0.02em] text-ink">
                      {feature.title}
                    </h3>
                    <p className="mt-6 mb-0 whitespace-pre-line font-sans text-[clamp(1.05rem,1.7vw,1.18rem)] font-normal leading-[1.85] tracking-[-0.01em] text-ink/78">
                      {feature.body}
                    </p>
                  </ScrollReveal>
                  <ScrollReveal
                    delay={140}
                    className={cn(
                      "shrink-0",
                      index === 0 ? "nav:mt-8" : undefined,
                    )}
                  >
                    <FeatureVisualCluster
                      visual={localizeVisual(locale, visual)}
                      alt={feature.imageAlt}
                      priority={index === 0}
                      align="center"
                      secondaryFirst={
                        feature.id === "routines" || feature.id === "memo"
                      }
                      secondaryAlt={
                        feature.id === "memo"
                          ? t("잠금화면에 남길 하루 메모를 적는 화면")
                          : feature.id === "routines"
                            ? t("POKIT 앱을 처음 열었을 때 하루 일과를 정하는 화면")
                            : undefined
                      }
                    />
                  </ScrollReveal>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="bg-white py-20 nav:py-24" aria-labelledby="app-gallery">
        <ScrollReveal className={monoContainer}>
          <p className="m-0 text-center font-sans text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-green">
            {t("화면부터 볼까요")}
          </p>
          <h2
            id="app-gallery"
            className="mx-auto mt-4 mb-0 max-w-3xl text-center font-serif text-[clamp(1.7rem,3.4vw,2.45rem)] font-normal italic leading-[1.25] tracking-[-0.02em] text-ink"
          >
            {t("필요한 순간에, 필요한 화면을.")}
          </h2>
          <p className="mx-auto mt-5 mb-2 max-w-2xl text-center whitespace-pre-line font-sans text-[1.05rem] font-normal leading-[1.7] tracking-[-0.01em] text-muted">
            {t("오늘의 루틴부터 메모와 기록까지. POKIT의 하루를 직접 만나보세요.")}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <AppScreenGallery
            finish="soft"
            items={GALLERY.map((item) => {
              const feature = featureById[item.featureId];
              return {
                src: appScreen(locale, item.file),
                title: feature?.title ?? t("화면부터 볼까요"),
                alt: feature?.imageAlt ?? t("화면부터 볼까요"),
              };
            })}
            prevAria={homeT("{{label}} 이전", { label: t("화면부터 볼까요") })}
            nextAria={homeT("{{label}} 다음", { label: t("화면부터 볼까요") })}
          />
        </ScrollReveal>
      </section>

      <div>
        <AppDownload
          locale={locale}
          size="large"
          variant="editorial"
          resourceLinks={[
            { href: withLocale(locale, "/support"), label: dict.footer.support },
          ]}
          messages={downloadMessages}
        />
      </div>
    </main>
  );
}
