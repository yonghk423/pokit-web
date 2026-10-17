"use client";

import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

import { AppStoreBadge } from "@/components/app-store-badge";
import { appStoreUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import type { AppDownloadMessages } from "@/i18n/get-app-download-messages";
import { cn, monoContainer } from "@/lib/cn";

type DownloadVisual = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type Props = {
  locale: Locale;
  messages: AppDownloadMessages;
  size?: "default" | "large";
  variant?: "brutal" | "editorial";
  /** Defaults to `app`. Pass empty string to omit. */
  sectionId?: string;
  /**
   * Still shown left of the QR on editorial layouts.
   * Omit to use the default post-it visual; pass `null` to hide.
   */
  visual?: DownloadVisual | null;
  resourceLinks?: { href: string; label: string }[];
};

function defaultEditorialVisual(locale: Locale, alt: string): DownloadVisual {
  return {
    src:
      locale === "ko"
        ? "/icon-with-multi-postit-labels.png"
        : "/en/icon-with-multi-postit-labels.png",
    alt,
    width: 1152,
    height: 864,
  };
}

export function AppDownload({
  locale,
  messages,
  size = "default",
  variant = "brutal",
  sectionId = "app",
  visual,
  resourceLinks,
}: Props) {
  const t = createTranslator(messages);
  const body = t("오늘 필요한 것들을, POKIT에 담아보세요. 루틴도, 메모도, 해야 할 일도. 하루에 필요한 작은 것부터 하나씩. POKIT과 함께 오늘을 가볍게 시작해보세요.");
  const large = size === "large";
  const editorial = variant === "editorial";
  const resolvedVisual =
    visual === null
      ? null
      : (visual ??
        (editorial
          ? defaultEditorialVisual(
              locale,
              t("형광펜과 포스트잇에 적힌 루틴, 할 일, 메모 라벨"),
            )
          : null));

  return (
    <section
      id={sectionId || undefined}
      className={cn(editorial ? "mt-20 max-nav:mt-14" : cn(monoContainer, "mt-12"))}
    >
      <div
        className={cn(
          "relative isolate overflow-hidden bg-[#2563eb] text-white",
          editorial
            ? "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-8 px-[max(1.25rem,calc((100%-72rem)/2+1.25rem))] py-12 max-nav:grid-cols-1 max-nav:gap-8 max-nav:px-6 max-nav:py-10 nav:gap-10"
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
            {t("지금 시작")}
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
            {t("POKIT 깔고, 오늘부터 천천히 채워 보세요.")}
          </h2>
          {body ? (
            <p
              className={cn(
                "mt-5 mb-0 whitespace-pre-line font-sans font-normal leading-[1.7] tracking-[-0.01em] text-white/70",
                large ? "text-[1.05rem]" : "text-[0.98rem]",
              )}
            >
              {body}
            </p>
          ) : null}
          {resourceLinks?.length ? (
            <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {resourceLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="font-sans text-sm font-medium text-white underline decoration-white/70 underline-offset-4 transition-colors hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
          <div className="mt-6">
            <AppStoreBadge locale={locale} label={t("App Store에서 받기")} />
          </div>
        </div>

        <div
          className={cn(
            "relative z-10 flex items-center justify-self-end",
            resolvedVisual
              ? "gap-2 max-nav:w-full max-nav:flex-col max-nav:gap-6"
              : "max-nav:hidden",
          )}
        >
          {resolvedVisual ? (
            <div className="w-[min(15rem,100%)] shrink-0 max-nav:mx-auto nav:w-[15rem] nav:-mr-1">
              <Image
                src={resolvedVisual.src}
                alt={resolvedVisual.alt}
                width={resolvedVisual.width}
                height={resolvedVisual.height}
                sizes="15rem"
                className="h-auto w-full"
              />
            </div>
          ) : null}

          <div
            className={cn(
              "flex aspect-square w-44 shrink-0 flex-col items-center justify-between bg-panel px-3 py-3 text-ink",
              resolvedVisual && "max-nav:hidden",
              editorial
                ? "rounded-[1.6rem] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.45)]"
                : "rounded-[1.25rem] border border-ink/12",
            )}
          >
            <p className="m-0 text-center label-caps text-green">
              {t("지금 스캔해 보세요")}
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
                aria-label={t("POKIT 앱 App Store QR 코드")}
              />
            </div>
            <p
              className={cn(
                "m-0 whitespace-pre-line px-0.5 text-center font-sans font-bold leading-snug tracking-[-0.01em] text-ink normal-case",
                large ? "text-[0.78rem]" : "text-[0.68rem]",
              )}
            >
              {t("카메라로 QR 코드를 스캔해 POKIT을 바로 시작할 수 있어요.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
