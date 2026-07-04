"use client";

import { useEffect, useRef, type RefObject } from "react";

export const CAROUSEL_AUTOPLAY_MS = 5_000;

type Direction = "horizontal" | "vertical";

export function advanceCarouselSlide(el: HTMLElement, direction: Direction) {
  if (direction === "horizontal") {
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    if (maxLeft <= 4) {
      return;
    }

    const nextLeft = el.scrollLeft + el.clientWidth;
    const targetLeft = nextLeft >= maxLeft - 4 ? 0 : nextLeft;
    el.scrollTo({ left: targetLeft, behavior: "smooth" });
    return;
  }

  const maxTop = Math.max(0, el.scrollHeight - el.clientHeight);
  if (maxTop <= 4) {
    return;
  }

  const firstCell = el.querySelector<HTMLElement>("[data-carousel-cell]");
  const step = firstCell?.offsetHeight ?? el.clientHeight * 0.85;
  const nextTop = el.scrollTop + step;
  const targetTop = nextTop >= maxTop - 4 ? 0 : nextTop;
  el.scrollTo({ top: targetTop, behavior: "smooth" });
}

type Options = {
  enabled: boolean;
  itemCount: number;
  direction?: Direction;
  intervalMs?: number;
};

export function useCarouselAutoplay(
  scrollRef: RefObject<HTMLDivElement | null>,
  { enabled, itemCount, direction = "horizontal", intervalMs = CAROUSEL_AUTOPLAY_MS }: Options,
) {
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!enabled || itemCount <= 1) {
      return;
    }

    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    const timer = window.setInterval(() => {
      if (pausedRef.current) {
        return;
      }

      const container = scrollRef.current;
      if (!container) {
        return;
      }

      advanceCarouselSlide(container, direction);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [enabled, itemCount, direction, intervalMs, scrollRef]);
}
