"use client";

import { QRCodeSVG } from "qrcode.react";

import { AppStoreBadge } from "@/components/app-store-badge";
import { appStoreUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type Props = {
  locale: Locale;
  copy: Pick<
    Dictionary["appDownload"],
    "download" | "qrTitle" | "qrHint" | "qrAria" | "heroAside"
  >;
};

/** Compact App Store + QR cluster for the home hero title row. */
export function HomeHeroDownload({ locale, copy }: Props) {
  return (
    <div
      data-hide-in-pokit-app
      className="flex shrink-0 flex-col items-end gap-2.5 max-nav:mt-3 max-nav:items-start"
    >
      <AppStoreBadge locale={locale} label={copy.download} size="compact" />
      <div className="flex items-start gap-2.5">
        <p className="m-0 mt-0.5 shrink-0 whitespace-nowrap text-right font-serif text-[0.78rem] font-normal italic leading-[1.45] tracking-[-0.02em] text-ink/60 max-nav:text-left">
          {copy.heroAside}
        </p>
        <a
          href={appStoreUrl(locale)}
          aria-label={copy.download}
          className="hero-qr-nudge flex w-[6.75rem] flex-col items-center gap-1 rounded-[0.9rem] bg-white px-1.5 py-1.5 no-underline ring-1 ring-ink/6"
        >
          <p className="m-0 text-center font-sans text-[0.55rem] font-semibold tracking-[0.1em] text-green uppercase">
            {copy.qrTitle}
          </p>
          <div className="rounded-[0.35rem] bg-white p-0.5">
            <QRCodeSVG
              value={appStoreUrl(locale)}
              size={68}
              bgColor="#ffffff"
              fgColor="#181a2e"
              role="img"
              aria-label={copy.qrAria}
            />
          </div>
          <p className="m-0 px-0.5 text-center font-sans text-[0.55rem] font-semibold leading-snug tracking-[-0.01em] text-ink/65">
            {copy.qrHint}
          </p>
        </a>
      </div>
    </div>
  );
}
