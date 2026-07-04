"use client";

import { useEffect, useRef, type RefObject } from "react";

export const CAROUSEL_AUTOPLAY_MS = 10_000;

type Direction = "horizontal" | "vertical";

export function advanceCarouselSlide(el: HTMLElement, direction: Direction) {
  const cells = [...el.querySelectorAll<HTMLElement>("[data-carousel-cell]")];
  if (cells.length <= 1) {
    return;
  }

  const containerRect = el.getBoundingClientRect();
  let currentIndex = 0;

  for (let i = 0; i < cells.length; i++) {
    const cellRect = cells[i].getBoundingClientRect();

    if (direction === "horizontal") {
      if (cellRect.left >= containerRect.left - 2) {
        currentIndex = i;
        break;
      }
    } else if (cellRect.top >= containerRect.top - 2) {
      currentIndex = i;
      break;
    }
  }

  const nextIndex = currentIndex + 1 >= cells.length ? 0 : currentIndex + 1;
  cells[nextIndex]?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start",
  });
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
