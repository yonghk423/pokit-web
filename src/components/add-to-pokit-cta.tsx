"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { AppStoreBadge } from "@/components/app-store-badge";
import { appStoreUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
import {
  buildAddRoutinePayload,
  isPokitAppContext,
  sendToPokitApp,
} from "@/lib/pokit-bridge";
import type { PokitRoutineArticle } from "@/sanity/types";

type Props = {
  article: PokitRoutineArticle;
  locale: Locale;
  copy: Dictionary["article"]["addToPokit"];
  className?: string;
};

type CtaState = "idle" | "sent";

export function AddToPokitCta({ article, locale, copy, className }: Props) {
  const [inApp, setInApp] = useState(false);
  const [state, setState] = useState<CtaState>("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storeUrl = appStoreUrl(locale);

  useEffect(() => {
    setInApp(isPokitAppContext());
  }, []);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleAdd = useCallback(() => {
    const payload = buildAddRoutinePayload(article, locale);
    const result = sendToPokitApp(payload, article);

    if (result === "sent" || result === "deep_link") {
      setState("sent");
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setState("idle"), 4000);
    }
  }, [article, locale]);

  return (
    <section
      className={cn(
        "mt-16 max-w-[42rem] border-t-2 border-black pt-10",
        className,
      )}
      aria-label={copy.ariaLabel}
    >
      {inApp && (
        <>
          <p className="m-0 label-caps text-green">POKIT</p>
          <h2 className="mt-3 mb-0 font-sans text-[clamp(1.35rem,3vw,1.75rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
            {copy.title}
          </h2>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex min-h-12 items-center justify-center border-2 border-black bg-green px-6 font-sans text-[0.78rem] font-extrabold tracking-[0.06em] text-white uppercase hover:brutal-shadow-mint"
            >
              {copy.button}
            </button>
          </div>

          {state === "sent" && (
            <p
              className="mt-5 mb-0 border-2 border-black bg-wash px-4 py-3 font-sans text-[0.88rem] leading-[1.5] text-green"
              role="status"
            >
              {copy.sent}
            </p>
          )}
        </>
      )}

      {!inApp && (
        <div className="border-2 border-black bg-beige px-5 py-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="m-0 font-sans text-[0.92rem] leading-[1.6] text-ink">
                {copy.fallback}
              </p>
              <div className="mt-5 hidden max-nav:block">
                <AppStoreBadge locale={locale} label={copy.download} />
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-2 self-center border-2 border-black bg-panel p-4 max-nav:hidden">
              <QRCodeSVG
                value={storeUrl}
                size={112}
                bgColor="#fbf8ff"
                fgColor="#181a2e"
                role="img"
                aria-label={copy.qrAria}
              />
              <p className="m-0 max-w-[8.5rem] text-center font-sans text-[0.68rem] font-bold leading-[1.35] tracking-[0.04em] text-ink normal-case">
                {copy.qrHint}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
