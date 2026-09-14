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
import { cn, monoContainer } from "@/lib/cn";
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

const HERO = [
  { file: "first-launch.webp" as const, featureId: "routines" },
  { file: "todos.webp" as const, featureId: "todos" },
  { file: "history.webp" as const, featureId: "history" },
  { file: "today-note.webp" as const, featureId: "notes" },
  { file: "routines.webp" as const, featureId: "routines" },
  { file: "library.webp" as const, featureId: "library" },
  { file: "memo-editor.webp" as const, featureId: "memo" },
  { file: "lock-screen-memo.webp" as const, featureId: "memo" },
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
  "bg-[#f3f0e8]",
  "bg-white",
  "bg-[#eef3f1]",
  "bg-white",
  "bg-[#f3f0e8]",
  "bg-[#eef3f1]",
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
        finish="soft"
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
        finish="soft"
        priority={priority}
        eager={priority}
        className="w-[48%] -rotate-1"
      />
      <PhoneFrame
        src={right.src}
        alt={right.alt}
        elevated={right.elevated}
        finish="soft"
        priority={priority}
        eager={priority}
        className="w-[48%] rotate-1"
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

  const heroSrcs = HERO.map((phone) => appScreen(locale, phone.file).src);

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

      <section className="relative isolate h-[calc(100svh-5rem)] overflow-hidden bg-indigo text-white">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 w-[58%] min-w-[28rem] origin-center -translate-x-[6%] -translate-y-1/2 rotate-[30deg]">
            <div className="grid grid-cols-4 gap-6">
              {HERO.map((phone, index) => {
                const feature = featureById[phone.featureId];
                const leftEdge = index === 0 || index === 4;
                return (
                  <div
                    key={phone.file}
                    className="app-hero-phone w-full"
                    style={{ animationDelay: `${180 + index * 70}ms` }}
                  >
                    <div className={leftEdge ? "translate-y-16 nav:translate-y-24" : undefined}>
                      <PhoneFrame
                        src={appScreen(locale, phone.file)}
                        alt={feature?.imageAlt ?? copy.title}
                        priority={index < 2}
                        eager
                        finish="soft"
                        sizes="(max-width: 640px) 55vw, 28vw"
                        className="w-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[min(40rem,62%)] bg-linear-to-r from-indigo from-55% via-indigo/95 to-transparent"
          aria-hidden="true"
        />
        <div
          className={cn(
            monoContainer,
            "relative z-10 flex h-full items-center py-16 nav:py-20",
          )}
        >
          <div className="max-w-[32rem] -translate-y-10 nav:-translate-y-14">
            <h1 className="app-hero-rise app-hero-rise-1 m-0 text-[clamp(3.25rem,8vw,5.8rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
              {site.name}
            </h1>
            <p className="app-hero-rise app-hero-rise-2 mt-5 mb-0 text-[clamp(1.75rem,4vw,2.7rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-white/92">
              {copy.title}
            </p>
            <p className="app-hero-rise app-hero-rise-3 mt-7 mb-0 whitespace-pre-line text-[1.22rem] leading-[1.75] text-white/72">
              {copy.lead}
            </p>

            <div className="app-hero-rise app-hero-rise-4 mt-10 flex flex-wrap items-center gap-5">
              <AppStoreBadge locale={locale} label={copy.download} />
              <span className="text-[0.98rem] font-medium tracking-[-0.01em] text-white/62">
                {trustLine}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section aria-label={copy.featuresHeading}>
        {copy.features.map((feature, index) => {
            const visual = FEATURE_VISUALS[feature.id];
            if (!visual) return null;
            const reverse = index % 2 === 1;
            const tone = FEATURE_TONES[index % FEATURE_TONES.length];

            return (
              <article
                key={feature.id}
                className={cn("relative overflow-hidden", tone)}
              >
                <div
                  className={cn(
                    monoContainer,
                    "relative z-10 flex flex-col items-center gap-12 py-20 nav:grid nav:grid-cols-2 nav:items-center nav:gap-16 nav:py-24",
                    reverse && "nav:[&>div:first-child]:order-2",
                  )}
                >
                  <div className="w-full">
                    <p className="m-0 text-[0.78rem] font-semibold tracking-[0.18em] uppercase text-green">
                      0{index + 1}
                    </p>
                    <h3 className="mt-4 mb-0 text-[clamp(1.85rem,3.6vw,2.55rem)] font-semibold leading-[1.18] tracking-[-0.03em]">
                      {feature.title}
                    </h3>
                    <p className="mt-5 mb-0 max-w-xl whitespace-pre-line text-[1.18rem] leading-[1.75] text-muted">
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
      </section>

      <section className="bg-white py-20 nav:py-24" aria-labelledby="app-gallery">
        <div className={monoContainer}>
        <p className="m-0 text-center text-[0.78rem] font-semibold tracking-[0.18em] uppercase text-green">
          {copy.galleryHeading}
        </p>
        <h2
          id="app-gallery"
          className="mx-auto mt-4 mb-0 max-w-3xl text-center text-[clamp(1.9rem,3.8vw,2.8rem)] font-semibold leading-[1.2] tracking-[-0.03em]"
        >
          {copy.galleryLead}
        </h2>
        <p className="mx-auto mt-5 mb-2 max-w-2xl text-center whitespace-pre-line text-[1.16rem] leading-[1.75] text-muted">
          {copy.galleryBody}
        </p>
        </div>
        <AppScreenGallery
          finish="soft"
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

      <div>
        <AppDownload
          locale={locale}
          size="large"
          variant="editorial"
          copy={{
            ...dict.appDownload,
            kicker: copy.ctaKicker,
            title: copy.ctaTitle,
            body: copy.ctaBody,
            download: copy.download,
            qrHint: copy.ctaQrHint,
          }}
        />
      </div>
    </main>
  );
}
