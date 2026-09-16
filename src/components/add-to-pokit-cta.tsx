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
      className={cn("mt-8 max-w-[42rem] border-t border-ink/10 pt-5", className)}
      aria-label={copy.ariaLabel}
    >
      {inApp && (
        <>
          <p className="m-0 label-caps text-green">POKIT</p>
          <h2 className="mt-1.5 mb-0 font-sans text-[1.05rem] font-extrabold leading-snug tracking-[-0.02em]">
            {copy.title}
          </h2>

          <div className="mt-3">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex min-h-9 items-center justify-center bg-green px-4 font-sans text-[0.72rem] font-extrabold tracking-[0.06em] text-white uppercase hover:bg-ink"
            >
              {copy.button}
            </button>
          </div>

          {state === "sent" && (
            <p
              className="mt-3 mb-0 rounded-lg border border-ink/12 bg-[#eef3f1] px-3 py-2 font-sans text-[0.8rem] leading-snug text-green"
              role="status"
            >
              {copy.sent}
            </p>
          )}
        </>
      )}

      {!inApp && (
        <div className="rounded-lg border border-ink/12 bg-[#f3f0e8] px-3 py-2.5">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="m-0 font-sans text-[0.8rem] leading-snug text-ink">
                {copy.fallback}
              </p>
              <div className="mt-2.5 hidden max-nav:block">
                <AppStoreBadge locale={locale} label={copy.download} />
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1 rounded-md border border-ink/10 bg-white px-2 py-1.5 max-nav:hidden">
              <QRCodeSVG
                value={storeUrl}
                size={64}
                bgColor="#ffffff"
                fgColor="#181a2e"
                role="img"
                aria-label={copy.qrAria}
              />
              <p className="m-0 max-w-[4.75rem] text-center font-sans text-[0.58rem] font-semibold leading-tight text-ink/70 normal-case">
                {copy.qrHint}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
