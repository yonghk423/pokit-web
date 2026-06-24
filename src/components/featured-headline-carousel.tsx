"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ArticleCard } from "@/components/article-card";
import { homeSections } from "@/content/home";
import { cn } from "@/lib/cn";
import type { ArticleCardData } from "@/sanity/types";

type Props = {
  articles: ArticleCardData[];
  ariaLabel?: string;
};

export function FeaturedHeadlineCarousel({
  articles,
  ariaLabel = homeSections.affairs.title,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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
  }, [articles, updateControls]);

  const scroll = (direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    el.scrollBy({
      left: direction === "next" ? el.clientWidth : -el.clientWidth,
      behavior: "smooth",
    });
  };

  if (articles.length === 0) {
    return null;
  }

  const showControls = articles.length > 1;

  return (
    <div className="relative min-w-0">
      <div
        ref={scrollRef}
        className="@container w-full min-w-0 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        aria-label={ariaLabel}
      >
        <div className="flex">
          {articles.map((article) => (
            <div
              key={article.slug}
              className="min-w-0 w-[100cqw] max-w-[100cqw] shrink-0 grow-0 basis-[100cqw] snap-start"
            >
              <ArticleCard article={article} variant="feature" />
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-2 flex aspect-[16/10] items-center justify-between px-[0.65rem]">
          <button
            type="button"
            className="pointer-events-auto size-[2.35rem] cursor-pointer border border-white/55 bg-ink/42 font-sans text-base leading-none text-white backdrop-blur-[2px] hover:bg-ink/62 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label={`${ariaLabel} 이전`}
            disabled={!canPrev}
            onClick={() => scroll("prev")}
          >
            ←
          </button>
          <button
            type="button"
            className="pointer-events-auto size-[2.35rem] cursor-pointer border border-white/55 bg-ink/42 font-sans text-base leading-none text-white backdrop-blur-[2px] hover:bg-ink/62 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label={`${ariaLabel} 다음`}
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
