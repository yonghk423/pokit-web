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
  size?: "default" | "large";
  variant?: "brutal" | "editorial";
  /** Defaults to `app`. Pass empty string to omit. */
  sectionId?: string;
};

export function AppDownload({
  locale,
  copy,
  size = "default",
  variant = "brutal",
  sectionId = "app",
}: Props) {
  const large = size === "large";
  const editorial = variant === "editorial";
  return (
    <section
      id={sectionId || undefined}
      className={cn(editorial ? "mt-20 max-nav:mt-14" : cn(monoContainer, "mt-12"))}
    >
      <div
        className={cn(
          "relative isolate overflow-hidden bg-[#2563eb] text-white",
          editorial
            ? "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-10 px-[max(1.25rem,calc((100%-72rem)/2+1.25rem))] py-12 max-nav:grid-cols-1 max-nav:gap-8 max-nav:px-6 max-nav:py-10"
            : cn(
                "rounded-[1.25rem] border border-ink/10",
                "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-8 px-8 py-11",
                "max-nav:grid-cols-1 max-nav:gap-8 max-nav:px-6 max-nav:py-10",
              ),
        )}
      >
        <div className="pointer-events-none absolute -left-16 top-[-30%] h-56 w-56 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-[-40%] h-64 w-64 rounded-full bg-tertiary-light/20 blur-3xl" />

        <div className={cn("relative z-10", large ? "max-w-2xl" : "max-w-xl")}>
          <p
            className={cn(
              "m-0 inline-flex text-brand-soft",
              editorial
                ? "px-0 font-sans text-[0.72rem] font-semibold tracking-[0.14em] uppercase"
                : cn(
                    "border border-white/35 bg-white/10 px-2.5 py-1 label-caps",
                    large && "text-[0.95rem]",
                  ),
            )}
          >
            {copy.kicker}
          </p>
          <h2
            className={cn(
              "mt-4 mb-0 leading-[1.2] tracking-[-0.02em]",
              editorial
                ? "font-serif text-[clamp(1.65rem,3.2vw,2.35rem)] font-normal italic"
                : cn(
                    "font-extrabold tracking-[-0.03em]",
                    large
                      ? "text-[clamp(1.85rem,3.4vw,2.55rem)]"
                      : "text-[clamp(1.45rem,2.8vw,2.05rem)]",
                  ),
            )}
          >
            {copy.title}
          </h2>
          {copy.body ? (
            <p
              className={cn(
                "mt-5 mb-0 whitespace-pre-line font-sans font-normal leading-[1.7] tracking-[-0.01em] text-white/70",
                large ? "text-[1.05rem]" : "text-[0.98rem]",
              )}
            >
              {copy.body}
            </p>
          ) : null}
          <div className="mt-6">
            <AppStoreBadge locale={locale} label={copy.download} />
          </div>
        </div>

        <div className="relative z-10 justify-self-end max-nav:hidden">
          <div
            className={cn(
              "flex aspect-square w-44 flex-col items-center justify-between bg-panel px-3 py-3 text-ink",
              editorial
                ? "rounded-[1.6rem] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.45)]"
                : "rounded-[1.25rem] border border-ink/12",
            )}
          >
            <p className="m-0 text-center label-caps text-green">
              {copy.qrTitle}
            </p>
            <div
              className={cn(
                "bg-white p-1.5",
                editorial ? "rounded-xl" : "rounded-lg border border-ink/12",
              )}
            >
              <QRCodeSVG
                value={appStoreUrl(locale)}
                size={108}
                bgColor="#ffffff"
                fgColor="#181a2e"
                role="img"
                aria-label={copy.qrAria}
              />
            </div>
            <p
              className={cn(
                "m-0 whitespace-pre-line px-0.5 text-center font-sans font-bold leading-snug tracking-[-0.01em] text-ink normal-case",
                large ? "text-[0.78rem]" : "text-[0.68rem]",
              )}
            >
              {copy.qrHint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
