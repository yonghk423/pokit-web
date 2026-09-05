"use client";

import { QRCodeSVG } from "qrcode.react";

import { AppStoreBadge } from "@/components/app-store-badge";
import { appStoreUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn, monoContainer } from "@/lib/cn";

type Props = {
  locale: Locale;
  copy: Dictionary["appDownload"];
};

export function AppDownload({ locale, copy }: Props) {
  return (
    <section id="app" className={cn(monoContainer, "mt-12")}>
      <div
        className={cn(
          "relative isolate overflow-hidden border-2 border-black bg-indigo text-white brutal-shadow",
          "grid grid-cols-[minmax(0,1.15fr)_auto] items-center gap-10 px-7 py-14",
          "max-nav:grid-cols-1 max-nav:gap-9 max-nav:px-6 max-nav:py-11",
        )}
      >
        <div className="pointer-events-none absolute -left-16 top-[-30%] h-56 w-56 rounded-full bg-brand/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-[-40%] h-64 w-64 rounded-full bg-tertiary-light/30 blur-3xl" />

        <div className="relative z-10 max-w-xl">
          <p className="m-0 inline-flex border border-white/35 bg-white/10 px-2.5 py-1 label-caps text-brand-soft">
            {copy.kicker}
          </p>
          <h2 className="mt-5 mb-0 text-[clamp(1.55rem,3vw,2.35rem)] font-extrabold leading-[1.12] tracking-[-0.035em]">
            {copy.title}
          </h2>
          <div className="mt-8">
            <AppStoreBadge locale={locale} label={copy.download} />
          </div>
        </div>

        <div className="relative z-10 max-nav:hidden">
          <div className="relative border-2 border-black bg-panel px-5 pb-5 pt-4 text-ink brutal-shadow-mint">
            <p className="m-0 mb-3 text-center label-caps text-green">
              {copy.qrTitle}
            </p>
            <div className="mx-auto w-fit border-2 border-black bg-white p-3">
              <QRCodeSVG
                value={appStoreUrl(locale)}
                size={148}
                bgColor="#ffffff"
                fgColor="#181a2e"
                role="img"
                aria-label={copy.qrAria}
              />
            </div>
            <p className="mt-4 mb-0 max-w-48 text-center font-sans text-[0.82rem] font-extrabold leading-snug tracking-[-0.01em] text-ink normal-case">
              {copy.qrHint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
