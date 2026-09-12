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
          "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-8 px-8 py-11",
          "max-nav:grid-cols-1 max-nav:gap-8 max-nav:px-6 max-nav:py-10",
        )}
      >
        <div className="pointer-events-none absolute -left-16 top-[-30%] h-56 w-56 rounded-full bg-brand/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-[-40%] h-64 w-64 rounded-full bg-tertiary-light/30 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <p className="m-0 inline-flex border border-white/35 bg-white/10 px-2.5 py-1 label-caps text-brand-soft">
            {copy.kicker}
          </p>
          <h2 className="mt-4 mb-0 text-[clamp(1.2rem,2.2vw,1.6rem)] font-extrabold leading-tight tracking-[-0.03em]">
            {copy.title}
          </h2>
          <div className="mt-6">
            <AppStoreBadge locale={locale} label={copy.download} />
          </div>
        </div>

        <div className="relative z-10 justify-self-end max-nav:hidden">
          <div className="flex aspect-square w-44 flex-col items-center justify-between border-2 border-black bg-panel px-3 py-3 text-ink brutal-shadow-mint">
            <p className="m-0 text-center label-caps text-green">
              {copy.qrTitle}
            </p>
            <div className="border-2 border-black bg-white p-1.5">
              <QRCodeSVG
                value={appStoreUrl(locale)}
                size={108}
                bgColor="#ffffff"
                fgColor="#181a2e"
                role="img"
                aria-label={copy.qrAria}
              />
            </div>
            <p className="m-0 px-0.5 text-center font-sans text-[0.68rem] font-bold leading-snug tracking-[-0.01em] text-ink normal-case">
              {copy.qrHint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
