import Image from "next/image";
import Link from "next/link";

import { articlePath } from "@/lib/article-path";
import { cn } from "@/lib/cn";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { formatPublishedLabel, formatPublishedWeekday } from "@/lib/format-published";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import type { ArticleCardData } from "@/sanity/types";

type Props = {
  article: ArticleCardData;
  locale: Locale;
  categoryLabels: Dictionary["categories"];
  variant?: "feature" | "vertical" | "compact" | "mini";
  hideImage?: boolean;
  inRail?: boolean;
};

const imageSizes: Record<NonNullable<Props["variant"]>, { w: number; h: number }> =
{
  feature: { w: 1400, h: 930 },
  vertical: { w: 900, h: 700 },
  compact: { w: 700, h: 700 },
  mini: { w: 600, h: 450 },
};

export function ArticleCard({
  article,
  locale,
  categoryLabels,
  variant = "vertical",
  hideImage = false,
  inRail = false,
}: Props) {
  const { w, h } = imageSizes[variant];
  const publishedLabel =
    variant === "compact"
      ? formatPublishedWeekday(article.publishedAt, locale)
      : formatPublishedLabel(article.publishedAt, locale);
  const imageUrl = isSanityConfigured()
    ? coverImageUrl(article.coverImage, w, h)
    : null;

  const mediaClass = cn(
    "group/media block overflow-hidden bg-wash",
    variant === "feature" && "aspect-[16/10]",
    variant === "vertical" && "aspect-[4/3]",
    variant === "compact" &&
    "aspect-square max-[640px]:aspect-[4/3]",
    !imageUrl &&
    "grid place-items-center font-sans text-[0.72rem] font-black tracking-[0.1em] text-green uppercase",
  );

  return (
    <article
      className={cn(
        "min-w-0",
        variant === "compact" &&
        "grid grid-cols-[minmax(0,1fr)_8.6rem] gap-4 max-[640px]:grid-cols-1",
        inRail && "border-b border-fine-line py-4 first:pt-0",
      )}
    >
      {!hideImage && (
        <figure
          className={cn(
            "m-0",
            variant === "compact" &&
            "col-start-2 row-start-1 max-[640px]:col-auto max-[640px]:row-auto",
          )}
        >
          {imageUrl ? (
            <Link
              href={articlePath(locale, article.slug)}
              className={mediaClass}
              aria-label={article.title}
            >
              <Image
                src={imageUrl}
                alt={article.imageAlt}
                width={w}
                height={h}
                className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover/media:scale-[1.025]"
                sizes={
                  variant === "feature"
                    ? "(min-width: 1024px) 66vw, 100vw"
                    : variant === "compact"
                      ? "140px"
                      : "(min-width: 768px) 33vw, 100vw"
                }
                {...imageBlurProps(article.coverImageLqip)}
              />
            </Link>
          ) : (
            <Link
              href={articlePath(locale, article.slug)}
              className={mediaClass}
              aria-label={article.title}
            >
              <span>{categoryLabels[article.category as keyof Dictionary["categories"]] ?? article.category}</span>
            </Link>
          )}
        </figure>
      )}
      <div
        className={cn(
          "mt-3",
          variant === "compact" &&
          "col-start-1 row-start-1 mt-0 max-[640px]:col-auto max-[640px]:row-auto",
        )}
      >
        {publishedLabel && (
          <p className="m-0 mb-[0.35rem] font-sans text-[0.72rem] font-bold tracking-[0.02em] text-muted">
            <time dateTime={article.publishedAt}>{publishedLabel}</time>
          </p>
        )}
        {article.kicker && (
          <p className="m-0 font-sans text-[0.72rem] leading-tight font-extrabold tracking-[0.08em] text-green uppercase">
            {article.kicker}
          </p>
        )}
        <h3
          className={cn(
            "m-0 mt-[0.28rem] font-bold tracking-[-0.025em]",
            variant === "feature" &&
            "text-[clamp(1.65rem,3vw,2.5rem)] leading-[1.06] tracking-[-0.035em] max-[640px]:text-[clamp(1.35rem,5.5vw,1.85rem)] max-[640px]:leading-[1.1]",
            variant === "compact" && "text-[1.05rem] leading-[1.25]",
            variant === "mini" && "text-[0.98rem]",
            (variant === "vertical" || !variant) &&
            "text-[1.24rem] leading-[1.18]",
            "[&_a:hover]:underline [&_a:hover]:decoration-[0.06em] [&_a:hover]:underline-offset-[0.14em]",
          )}
        >
          <Link href={articlePath(locale, article.slug)}>{article.title}</Link>
        </h3>
        {article.description && variant === "feature" && (
          <p className="mt-[0.7rem] mb-0 max-w-[43rem] text-base leading-[1.55] text-muted max-[640px]:text-[0.92rem] max-[640px]:leading-normal">
            {article.description}
          </p>
        )}
      </div>
    </article>
  );
}
