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
        "mt-5 max-w-[42rem] max-nav:mx-1 max-nav:mb-[max(1.75rem,env(safe-area-inset-bottom))]",
        className,
      )}
      aria-label={copy.ariaLabel}
    >
      {inApp && (
        <div className="rounded-[0.85rem] border border-ink/10 bg-ink/[0.03] px-3.5 py-3.5">
          <p className="m-0 font-sans text-[0.68rem] font-semibold tracking-[0.08em] text-ink/45 uppercase">
            POKIT
          </p>
          <h2 className="mt-1 mb-0 font-sans text-[0.95rem] font-extrabold leading-snug tracking-[-0.02em] text-ink">
            {copy.title}
          </h2>

          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-full bg-ink px-3.5 font-sans text-[0.72rem] font-semibold tracking-[-0.01em] text-white transition-colors hover:bg-indigo"
            >
              <span className="size-1.5 rounded-full bg-brand" aria-hidden />
              {copy.button}
            </button>
            {state === "sent" ? (
              <p
                className="m-0 font-sans text-[0.75rem] leading-snug text-ink/55"
                role="status"
              >
                {copy.sent}
              </p>
            ) : null}
          </div>
        </div>
      )}

      {!inApp && (
        <div className="rounded-[0.85rem] border border-ink/10 bg-ink/[0.03] px-3.5 pt-3 pb-4">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="m-0 font-sans text-[0.8rem] leading-snug text-ink/75">
                {copy.fallback}
              </p>
              <div className="mt-2.5 hidden max-nav:block">
                <AppStoreBadge locale={locale} label={copy.download} />
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-1 rounded-md bg-white px-2 py-1.5 ring-1 ring-ink/8 max-nav:hidden">
              <QRCodeSVG
                value={storeUrl}
                size={56}
                bgColor="#ffffff"
                fgColor="#181a2e"
                role="img"
                aria-label={copy.qrAria}
              />
              <p className="m-0 max-w-[4.5rem] text-center font-sans text-[0.55rem] font-medium leading-tight text-ink/50 normal-case">
                {copy.qrHint}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
