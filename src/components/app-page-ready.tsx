"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { site } from "@/config/site";
import { cn } from "@/lib/cn";

const AppScreenReadyContext = createContext<(() => void) | null>(null);

export function useAppScreenReady() {
  return useContext(AppScreenReadyContext);
}

const REVEAL_FALLBACK_MS = 6000;

type Props = {
  children: React.ReactNode;
  expected: number;
  label?: string;
};

export function AppPageReadyGate({
  children,
  expected,
  label = "Loading",
}: Props) {
  const [loaded, setLoaded] = useState(0);
  const [revealed, setRevealed] = useState(expected <= 0);
  const [gone, setGone] = useState(expected <= 0);

  const markReady = useCallback(() => {
    setLoaded((count) => count + 1);
  }, []);

  useEffect(() => {
    if (!revealed && loaded >= expected) {
      setRevealed(true);
    }
  }, [expected, loaded, revealed]);

  useEffect(() => {
    if (revealed) return;
    const timer = window.setTimeout(() => setRevealed(true), REVEAL_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [revealed]);

  return (
    <AppScreenReadyContext.Provider value={markReady}>
      <div className="relative">
        {children}
        {gone ? null : (
          <div
            className={cn(
              "absolute inset-0 z-20 flex flex-col items-center justify-center bg-indigo text-white transition-opacity duration-300",
              revealed ? "pointer-events-none opacity-0" : "opacity-100",
            )}
            role="status"
            aria-live="polite"
            aria-busy={!revealed}
            onTransitionEnd={() => {
              if (revealed) setGone(true);
            }}
          >
            <p className="m-0 text-[clamp(2.4rem,8vw,4.5rem)] font-extrabold leading-none tracking-[-0.045em]">
              {site.name}
            </p>
            <p className="mt-5 mb-0 text-[0.78rem] font-bold tracking-[0.12em] text-brand-soft uppercase">
              {label}
            </p>
          </div>
        )}
      </div>
    </AppScreenReadyContext.Provider>
  );
}
