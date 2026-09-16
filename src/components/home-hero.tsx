"use client";

import Image from "next/image";

import { useOptionalArticlePreview } from "@/components/article-preview-context";
import { DisplayHeading } from "@/components/display-heading";
import { cn, monoContainer } from "@/lib/cn";
import { splitDisplayTitle } from "@/lib/display-title";
import type { Locale } from "@/i18n/config";
import { localeToIntl } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import type { ArticleCardData } from "@/sanity/types";

type Props = {
  locale: Locale;
  line1: string;
  accent: string;
  rest: string;
  feedTitle: string;
  heroArticles: ArticleCardData[];
  feedArticles: ArticleCardData[];
  categoryLabels: Dictionary["categories"];
};

function formatFeedDate(iso: string | null | undefined, locale: Locale) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(localeToIntl(locale), {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function openPreviewFromElement(
  preview: ReturnType<typeof useOptionalArticlePreview>,
  article: ArticleCardData,
  el: HTMLElement,
  imageUrl: string | null,
) {
  if (!preview) return;
  const rect = el.getBoundingClientRect();
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
}

/** Oimachi `.posts_item-link.is-home` equivalent */
function FeedCard({
  article,
  locale,
  categoryLabels,
}: {
  article: ArticleCardData;
  locale: Locale;
  categoryLabels: Dictionary["categories"];
}) {
  const preview = useOptionalArticlePreview();
  const headline = splitDisplayTitle(article.title).headline;
  const imageUrl = isSanityConfigured()
    ? coverImageUrl(article.coverImage, 960, 640)
    : null;
  const category =
    categoryLabels[article.category as keyof typeof categoryLabels] ??
    article.category;
  const dateLabel = formatFeedDate(article.publishedAt, locale);

  return (
    <button
      type="button"
      className="group/feed relative block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
      onClick={(event) =>
        openPreviewFromElement(preview, article, event.currentTarget, imageUrl)
      }
    >
      <div className="relative pr-7">
        <p className="m-0 flex flex-wrap items-center gap-x-1.5 font-sans text-[0.7rem] leading-none text-muted">
          <span>{category}</span>
          {dateLabel ? (
            <>
              <span aria-hidden>·</span>
              <span>{dateLabel}</span>
            </>
          ) : null}
        </p>
        <p className="m-0 mt-2 font-sans text-[0.95rem] font-bold leading-snug tracking-[-0.02em] text-ink">
          {headline}
        </p>
        {article.description ? (
          <p className="m-0 mt-1.5 line-clamp-2 font-sans text-[0.75rem] leading-[1.45] text-muted">
            {article.description}
          </p>
        ) : null}
        <span
          className="absolute top-0 right-0 flex size-5 items-center justify-center font-sans text-[1.1rem] font-light leading-none text-ink/40 transition-colors group-hover/feed:text-ink"
          aria-hidden
        >
          +
        </span>
      </div>

      {imageUrl ? (
        <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-[0.3rem] bg-[#ebe7df]">
          <Image
            src={imageUrl}
            alt={article.imageAlt || headline}
            fill
            sizes="(max-width: 900px) 100vw, 22vw"
            className="object-cover transition-transform duration-500 group-hover/feed:scale-[1.03]"
            {...imageBlurProps(article.coverImageLqip)}
          />
        </div>
      ) : null}
    </button>
  );
}

export function HomeHero({
  locale,
  line1,
  accent,
  rest,
  feedTitle,
  heroArticles,
  feedArticles,
  categoryLabels,
}: Props) {
  const preview = useOptionalArticlePreview();
  const hero = heroArticles.find((article) => article.coverImage) ?? heroArticles[0];
  const heroUrl =
    hero && isSanityConfigured()
      ? coverImageUrl(hero.coverImage, 2000, 1125)
      : null;
  const heroHeadline = hero
    ? splitDisplayTitle(hero.title).headline
    : null;
  const feed = feedArticles.slice(0, 6);

  return (
    <section className="relative pt-8 max-nav:pt-6">
      <div className={monoContainer}>
        {/* hero title */}
        <div className="home-hero-rise">
          <DisplayHeading
            line1={line1}
            accent={accent}
            rest={rest}
            as="h1"
            className="max-w-[52rem]"
          />
        </div>

        {/* Oimachi `.hero_bottom`: height calc(100svh - 18rem), flex row, gap 0.4rem */}
        <div className="mt-3 flex h-[calc(100svh-18rem)] gap-[0.4rem] max-nav:mt-4 max-nav:h-auto max-nav:flex-col max-nav:gap-8">
          {/* `.hero_graphic` */}
          {hero ? (
            <button
              type="button"
              className="home-hero-rise home-hero-rise-delay group/hero relative h-full min-w-0 flex-1 cursor-pointer overflow-hidden rounded-[0.3rem] border-0 bg-[#ebe7df] p-0 text-left max-nav:aspect-square max-nav:h-auto max-nav:w-full"
              aria-label={heroHeadline ?? feedTitle}
              onClick={(event) =>
                openPreviewFromElement(preview, hero, event.currentTarget, heroUrl)
              }
            >
              {heroUrl ? (
                <Image
                  src={heroUrl}
                  alt={hero.imageAlt || heroHeadline || ""}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 72vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/hero:scale-[1.015]"
                  {...imageBlurProps(hero.coverImageLqip)}
                />
              ) : (
                <span className="grid h-full place-items-center font-sans text-sm font-extrabold tracking-[0.14em] text-indigo uppercase">
                  POKIT
                </span>
              )}
            </button>
          ) : (
            <div className="h-full min-w-0 flex-1 rounded-[0.3rem] bg-[#ebe7df] max-nav:aspect-square max-nav:h-auto" />
          )}

          {/* `.hero_feed` — fixed width, same height, internal scroll */}
          <aside
            className={cn(
              "relative flex h-full w-[21rem] shrink-0 flex-col overflow-hidden max-nav:h-auto max-nav:w-full max-nav:min-h-[20rem]",
            )}
            aria-label={feedTitle}
          >
            <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
              <h2 className="m-0 font-sans text-[1.05rem] font-extrabold tracking-[-0.02em] text-ink">
                {feedTitle}
              </h2>
            </div>

            <div className="relative min-h-0 flex-1">
              <div className="scrollbar-hide absolute inset-0 overflow-y-auto max-nav:relative max-nav:inset-auto max-nav:overflow-visible">
                <div className="flex flex-col gap-5 pb-8 max-nav:pb-0">
                  {feed.map((article) => (
                    <FeedCard
                      key={article.slug}
                      article={article}
                      locale={locale}
                      categoryLabels={categoryLabels}
                    />
                  ))}
                </div>
              </div>

              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[var(--color-paper)] to-transparent max-nav:hidden"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--color-paper)] to-transparent max-nav:hidden"
                aria-hidden
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
