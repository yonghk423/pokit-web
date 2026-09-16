"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useOptionalArticlePreview } from "@/components/article-preview-context";
import { DisplayHeading } from "@/components/display-heading";
import { cn, monoContainer } from "@/lib/cn";
import { splitDisplayTitle } from "@/lib/display-title";
import type { Locale } from "@/i18n/config";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import type { ArticleCardData } from "@/sanity/types";

export type HomeWorkSection = {
  id: string;
  name: string;
  title: string;
  viewAllHref: string;
  articles: ArticleCardData[];
  prevLabel: string;
  nextLabel: string;
};

type Props = {
  line1: string;
  accent: string;
  rest: string;
  viewAllLabel: string;
  viewAllHref: string;
  sections: HomeWorkSection[];
  locale: Locale;
};

const VISIBLE_DESKTOP = 3;
const MAX_ARTICLES = 12;

const navBtnClass =
  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-ink/[0.05] p-0 font-sans text-[0.8rem] font-medium leading-none text-ink/55 transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:bg-transparent disabled:text-ink/20";

function articlesWithCover(articles: ArticleCardData[]) {
  return articles.filter((article) => Boolean(article.coverImage)).slice(0, MAX_ARTICLES);
}

function HomeWorkRow({
  section,
  viewAllLabel,
  autoplayOffsetMs,
}: {
  section: HomeWorkSection;
  locale: Locale;
  viewAllLabel: string;
  autoplayOffsetMs: number;
}) {
  const preview = useOptionalArticlePreview();
  const images = articlesWithCover(section.articles);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const active =
    images.find((article) => article.slug === activeSlug) ?? null;
  const activeHeadline = active
    ? splitDisplayTitle(active.title).headline
    : null;
  const showControls = images.length > VISIBLE_DESKTOP;

  const updateControls = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateControls();
    el.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      el.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [images, updateControls]);

  const scrollByCard = useCallback((direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-work-card]");
    const step = card ? card.offsetWidth + 8 : el.clientWidth / VISIBLE_DESKTOP;
    el.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!showControls) return;
    const el = scrollRef.current;
    if (!el) return;

    let paused = false;
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    const advance = () => {
      if (paused) return;
      const track = scrollRef.current;
      if (!track) return;
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      const card = track.querySelector<HTMLElement>("[data-work-card]");
      const step = card ? card.offsetWidth + 8 : track.clientWidth / VISIBLE_DESKTOP;
      track.scrollBy({ left: step, behavior: "smooth" });
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    let intervalId = 0;
    const startId = window.setTimeout(() => {
      advance();
      intervalId = window.setInterval(advance, 5000);
    }, autoplayOffsetMs);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [showControls, images.length, autoplayOffsetMs]);

  if (images.length === 0) return null;

  return (
    <div
      id={section.id}
      className="group/row relative grid scroll-mt-28 grid-cols-[minmax(12rem,0.85fr)_minmax(0,1.55fr)] items-stretch gap-8 border-t border-ink/10 py-8 max-nav:grid-cols-1 max-nav:gap-5 max-nav:py-7"
    >
      <div className="flex min-h-0 flex-col justify-between gap-8 max-nav:gap-4">
        <div className="min-w-0">
          <p className="m-0 font-sans text-[0.92rem] font-extrabold leading-none tracking-[-0.02em] text-ink">
            {section.name}
          </p>
          <p className="m-0 mt-1.5 font-sans text-[0.78rem] leading-snug text-muted">
            {section.title}
          </p>
          <Link
            href={section.viewAllHref}
            className="mt-3 inline-flex font-sans text-[0.72rem] font-semibold tracking-[-0.01em] text-ink/55 no-underline transition-colors hover:text-ink"
          >
            {viewAllLabel}
          </Link>
        </div>

        <div
          className={cn(
            "min-h-[4.5rem] max-w-[22rem] transition-opacity duration-300",
            active ? "opacity-100" : "opacity-45",
          )}
          aria-live="polite"
        >
          {active ? (
            <>
              <p className="m-0 font-sans text-[0.95rem] font-bold leading-snug tracking-[-0.02em] text-ink">
                {activeHeadline}
              </p>
              {active.description ? (
                <p className="m-0 mt-2 font-sans text-[0.8rem] leading-relaxed text-muted">
                  {active.description}
                </p>
              ) : null}
            </>
          ) : (
            <p className="m-0 font-sans text-[0.8rem] leading-relaxed text-muted">
              {section.title}
            </p>
          )}
        </div>

        {showControls ? (
          <div className="flex items-center gap-2 max-nav:hidden">
            <button
              type="button"
              className={navBtnClass}
              aria-label={section.prevLabel}
              disabled={!canPrev}
              onClick={() => scrollByCard("prev")}
            >
              ←
            </button>
            <button
              type="button"
              className={navBtnClass}
              aria-label={section.nextLabel}
              disabled={!canNext}
              onClick={() => scrollByCard("next")}
            >
              →
            </button>
          </div>
        ) : null}
      </div>

      <div className="relative min-w-0">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-1"
          aria-label={section.name}
        >
          {images.map((article) => {
            const imageUrl = isSanityConfigured()
              ? coverImageUrl(article.coverImage, 720, 960)
              : null;
            const headline = splitDisplayTitle(article.title).headline;
            const isActive = activeSlug === article.slug;

            return (
              <button
                key={article.slug}
                type="button"
                data-work-card
                className={cn(
                  "home-work-media relative shrink-0 cursor-pointer snap-start overflow-hidden rounded-[1.15rem] border-0 bg-[#ebe7df] p-0 text-left transition-[width,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "aspect-[3/4] w-[min(13rem,calc((100%-1rem)/3))] max-nav:w-[min(11.5rem,42vw)]",
                  isActive && "z-[1] max-nav:ring-2 max-nav:ring-ink/20",
                  activeSlug && !isActive && "opacity-55",
                )}
                aria-label={headline}
                onMouseEnter={() => setActiveSlug(article.slug)}
                onMouseLeave={() => setActiveSlug(null)}
                onFocus={() => setActiveSlug(article.slug)}
                onBlur={() => setActiveSlug(null)}
                onClick={(event) => {
                  if (!preview) return;
                  const rect = event.currentTarget.getBoundingClientRect();
                preview.open({
                  article,
                  origin: {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    imageUrl,
                    blurDataURL: article.coverImageLqip ?? null,
                  },
                });
                }}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={article.imageAlt || headline}
                    fill
                    sizes="(max-width: 900px) 42vw, 180px"
                    className={cn(
                      "object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive ? "scale-[1.04]" : "scale-100",
                    )}
                    {...imageBlurProps(article.coverImageLqip)}
                  />
                ) : (
                  <span className="grid h-full place-items-center font-sans text-[0.7rem] font-extrabold tracking-[0.12em] text-indigo uppercase">
                    POKIT
                  </span>
                )}
                <span
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/55 to-transparent px-3 pb-3 pt-10 font-sans text-[0.72rem] font-semibold leading-snug text-white transition-opacity duration-300 nav:hidden",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                >
                  {headline}
                </span>
              </button>
            );
          })}
        </div>

        {showControls ? (
          <div className="mt-3 hidden items-center justify-end gap-2 max-nav:flex">
            <button
              type="button"
              className={navBtnClass}
              aria-label={section.prevLabel}
              disabled={!canPrev}
              onClick={() => scrollByCard("prev")}
            >
              ←
            </button>
            <button
              type="button"
              className={navBtnClass}
              aria-label={section.nextLabel}
              disabled={!canNext}
              onClick={() => scrollByCard("next")}
            >
              →
            </button>
          </div>
        ) : null}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden"
        aria-hidden
      >
        <div className="home-work-item-line-hover h-full w-full origin-left scale-x-0 bg-ink/35 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-x-100" />
      </div>
    </div>
  );
}

export function HomeWorkRows({
  line1,
  accent,
  rest,
  viewAllLabel,
  viewAllHref,
  sections,
  locale,
}: Props) {
  const visible = sections.filter(
    (section) => articlesWithCover(section.articles).length > 0,
  );
  if (visible.length === 0) return null;

  return (
    <section
      className="mt-20 max-nav:mt-14"
      aria-labelledby="home-work-heading"
      data-pokit-app-start
    >
      <div className={monoContainer}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 max-nav:mb-7">
          <DisplayHeading
            id="home-work-heading"
            line1={line1}
            accent={accent}
            rest={rest}
            as="h2"
            className="text-[clamp(1.85rem,4.4vw,3.25rem)]"
          />
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-sans text-[0.78rem] font-semibold tracking-[0.02em] text-white no-underline transition-colors hover:bg-indigo"
          >
            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
            {viewAllLabel}
          </Link>
        </div>

        <div>
          {visible.map((section, index) => (
            <HomeWorkRow
              key={section.id}
              section={section}
              locale={locale}
              viewAllLabel={viewAllLabel}
              autoplayOffsetMs={(index + 1) * 1000}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
