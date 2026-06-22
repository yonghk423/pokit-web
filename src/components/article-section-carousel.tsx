"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ArticleCard } from "@/components/article-card";
import type { ArticleCardData } from "@/sanity/types";

type Variant = "vertical" | "compact";

type Props = {
  articles: ArticleCardData[];
  variant?: Variant;
  layout?: "rail" | "grid";
  columns?: 3 | 4;
  ariaLabel: string;
};

export function ArticleSectionCarousel({
  articles,
  variant = "vertical",
  layout = "grid",
  columns = 3,
  ariaLabel,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const isVertical = layout === "rail";

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
  }, [articles, columns, updateControls]);

  const scroll = (direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const sign = direction === "next" ? 1 : -1;

    if (isVertical) {
      const first = el.querySelector<HTMLElement>(".section-carousel__cell");
      const step = first?.offsetHeight ?? el.clientHeight * 0.85;
      el.scrollBy({ top: sign * step, behavior: "smooth" });
      return;
    }

    el.scrollBy({ left: sign * el.clientWidth, behavior: "smooth" });
  };

  if (articles.length === 0) {
    return null;
  }

  const showControls = articles.length > (isVertical ? 1 : columns);

  const prevLabel = isVertical ? `${ariaLabel} 위로` : `${ariaLabel} 이전`;
  const nextLabel = isVertical ? `${ariaLabel} 아래로` : `${ariaLabel} 다음`;
  const prevIcon = isVertical ? "↑" : "←";
  const nextIcon = isVertical ? "↓" : "→";

  const gridColsClass =
    columns === 4 ? "section-carousel__track--4" : "section-carousel__track--3";

  const track = (
    <div
      ref={scrollRef}
      className={`section-carousel__viewport${isVertical ? " section-carousel__viewport--vertical" : ""}`}
      aria-label={ariaLabel}
    >
      <div className={`section-carousel__track ${gridColsClass}`}>
        {articles.map((article) => (
          <div key={article.slug} className="section-carousel__cell">
            <ArticleCard article={article} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  );

  if (isVertical) {
    return (
      <div className="section-carousel section-carousel--rail section-carousel--vertical">
        {showControls && (
          <button
            type="button"
            className="section-carousel__btn section-carousel__btn--prev"
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
            className="section-carousel__btn section-carousel__btn--next"
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

  return (
    <div className="section-carousel section-carousel--grid">
      {showControls && (
        <button
          type="button"
          className="section-carousel__btn section-carousel__btn--prev"
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
          className="section-carousel__btn section-carousel__btn--next"
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
