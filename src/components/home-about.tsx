import { QRCodeSVG } from "qrcode.react";

import { PhoneFrame } from "@/components/app-phone-frame";
import { AppStoreBadge } from "@/components/app-store-badge";
import { appStoreUrl, site } from "@/config/site";
import { appScreen } from "@/lib/app-screens";
import { cn, monoContainer } from "@/lib/cn";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

const HOME_APP_HERO = [
  { file: "first-launch.webp" as const, featureId: "routines" },
  { file: "todos.webp" as const, featureId: "todos" },
  { file: "history.webp" as const, featureId: "history" },
  { file: "today-note.webp" as const, featureId: "notes" },
  { file: "routines.webp" as const, featureId: "routines" },
  { file: "library.webp" as const, featureId: "library" },
  { file: "memo-editor.webp" as const, featureId: "memo" },
  { file: "lock-screen-memo.webp" as const, featureId: "memo" },
] as const;

function trustLine(locale: Locale) {
  if (locale === "ko") return "루틴도 메모도 할 일도, 여기 한곳에";
  if (locale === "ja") return "ルーチンもメモもやることも、ここひとつに";
  return "Routines, notes, and tasks, all in one place";
}

export function HomeAbout({ locale, dict }: Props) {
  const copy = dict.appPage;
  const download = dict.appDownload;
  const featureById = Object.fromEntries(
    copy.features.map((feature) => [feature.id, feature]),
  );

  return (
    <section
      id="app"
      className="relative isolate mt-24 h-[calc(100svh-5rem)] overflow-hidden bg-pink-pastel text-ink max-nav:mt-16"
      aria-labelledby="home-app-heading"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className={cn(
            "absolute left-1/2 top-1/2 origin-center",
            "hidden w-[58%] min-w-[28rem] -translate-x-[6%] -translate-y-1/2 rotate-[30deg] nav:block",
          )}
        >
          <div className="grid grid-cols-4 gap-6">
            {HOME_APP_HERO.map((phone, index) => {
              const feature = featureById[phone.featureId];
              const leftEdge = index === 0 || index === 4;
              return (
                <div
                  key={phone.file}
                  className="app-hero-phone w-full"
                  style={{ animationDelay: `${180 + index * 70}ms` }}
                >
                  <div className={leftEdge ? "translate-y-24" : undefined}>
                    <PhoneFrame
                      src={appScreen(locale, phone.file)}
                      alt={feature?.imageAlt ?? copy.title}
                      priority={index < 2}
                      eager
                      finish="soft"
                      sizes="32vw"
                      className="w-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[58%] items-center justify-end pr-3",
            "nav:hidden",
          )}
        >
          <div className="flex w-full max-w-[11.5rem] flex-col gap-3">
            {HOME_APP_HERO.slice(0, 2).map((phone, index) => {
              const feature = featureById[phone.featureId];
              return (
                <div
                  key={phone.file}
                  className="app-hero-phone w-full"
                  style={{ animationDelay: `${180 + index * 90}ms` }}
                >
                  <PhoneFrame
                    src={appScreen(locale, phone.file)}
                    alt={feature?.imageAlt ?? copy.title}
                    priority={index === 0}
                    eager
                    finish="soft"
                    sizes="45vw"
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[min(40rem,62%)] bg-linear-to-r from-pink-pastel from-55% via-pink-pastel/95 to-transparent"
        aria-hidden="true"
      />

      <div
        className={cn(
          monoContainer,
          "relative z-10 flex h-full items-center py-16 nav:py-20",
        )}
      >
        <div className="max-w-[34rem] -translate-y-6 nav:-translate-y-10">
          <h2
            id="home-app-heading"
            className="app-hero-rise app-hero-rise-1 m-0 font-sans text-[clamp(2.85rem,7vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.04em]"
          >
            {site.name}
          </h2>
          <p className="app-hero-rise app-hero-rise-2 mt-5 mb-0 font-serif text-[clamp(1.55rem,3.6vw,2.35rem)] font-normal italic leading-[1.25] tracking-[-0.02em] text-ink/90">
            {copy.title}
          </p>
          <p className="app-hero-rise app-hero-rise-3 mt-7 mb-0 max-w-[30rem] whitespace-pre-line font-sans text-[1.05rem] font-normal leading-[1.7] tracking-[-0.01em] text-ink/65">
            {copy.lead}
          </p>

          <div className="app-hero-rise app-hero-rise-4 mt-10 flex flex-wrap items-center gap-5">
            <AppStoreBadge locale={locale} label={copy.download} />
            <span className="font-sans text-[0.92rem] font-normal tracking-[-0.01em] text-ink/55">
              {trustLine(locale)}
            </span>
          </div>

          <div className="app-hero-rise app-hero-rise-4 relative z-10 mt-8 hidden nav:block">
            <div className="flex aspect-square w-44 flex-col items-center justify-between rounded-[1.6rem] bg-panel px-3 py-3 text-ink shadow-[0_24px_48px_-20px_rgba(0,0,0,0.45)]">
              <p className="m-0 text-center label-caps text-green">
                {download.qrTitle}
              </p>
              <div className="rounded-xl bg-white p-1.5">
                <QRCodeSVG
                  value={appStoreUrl(locale)}
                  size={108}
                  bgColor="#ffffff"
                  fgColor="#181a2e"
                  role="img"
                  aria-label={download.qrAria}
                />
              </div>
              <p className="m-0 whitespace-pre-line px-0.5 text-center font-sans text-[0.78rem] font-bold leading-snug tracking-[-0.01em] text-ink normal-case">
                {download.qrHint}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
