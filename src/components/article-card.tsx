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
  const href = articlePath(locale, article.slug);
  const publishedLabel =
    variant === "compact"
      ? formatPublishedWeekday(article.publishedAt, locale)
      : formatPublishedLabel(article.publishedAt, locale);
  const imageUrl = isSanityConfigured()
    ? coverImageUrl(article.coverImage, w, h)
    : null;

  const mediaClass = cn(
    "overflow-hidden bg-beige",
    variant === "feature" && "aspect-[16/10]",
    variant === "vertical" && "aspect-[4/3] border-2 border-black",
    variant === "compact" &&
    "aspect-square border-2 border-black max-[640px]:aspect-[4/3]",
    !imageUrl &&
    "grid place-items-center font-sans text-[0.72rem] font-extrabold tracking-[0.1em] text-indigo uppercase",
  );

  return (
    <article
      className={cn(
        "min-w-0",
        variant === "compact" &&
        "grid grid-cols-[minmax(0,1fr)_8.6rem] gap-4 max-[640px]:grid-cols-1",
        variant === "feature" && "border-2 border-black bg-panel",
        inRail && "border-b-2 border-black py-4 first:pt-0",
      )}
    >
      <Link
        href={href}
        className={cn(
          "group/card block transition-colors hover:text-ink",
          variant === "feature" && "hover:bg-wash",
          variant === "compact" && "contents",
        )}
        aria-label={article.title}
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
              <div className={mediaClass}>
                <Image
                  src={imageUrl}
                  alt={article.imageAlt}
                  width={w}
                  height={h}
                  className="h-full w-full object-cover"
                  sizes={
                    variant === "feature"
                      ? "(min-width: 1024px) 66vw, 100vw"
                      : variant === "compact"
                        ? "140px"
                        : "(min-width: 768px) 33vw, 100vw"
                  }
                  {...imageBlurProps(article.coverImageLqip)}
                />
              </div>
            ) : (
              <div className={mediaClass}>
                <span>
                  {categoryLabels[article.category as keyof Dictionary["categories"]] ??
                    article.category}
                </span>
              </div>
            )}
          </figure>
        )}
        <div
          className={cn(
            variant === "feature" ? "p-4 pt-3" : "mt-3",
            variant === "compact" &&
            "col-start-1 row-start-1 mt-0 max-[640px]:col-auto max-[640px]:row-auto",
          )}
        >
          {publishedLabel && (
            <p className="m-0 mb-[0.35rem] label-caps text-muted">
              <time dateTime={article.publishedAt}>{publishedLabel}</time>
            </p>
          )}
          {article.kicker && (
            <p className="m-0 label-caps text-green">
              {article.kicker}
            </p>
          )}
          <h3
            className={cn(
              "m-0 mt-[0.28rem] font-bold tracking-[-0.025em] group-hover/card:text-indigo",
              variant === "feature" &&
              "text-[clamp(1.65rem,3vw,2.5rem)] leading-[1.06] tracking-[-0.035em] max-[640px]:text-[clamp(1.35rem,5.5vw,1.85rem)] max-[640px]:leading-[1.1]",
              variant === "compact" && "text-[1.05rem] leading-[1.25]",
              variant === "mini" && "text-[0.98rem]",
              (variant === "vertical" || !variant) &&
              "text-[1.24rem] leading-[1.18]",
            )}
          >
            {article.title}
          </h3>
          {article.description && variant === "feature" && (
            <p className="mt-[0.7rem] mb-0 max-w-[43rem] text-base leading-[1.55] text-muted max-[640px]:text-[0.92rem] max-[640px]:leading-normal">
              {article.description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
