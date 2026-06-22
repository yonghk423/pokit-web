"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ArticleCard } from "@/components/article-card";
import { homeSections } from "@/content/home";
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
    <div className="featured-headline">
      <div
        ref={scrollRef}
        className="featured-headline__viewport"
        aria-label={ariaLabel}
      >
        <div className="featured-headline__track">
          {articles.map((article) => (
            <div key={article.slug} className="featured-headline__slide">
              <ArticleCard article={article} variant="feature" />
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <div className="featured-headline__controls">
          <button
            type="button"
            className="featured-headline__btn featured-headline__btn--prev"
            aria-label={`${ariaLabel} 이전`}
            disabled={!canPrev}
            onClick={() => scroll("prev")}
          >
            ←
          </button>
          <button
            type="button"
            className="featured-headline__btn featured-headline__btn--next"
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
