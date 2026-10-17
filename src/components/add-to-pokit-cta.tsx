"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AppInstallCta } from "@/components/app-install-cta";
import type { Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import type { AppInstallMessages } from "@/i18n/get-app-install-messages";
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
  messages: AppInstallMessages;
  className?: string;
};

type CtaState = "idle" | "sent";

export function AddToPokitCta({ article, locale, messages, className }: Props) {
  const t = createTranslator(messages);
  const [inApp, setInApp] = useState(false);
  const [state, setState] = useState<CtaState>("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      aria-label={t("POKIT 앱에 루틴 담기")}
    >
      {inApp && (
        <div className="rounded-[0.85rem] border border-ink/10 bg-ink/[0.03] px-3.5 py-3.5">
          <p className="m-0 font-sans text-[0.68rem] font-semibold tracking-[0.08em] text-ink/45 uppercase">
            POKIT
          </p>
          <h2 className="mt-1 mb-0 font-sans text-[0.95rem] font-extrabold leading-snug tracking-[-0.02em] text-ink">
            {t("이 루틴을 앱에 담아 보세요")}
          </h2>

          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-full bg-ink px-3.5 font-sans text-[0.72rem] font-semibold tracking-[-0.01em] text-white transition-colors hover:bg-indigo"
            >
              <span className="size-1.5 rounded-full bg-brand" aria-hidden />
              {t("POKIT에 담기")}
            </button>
            {state === "sent" ? (
              <p
                className="m-0 font-sans text-[0.75rem] leading-snug text-ink/55"
                role="status"
              >
                {t("앱에서 이어서 담을 수 있어요")}
              </p>
            ) : null}
          </div>
        </div>
      )}

      {!inApp && (
        <AppInstallCta locale={locale} messages={messages} className="mt-0 max-w-none max-nav:mx-0 max-nav:mb-0" />
      )}
    </section>
  );
}
