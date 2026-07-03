"use client";

import { QRCodeSVG } from "qrcode.react";

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
    <section
      id="app"
      className={cn(
        monoContainer,
        "mt-12 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-10 border-2 border-black bg-indigo px-6 py-12 text-white max-nav:grid-cols-1 max-nav:gap-8",
      )}
    >
      <div>
        <p className="m-0 label-caps text-brand">
          {copy.kicker}
        </p>
        <h2 className="mt-4 mb-0 text-[clamp(1.6rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
          {copy.title}
        </h2>
      </div>
      <div className="flex flex-col items-center gap-4">
        <a
          href={appStoreUrl(locale)}
          className="hidden min-h-12 items-center justify-center border-2 border-black bg-brand px-6 font-sans text-[0.78rem] font-extrabold tracking-[0.08em] text-ink uppercase hover:brutal-shadow max-nav:inline-flex"
        >
          {copy.download}
        </a>
        <div className="flex flex-col items-center gap-3 border-2 border-black bg-panel p-5 max-nav:hidden">
          <QRCodeSVG
            value={appStoreUrl(locale)}
            size={132}
            bgColor="#fbf8ff"
            fgColor="#181a2e"
            role="img"
            aria-label={copy.qrAria}
          />
          <p className="m-0 font-sans text-[0.72rem] font-bold tracking-[0.04em] text-ink normal-case">
            {copy.qrHint}
          </p>
        </div>
      </div>
    </section>
  );
}
