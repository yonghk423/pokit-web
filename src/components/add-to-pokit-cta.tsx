"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import {
  buildAddRoutinePayload,
  sendToPokitApp,
} from "@/lib/pokit-bridge";
import type { PokitRoutineArticle } from "@/sanity/types";

type Props = {
  article: PokitRoutineArticle;
  className?: string;
};

type CtaState = "idle" | "sent" | "fallback";

export function AddToPokitCta({ article, className }: Props) {
  const [state, setState] = useState<CtaState>("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleAdd = useCallback(() => {
    const payload = buildAddRoutinePayload(article);
    const sent = sendToPokitApp(payload);

    if (sent) {
      setState("sent");
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setState("idle"), 4000);
      return;
    }

    setState("fallback");
  }, [article]);

  return (
    <section
      className={cn(
        "mt-12 max-w-[42rem] border-t border-fine-line pt-8",
        className,
      )}
      aria-label="POKIT 앱에 루틴 담기"
    >
      <p className="m-0 font-sans text-[0.72rem] font-bold tracking-[0.1em] text-green uppercase">
        POKIT
      </p>
      <h2 className="mt-2 mb-0 font-serif text-[clamp(1.35rem,3vw,1.75rem)] leading-[1.15] font-medium tracking-[-0.02em]">
        이 루틴을 앱에 담아 보세요
      </h2>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex min-h-[2.75rem] items-center justify-center bg-green px-5 font-sans text-[0.78rem] font-extrabold tracking-[0.06em] text-white uppercase transition-opacity hover:opacity-90"
        >
          POKIT에 담기
        </button>
      </div>

      {state === "sent" && (
        <p
          className="mt-4 mb-0 font-sans text-[0.88rem] leading-[1.45] text-green"
          role="status"
        >
          앱에서 이어서 담을 수 있어요
        </p>
      )}

      {state === "fallback" && (
        <div className="mt-5 rounded-sm border border-fine-line bg-panel px-4 py-4">
          <p className="m-0 font-sans text-[0.92rem] leading-[1.5] text-ink">
            POKIT 앱에서 루틴을 기록하고, 하루를 정리하세요.
          </p>
          <a
            href={site.appStoreUrl}
            className="mt-4 inline-flex min-h-[2.5rem] items-center justify-center bg-brand px-4 font-sans text-[0.75rem] font-extrabold tracking-[0.06em] text-ink uppercase"
          >
            App Store에서 다운로드
          </a>
        </div>
      )}
    </section>
  );
}
