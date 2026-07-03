"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { appStoreUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn, monoContainer } from "@/lib/cn";
import {
  buildAddRoutinePayload,
  sendToPokitApp,
} from "@/lib/pokit-bridge";
import type { PokitRoutineArticle } from "@/sanity/types";

type Props = {
  article: PokitRoutineArticle;
  locale: Locale;
  copy: Dictionary["article"]["addToPokit"];
  className?: string;
};

type CtaState = "idle" | "sent" | "fallback";

export function AddToPokitCta({ article, locale, copy, className }: Props) {
  const [state, setState] = useState<CtaState>("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      return;
    }

    setState("fallback");
  }, [article, locale]);

  return (
    <section
      className={cn(
        "mt-16 max-w-[42rem] border-t-2 border-black pt-10",
        className,
      )}
      aria-label={copy.ariaLabel}
    >
      <p className="m-0 label-caps text-green">
        POKIT
      </p>
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

      {state === "fallback" && (
        <div className="mt-6 border-2 border-black bg-beige px-5 py-5">
          <p className="m-0 font-sans text-[0.92rem] leading-[1.6] text-ink">
            {copy.fallback}
          </p>
          <a
            href={appStoreUrl(locale)}
            className="mt-5 inline-flex min-h-11 items-center justify-center border-2 border-black bg-brand px-5 font-sans text-[0.75rem] font-extrabold tracking-[0.06em] text-ink uppercase hover:brutal-shadow"
          >
            {copy.download}
          </a>
        </div>
      )}
    </section>
  );
}
