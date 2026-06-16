import Image from "next/image";
import Link from "next/link";

import { isSanityConfigured } from "@/sanity/env";
import { urlForImage } from "@/sanity/image";
import type { ArticleCardData } from "@/sanity/types";

type Props = {
  article: ArticleCardData;
  variant?: "feature" | "vertical" | "compact" | "mini";
  hideImage?: boolean;
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
  variant = "vertical",
  hideImage = false,
}: Props) {
  const { w, h } = imageSizes[variant];
  const imageUrl =
    isSanityConfigured() && article.coverImage
      ? urlForImage(article.coverImage).width(w).height(h).fit("crop").url()
      : null;

  return (
    <article className={`article-card article-card--${variant}`}>
      {!hideImage && (
        <figure className="article-card__figure">
          {imageUrl ? (
            <Link
              href={`/articles/${article.slug}`}
              className="article-card__media"
              aria-label={article.title}
            >
              <Image
                src={imageUrl}
                alt={article.imageAlt}
                width={w}
                height={h}
                sizes={
                  variant === "feature"
                    ? "(min-width: 1024px) 66vw, 100vw"
                    : variant === "compact"
                      ? "140px"
                      : "(min-width: 768px) 33vw, 100vw"
                }
              />
            </Link>
          ) : (
            <Link
              href={`/articles/${article.slug}`}
              className="article-card__media article-card__media--placeholder"
              aria-label={article.title}
            >
              <span>{article.category}</span>
            </Link>
          )}
        </figure>
      )}
      <div className="article-card__body">
        {article.kicker && (
          <p className="article-card__kicker">{article.kicker}</p>
        )}
        <h3 className="article-card__title">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        {article.description && variant === "feature" && (
          <p className="article-card__desc">{article.description}</p>
        )}
      </div>
    </article>
  );
}
