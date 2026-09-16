import Image from "next/image";
import Link from "next/link";

import { DisplayHeading } from "@/components/display-heading";
import { articlePath } from "@/lib/article-path";
import { cn, monoContainer } from "@/lib/cn";
import { splitDisplayTitle } from "@/lib/display-title";
import { formatPublishedWeekday } from "@/lib/format-published";
import type { Locale } from "@/i18n/config";
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
  viewAllLabel: string;
  viewAllHref: string;
  heroArticles: ArticleCardData[];
  feedArticles: ArticleCardData[];
  categoryLabels: Dictionary["categories"];
};

function FeedCard({
  article,
  locale,
  categoryLabels,
}: {
  article: ArticleCardData;
  locale: Locale;
  categoryLabels: Dictionary["categories"];
}) {
  const href = articlePath(locale, article.slug);
  const headline = splitDisplayTitle(article.title).headline;
  const imageUrl = isSanityConfigured()
    ? coverImageUrl(article.coverImage, 640, 640)
    : null;
  const category =
    categoryLabels[article.category as keyof typeof categoryLabels] ??
    article.category;
  const dateLabel = formatPublishedWeekday(article.publishedAt, locale);

  return (
    <Link
      href={href}
      className="group/feed grid grid-cols-[minmax(0,1fr)_5.5rem] gap-3 rounded-[1rem] px-2 py-3 no-underline transition-colors hover:bg-ink/[0.035]"
    >
      <div className="min-w-0">
        <p className="m-0 font-sans text-[0.68rem] tracking-[0.04em] text-muted">
          {category}
          {dateLabel ? ` · ${dateLabel}` : null}
        </p>
        <p className="m-0 mt-1.5 font-sans text-[0.9rem] font-bold leading-snug tracking-[-0.02em] text-ink">
          {headline}
        </p>
        {article.description ? (
          <p className="m-0 mt-1.5 line-clamp-2 font-sans text-[0.75rem] leading-relaxed text-muted">
            {article.description}
          </p>
        ) : null}
      </div>
      <div className="relative aspect-square overflow-hidden rounded-[0.85rem] bg-[#ebe7df]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.imageAlt || headline}
            fill
            sizes="88px"
            className="object-cover transition-transform duration-500 group-hover/feed:scale-[1.06]"
            {...imageBlurProps(article.coverImageLqip)}
          />
        ) : null}
      </div>
    </Link>
  );
}

export function HomeHero({
  locale,
  line1,
  accent,
  rest,
  feedTitle,
  viewAllLabel,
  viewAllHref,
  heroArticles,
  feedArticles,
  categoryLabels,
}: Props) {
  const hero = heroArticles.find((article) => article.coverImage) ?? heroArticles[0];
  const heroUrl =
    hero && isSanityConfigured()
      ? coverImageUrl(hero.coverImage, 1600, 1200)
      : null;
  const heroHref = hero ? articlePath(locale, hero.slug) : viewAllHref;
  const heroHeadline = hero
    ? splitDisplayTitle(hero.title).headline
    : null;
  const feed = feedArticles.slice(0, 6);
  const dots = Math.min(Math.max(feed.length, 8), 24);

  return (
    <section className="relative overflow-hidden pt-10 max-nav:pt-8">
      <div className={monoContainer}>
        <div className="home-hero-rise">
          <DisplayHeading line1={line1} accent={accent} rest={rest} as="h1" />
        </div>

        <div
          className="mt-8 flex h-1.5 gap-px overflow-hidden rounded-full max-nav:mt-6"
          aria-hidden
        >
          {Array.from({ length: dots }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-full flex-1 rounded-[1px]",
                index === 0 ? "bg-ink" : "bg-ink/12",
              )}
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.75fr)] gap-4 max-nav:mt-5 max-nav:grid-cols-1">
          <Link
            href={heroHref}
            className="home-hero-rise home-hero-rise-delay group/hero relative block aspect-[16/11] overflow-hidden rounded-[1.35rem] bg-[#ebe7df] no-underline max-nav:aspect-[4/3]"
            aria-label={heroHeadline ?? feedTitle}
          >
            {heroUrl ? (
              <Image
                src={heroUrl}
                alt={hero?.imageAlt || heroHeadline || ""}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 70vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/hero:scale-[1.03]"
                {...imageBlurProps(hero?.coverImageLqip)}
              />
            ) : (
              <span className="grid h-full place-items-center font-sans text-sm font-extrabold tracking-[0.14em] text-indigo uppercase">
                POKIT
              </span>
            )}
            {heroHeadline ? (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent px-6 pb-6 pt-20">
                <span className="block font-sans text-[clamp(1.15rem,2.4vw,1.55rem)] font-extrabold leading-snug tracking-[-0.03em] text-white">
                  {heroHeadline}
                </span>
              </span>
            ) : null}
          </Link>

          <aside className="relative flex max-h-[min(34rem,70vh)] flex-col overflow-hidden rounded-[1.35rem] border border-ink/10 bg-white/70 max-nav:max-h-none">
            <div className="flex items-center justify-between gap-3 border-b border-ink/8 px-4 py-3">
              <h2 className="m-0 font-sans text-[1rem] font-extrabold tracking-[-0.02em]">
                {feedTitle}
              </h2>
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 font-sans text-[0.72rem] font-semibold text-white no-underline hover:bg-indigo"
              >
                <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                {viewAllLabel}
              </Link>
            </div>
            <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-2 py-1">
              {feed.map((article) => (
                <FeedCard
                  key={article.slug}
                  article={article}
                  locale={locale}
                  categoryLabels={categoryLabels}
                />
              ))}
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent max-nav:hidden"
              aria-hidden
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
