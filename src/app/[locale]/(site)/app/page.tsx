import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { notFound } from "next/navigation";

import { AppDownload } from "@/components/app-download";
import { PhoneFrame } from "@/components/app-phone-frame";
import { AppScreenGallery } from "@/components/app-screen-gallery";
import { AppStoreBadge } from "@/components/app-store-badge";
import { JsonLd } from "@/components/json-ld";
import { appStoreUrl, site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { appScreen, type AppScreenFile } from "@/lib/app-screens";
import { cn, monoContainer, sectionSpacing } from "@/lib/cn";
import { localeAlternates, localeOpenGraph } from "@/lib/locale-path";

type Props = {
  params: Promise<{ locale: string }>;
};

const OG_IMAGE = {
  url: "/pokit5.png",
  width: 512,
  height: 512,
} as const;

type FeatureVisual = {
  primary: AppScreenFile;
  secondary?: AppScreenFile;
};

function localizeVisual(
  locale: Locale,
  visual: FeatureVisual,
): { primary: StaticImageData; secondary?: StaticImageData } {
  return {
    primary: appScreen(locale, visual.primary),
    secondary: visual.secondary
      ? appScreen(locale, visual.secondary)
      : undefined,
  };
}

const FEATURE_VISUALS: Record<string, FeatureVisual> = {
  routines: { primary: "routines.webp", secondary: "first-launch.webp" },
  memo: { primary: "lock-screen-memo.webp", secondary: "memo-editor.webp" },
  notes: { primary: "today-note.webp" },
  todos: { primary: "todos.webp" },
  history: { primary: "history.webp" },
  library: { primary: "library.webp" },
};

const HERO_PHONES = [
  {
    file: "todos.webp" as const,
    featureId: "todos",
    offset: "translate-y-6 nav:translate-y-10",
    frameClassName: "max-w-[10rem] -rotate-6 nav:max-w-[13rem]",
  },
  {
    file: "routines.webp" as const,
    featureId: "routines",
    offset: "z-20",
    frameClassName: "max-w-[11.5rem] nav:max-w-64",
  },
  {
    file: "history.webp" as const,
    featureId: "history",
    offset: "translate-y-8 nav:translate-y-12",
    frameClassName: "max-w-[10rem] rotate-6 nav:max-w-[13rem]",
  },
] as const;

const GALLERY = [
  { file: "first-launch.webp" as const, featureId: "routines" },
  { file: "routines.webp" as const, featureId: "routines" },
  { file: "memo-editor.webp" as const, featureId: "memo" },
  { file: "lock-screen-memo.webp" as const, featureId: "memo" },
  { file: "todos.webp" as const, featureId: "todos" },
  { file: "today-note.webp" as const, featureId: "notes" },
  { file: "history.webp" as const, featureId: "history" },
  { file: "library.webp" as const, featureId: "library" },
] as const;

const FEATURE_TONES = [
  "bg-indigo text-white",
  "bg-panel",
  "bg-pink-soft",
  "bg-beige",
  "bg-green-soft",
  "bg-brand-soft",
] as const;

function FeatureVisualCluster({
  visual,
  alt,
  secondaryAlt,
  secondaryFirst = false,
  priority = false,
}: {
  visual: { primary: StaticImageData; secondary?: StaticImageData };
  alt: string;
  secondaryAlt?: string;
  secondaryFirst?: boolean;
  priority?: boolean;
}) {
  if (!visual.secondary) {
    return (
      <PhoneFrame
        src={visual.primary}
        alt={alt}
        elevated
        priority={priority}
        eager={priority}
        className="mx-auto w-full max-w-52 nav:max-w-64"
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
    <div className="mx-auto flex w-full max-w-md items-end justify-center gap-1 nav:max-w-lg nav:gap-2">
      <PhoneFrame
        src={left.src}
        alt={left.alt}
        elevated={left.elevated}
        priority={priority}
        eager={priority}
        className="w-[48%] -rotate-2"
      />
      <PhoneFrame
        src={right.src}
        alt={right.alt}
        elevated={right.elevated}
        priority={priority}
        eager={priority}
        className="w-[48%] rotate-2"
      />
    </div>
  );
}

function HeroPhoneCluster({
  locale,
  copy,
  featureById,
}: {
  locale: Locale;
  copy: { title: string };
  featureById: Record<string, { imageAlt: string } | undefined>;
}) {
  return (
    <div className="relative mx-auto w-full max-w-md nav:max-w-xl">
      <div className="relative px-2 pb-2 pt-6 nav:px-4 nav:pt-8">
        <div className="relative grid grid-cols-3 items-end gap-2 nav:gap-4">
          {HERO_PHONES.map((phone) => {
            const feature = featureById[phone.featureId];
            const src = appScreen(locale, phone.file);
            return (
              <div
                key={phone.file}
                className={cn("flex justify-center", phone.offset)}
              >
                <PhoneFrame
                  src={src}
                  alt={feature?.imageAlt ?? copy.title}
                  priority
                  eager
                  elevated={phone.file === "routines.webp"}
                  className={cn("w-full", phone.frameClassName)}
                />
              </div>
            );
          })}
        </div>
      </div>
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

  const dict = await getDictionary(rawLocale);
  const alternates = localeAlternates(rawLocale, "/app");

  return {
    title: dict.appPage.metaTitle,
    description: dict.appPage.metaDescription,
    alternates,
    openGraph: {
      title: dict.appPage.metaTitle,
      description: dict.appPage.metaDescription,
      url: alternates.canonical,
      siteName: site.name,
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title: dict.appPage.metaTitle,
      description: dict.appPage.metaDescription,
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
  const dict = await getDictionary(locale);
  const copy = dict.appPage;
  const storeUrl = appStoreUrl(locale);
  const featureById = Object.fromEntries(
    copy.features.map((feature) => [feature.id, feature]),
  );
  const trustLine =
    locale === "ko"
      ? "루틴도 메모도 할 일도, 여기 한곳에"
      : locale === "ja"
        ? "ルーチンもメモもやることも、ここひとつに"
        : "Routines, notes, and tasks, all in one place";

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS",
    description: copy.metaDescription,
    url: `${site.siteUrl}/${locale}/app`,
    image: `${site.siteUrl}/pokit5.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    downloadUrl: storeUrl,
  };

  const heroSrcs = HERO_PHONES.map((phone) => appScreen(locale, phone.file).src);

  return (
    <main className="overflow-x-clip">
      {heroSrcs.map((href) => (
        <link
          key={href}
          rel="preload"
          as="image"
          href={href}
          type="image/webp"
          fetchPriority="high"
        />
      ))}
      <JsonLd data={softwareJsonLd} />

      <section className="relative isolate border-b-2 border-black bg-indigo text-white">
        <div className="pointer-events-none absolute -top-28 left-1/2 h-56 w-56 translate-x-[-130%] rounded-full bg-brand/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 top-10 h-64 w-64 rounded-full bg-tertiary-light/40 blur-3xl" />
        <div
          className={cn(
            monoContainer,
            "relative grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center gap-12 py-18 max-nav:grid-cols-1 max-nav:gap-12 max-nav:py-12",
          )}
        >
          <div className="relative z-10">
            <h1 className="m-0 text-[clamp(2.3rem,5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">
              {site.name}
            </h1>
            <p className="mt-3 mb-0 text-[clamp(1.3rem,2.8vw,1.95rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-brand-soft">
              {copy.title}
            </p>
            <p className="mt-6 mb-0 max-w-2xl text-[1.06rem] leading-relaxed text-white/90">
              {copy.lead}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AppStoreBadge locale={locale} label={copy.download} />
              <span className="inline-flex min-h-12 items-center border-2 border-white/70 bg-white/10 px-4 text-[0.78rem] font-bold tracking-wider text-white uppercase">
                {trustLine}
              </span>
            </div>
          </div>

          <HeroPhoneCluster
            locale={locale}
            copy={copy}
            featureById={featureById}
          />
        </div>
      </section>

      <section className={cn(monoContainer, sectionSpacing)} aria-label={copy.featuresHeading}>
        <div className="grid gap-7">
          {copy.features.map((feature, index) => {
            const visual = FEATURE_VISUALS[feature.id];
            if (!visual) return null;
            const reverse = index % 2 === 1;
            const tone = FEATURE_TONES[index % FEATURE_TONES.length];

            return (
              <article
                key={feature.id}
                className={cn(
                  "relative overflow-hidden border-2 border-black p-6 brutal-shadow transition-transform duration-150 hover:-translate-y-0.5 nav:p-8",
                  tone,
                )}
              >
                <div
                  className={cn(
                    "relative z-10 flex flex-col items-center gap-8 nav:grid nav:grid-cols-2 nav:items-center nav:gap-12",
                    reverse && "nav:[&>div:first-child]:order-2",
                  )}
                >
                  <div>
                    <p className="m-0 text-[0.72rem] font-extrabold tracking-wider uppercase opacity-75">
                      0{index + 1}
                    </p>
                    <h3 className="mt-2 mb-0 text-[clamp(1.28rem,2.4vw,1.74rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
                      {feature.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-4 mb-0 max-w-md text-[1.02rem] leading-relaxed",
                        tone === "bg-indigo text-white" ? "text-white/90" : "text-muted",
                      )}
                    >
                      {feature.body}
                    </p>
                  </div>
                  <FeatureVisualCluster
                    visual={localizeVisual(locale, visual)}
                    alt={feature.imageAlt}
                    priority={index === 0}
                    secondaryFirst={
                      feature.id === "routines" || feature.id === "memo"
                    }
                    secondaryAlt={
                      feature.id === "memo"
                        ? locale === "ko"
                          ? "POKIT 앱에서 하루 메모를 적는 화면"
                          : locale === "ja"
                            ? "POKITアプリで一日のメモを書く画面"
                            : "POKIT app screen for writing the daily memo"
                        : feature.id === "routines"
                          ? locale === "ko"
                            ? "POKIT 앱을 처음 열었을 때 하루 일과를 정하는 화면"
                            : locale === "ja"
                              ? "POKITアプリを初めて開いたときの一日の時間設定画面"
                              : "POKIT first-launch screen for setting your daily span"
                          : undefined
                    }
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={cn(monoContainer, sectionSpacing, "pb-4")} aria-labelledby="app-gallery">
        <p className="m-0 label-caps text-muted">{copy.galleryHeading}</p>
        <h2
          id="app-gallery"
          className="mt-3 mb-2 text-[clamp(1.4rem,2.8vw,2rem)] font-extrabold leading-[1.15] tracking-[-0.03em]"
        >
          {copy.galleryLead}
        </h2>
        <AppScreenGallery
          items={GALLERY.map((item) => {
            const feature = featureById[item.featureId];
            return {
              src: appScreen(locale, item.file),
              title: feature?.title ?? copy.galleryHeading,
              alt: feature?.imageAlt ?? copy.galleryHeading,
            };
          })}
          prevAria={dict.home.carouselPrev(copy.galleryHeading)}
          nextAria={dict.home.carouselNext(copy.galleryHeading)}
        />
      </section>

      <div className={cn(monoContainer, "pb-16")}>
        <AppDownload
          locale={locale}
          copy={{
            ...dict.appDownload,
            kicker: copy.ctaKicker,
            title: copy.ctaTitle,
            download: copy.download,
          }}
        />
      </div>
    </main>
  );
}
