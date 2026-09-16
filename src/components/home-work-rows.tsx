"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

function articlesWithCover(articles: ArticleCardData[]) {
  return articles.filter((article) => Boolean(article.coverImage)).slice(0, 3);
}

function HomeWorkRow({
  section,
}: {
  section: HomeWorkSection;
  locale: Locale;
}) {
  const preview = useOptionalArticlePreview();
  const images = articlesWithCover(section.articles);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active =
    images.find((article) => article.slug === activeSlug) ?? null;
  const activeHeadline = active
    ? splitDisplayTitle(active.title).headline
    : null;

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
      </div>

      <div className="flex min-w-0 items-stretch justify-end gap-2 max-nav:justify-start">
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
              className={cn(
                "home-work-media relative min-w-0 cursor-pointer overflow-hidden rounded-[1.15rem] border-0 bg-[#ebe7df] p-0 text-left transition-[flex-grow,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "aspect-[3/4] max-w-[13rem] max-nav:max-w-none",
                isActive ? "z-[1] flex-[1.35] max-nav:ring-2 max-nav:ring-ink/20" : "flex-1",
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
                  },
                });
              }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={article.imageAlt || headline}
                  fill
                  sizes="(max-width: 900px) 33vw, 180px"
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
    <section className="mt-20 max-nav:mt-14" aria-labelledby="home-work-heading">
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
          {visible.map((section) => (
            <HomeWorkRow key={section.id} section={section} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
