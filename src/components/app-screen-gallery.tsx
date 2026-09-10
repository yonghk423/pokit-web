"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { APP_SCREEN_SHELL } from "@/lib/app-screens";
import { cn } from "@/lib/cn";

export type AppGalleryItem = {
  src: StaticImageData;
  title: string;
  alt: string;
};

type Props = {
  items: AppGalleryItem[];
  prevAria: string;
  nextAria: string;
};

const AUTOPLAY_MS = 4500;

const controlBtnClass =
  "size-10 shrink-0 cursor-pointer border-2 border-black bg-panel font-sans text-base font-bold leading-none text-ink hover:bg-wash hover:brutal-shadow disabled:cursor-not-allowed disabled:bg-beige disabled:text-muted";

export function AppScreenGallery({ items, prevAria, nextAria }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const cell = el.querySelectorAll<HTMLElement>("[data-gallery-cell]")[index];
    if (!cell) return;

    const targetLeft =
      cell.offsetLeft - (el.clientWidth - cell.offsetWidth) / 2;

    el.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, []);

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const cells = el.querySelectorAll<HTMLElement>("[data-gallery-cell]");
    if (cells.length === 0) return;

    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    cells.forEach((cell, index) => {
      const cellCenter = cell.offsetLeft + cell.offsetWidth / 2;
      const distance = Math.abs(center - cellCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateActiveIndex();
    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      el.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex, items.length]);

  useEffect(() => {
    if (items.length <= 1) return;

    const el = scrollRef.current;
    if (!el) return;

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
      if (pausedRef.current) return;
      const next = (activeIndexRef.current + 1) % items.length;
      scrollToIndex(next);
    }, AUTOPLAY_MS);

    return () => {
      window.clearInterval(timer);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [items.length, scrollToIndex]);

  const goPrev = () => {
    const next = (activeIndex - 1 + items.length) % items.length;
    scrollToIndex(next);
  };

  const goNext = () => {
    const next = (activeIndex + 1) % items.length;
    scrollToIndex(next);
  };

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];

  return (
    <div className="mt-10">
      <div className="relative">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1rem,calc(50%-6.5rem))] pb-2 nav:gap-8 nav:px-[max(1rem,calc(50%-7.5rem))]"
          aria-live="polite"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={item.src.src}
                data-gallery-cell
                className="w-52 shrink-0 snap-center nav:w-60"
              >
                <div
                  className={cn(
                    "overflow-hidden border-2 border-black transition-all duration-500 ease-out",
                    isActive
                      ? "scale-100 opacity-100 brutal-shadow-mint"
                      : "scale-[0.9] opacity-55 brutal-shadow",
                  )}
                  style={{ backgroundColor: APP_SCREEN_SHELL }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    sizes="(max-width: 640px) 52vw, 240px"
                    quality={75}
                    placeholder="blur"
                    className="h-auto w-full"
                    style={{ backgroundColor: APP_SCREEN_SHELL }}
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-5">
        <p className="m-0 max-w-md text-center text-[clamp(1rem,2vw,1.15rem)] font-extrabold leading-snug tracking-[-0.02em]">
          {activeItem.title}
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className={controlBtnClass}
            onClick={goPrev}
            aria-label={prevAria}
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            {items.map((item, index) => (
              <button
                key={item.src.src}
                type="button"
                aria-label={item.title}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "h-2.5 rounded-full border-2 border-black transition-all duration-300",
                  index === activeIndex
                    ? "w-8 bg-brand"
                    : "w-2.5 bg-panel hover:bg-wash",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            className={controlBtnClass}
            onClick={goNext}
            aria-label={nextAria}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
