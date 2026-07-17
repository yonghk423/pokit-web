"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ArticleCard } from "@/components/article-card";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
import { shuffleArticlesKeepingNewest } from "@/lib/shuffle-articles";
import { useCarouselAutoplay } from "@/lib/use-carousel-autoplay";
import type { ArticleCardData } from "@/sanity/types";

type Props = {
  articles: ArticleCardData[];
  locale: Locale;
  categoryLabels: Dictionary["categories"];
  ariaLabel: string;
  prevAria: string;
  nextAria: string;
  shuffle?: boolean;
  autoPlay?: boolean;
};

const carouselBtnClass =
  "pointer-events-auto size-10 cursor-pointer border-2 border-black bg-panel font-sans text-base font-bold leading-none text-ink hover:bg-wash hover:brutal-shadow disabled:cursor-not-allowed disabled:bg-beige disabled:text-muted";

export function FeaturedHeadlineCarousel({
  articles,
  locale,
  categoryLabels,
  ariaLabel,
  prevAria,
  nextAria,
  shuffle = false,
  autoPlay = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [displayArticles, setDisplayArticles] = useState(articles);

  useEffect(() => {
    setDisplayArticles(shuffle ? shuffleArticlesKeepingNewest(articles) : articles);
  }, [articles, shuffle]);

  const updateControls = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

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
  }, [displayArticles.length, updateControls]);

  useCarouselAutoplay(scrollRef, {
    enabled: autoPlay,
    itemCount: displayArticles.length,
    direction: "horizontal",
  });

  const scroll = (direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const offset = direction === "prev" ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  const showControls = displayArticles.length > 1;

  return (
    <div className="relative min-w-0">
      <div
        ref={scrollRef}
        className="@container w-full min-w-0 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        aria-label={ariaLabel}
      >
        <div className="flex">
          {displayArticles.map((article) => (
            <div
              key={article.slug}
              className="min-w-0 w-[100cqw] max-w-[100cqw] shrink-0 grow-0 basis-[100cqw] snap-start"
            >
              <ArticleCard
                article={article}
                locale={locale}
                categoryLabels={categoryLabels}
                variant="feature"
              />
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-2 flex aspect-[16/10] items-center justify-between px-3">
          <button
            type="button"
            className={carouselBtnClass}
            aria-label={prevAria}
            disabled={!canPrev}
            onClick={() => scroll("prev")}
          >
            ←
          </button>
          <button
            type="button"
            className={carouselBtnClass}
            aria-label={nextAria}
            disabled={!canNext}
            onClick={() => scroll("next")}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
