"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ArticleCard } from "@/components/article-card";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
import { shuffleArticlesKeepingNewest } from "@/lib/shuffle-articles";
import { useCarouselAutoplay } from "@/lib/use-carousel-autoplay";
import type { ArticleCardData } from "@/sanity/types";

type Variant = "vertical" | "compact";

type Props = {
  articles: ArticleCardData[];
  locale: Locale;
  categoryLabels: Dictionary["categories"];
  variant?: Variant;
  layout?: "rail" | "grid";
  columns?: 3 | 4;
  ariaLabel: string;
  shuffle?: boolean;
  autoPlay?: boolean;
};

const carouselBtnClass =
  "size-10 shrink-0 cursor-pointer border-2 border-black bg-panel font-sans text-base font-bold leading-none text-ink hover:bg-wash hover:brutal-shadow disabled:cursor-not-allowed disabled:bg-beige disabled:text-muted";

export function ArticleSectionCarousel({
  articles,
  locale,
  categoryLabels,
  variant = "vertical",
  layout = "grid",
  columns = 4,
  ariaLabel,
  shuffle = false,
  autoPlay = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [displayArticles, setDisplayArticles] = useState(articles);
  const isVertical = layout === "rail";

  useEffect(() => {
    setDisplayArticles(shuffle ? shuffleArticlesKeepingNewest(articles) : articles);
  }, [articles, shuffle]);

  const updateControls = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    if (isVertical) {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setCanPrev(scrollTop > 4);
      setCanNext(scrollTop + clientHeight < scrollHeight - 4);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
  }, [isVertical]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    updateControls();
    el.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);

    return () => {
      el.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [displayArticles, columns, updateControls]);

  useCarouselAutoplay(scrollRef, {
    enabled: autoPlay,
    itemCount: displayArticles.length,
    direction: isVertical ? "vertical" : "horizontal",
  });

  const scroll = (direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const sign = direction === "next" ? 1 : -1;

    if (isVertical) {
      const first = el.querySelector<HTMLElement>("[data-carousel-cell]");
      const step = first?.offsetHeight ?? el.clientHeight * 0.85;
      el.scrollBy({ top: sign * step, behavior: "smooth" });
      return;
    }

    el.scrollBy({ left: sign * el.clientWidth, behavior: "smooth" });
  };

  if (displayArticles.length === 0) {
    return null;
  }

  const showControls = displayArticles.length > (isVertical ? 1 : columns);

  const prevLabel = isVertical ? `${ariaLabel} 위로` : `${ariaLabel} 이전`;
  const nextLabel = isVertical ? `${ariaLabel} 아래로` : `${ariaLabel} 다음`;
  const prevIcon = isVertical ? "↑" : "←";
  const nextIcon = isVertical ? "↓" : "→";

  const trackColsClass =
    columns === 4
      ? "auto-cols-[calc((100cqw-3.6rem)/4)] max-nav:auto-cols-[calc((100cqw-1.2rem)/2)] max-[640px]:auto-cols-[100cqw]"
      : "auto-cols-[calc((100cqw-2.4rem)/3)] max-nav:auto-cols-[calc((100cqw-1.2rem)/2)] max-[640px]:auto-cols-[100cqw]";

  const track = (
    <div
      ref={scrollRef}
      className={cn(
        "@container w-full min-w-0 scroll-smooth scrollbar-hide",
        isVertical
          ? "max-h-[min(36rem,70vh)] snap-y snap-mandatory overflow-x-hidden overflow-y-auto max-[640px]:max-h-[min(28rem,62vh)]"
          : "snap-x snap-mandatory overflow-x-auto",
      )}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          isVertical
            ? "flex w-full min-w-0 flex-col"
            : cn(
                "grid w-max min-w-full grid-flow-col gap-[1.2rem] max-[640px]:gap-4",
                trackColsClass,
              ),
        )}
      >
        {displayArticles.map((article) => (
          <div
            key={article.slug}
            data-carousel-cell
            className={cn(
              "min-w-0 snap-start",
              isVertical && "w-full shrink-0 grow-0 basis-auto",
            )}
          >
            <ArticleCard
              article={article}
              locale={locale}
              categoryLabels={categoryLabels}
              variant={variant}
              inRail={isVertical}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (isVertical) {
    return (
      <div className="grid grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto] items-stretch gap-2">
        {showControls && (
          <button
            type="button"
            className={cn(carouselBtnClass, "w-full justify-self-stretch")}
            aria-label={prevLabel}
            disabled={!canPrev}
            onClick={() => scroll("prev")}
          >
            {prevIcon}
          </button>
        )}
        {track}
        {showControls && (
          <button
            type="button"
            className={cn(carouselBtnClass, "w-full justify-self-stretch")}
            aria-label={nextLabel}
            disabled={!canNext}
            onClick={() => scroll("next")}
          >
            {nextIcon}
          </button>
        )}
      </div>
    );
  }

  if (!isVertical && !showControls) {
    return track;
  }

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[0.65rem] max-[640px]:grid-cols-1 max-[640px]:gap-0">
      {showControls && (
        <button
          type="button"
          className={cn(carouselBtnClass, "max-[640px]:hidden")}
          aria-label={prevLabel}
          disabled={!canPrev}
          onClick={() => scroll("prev")}
        >
          {prevIcon}
        </button>
      )}
      {track}
      {showControls && (
        <button
          type="button"
          className={cn(carouselBtnClass, "max-[640px]:hidden")}
          aria-label={nextLabel}
          disabled={!canNext}
          onClick={() => scroll("next")}
        >
          {nextIcon}
        </button>
      )}
    </div>
  );
}
