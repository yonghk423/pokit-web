import Image from "next/image";
import Link from "next/link";

import { ArticleDisplayTitle } from "@/components/article-display-title";
import { articlePath } from "@/lib/article-path";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { formatPublishedLabel } from "@/lib/format-published";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import type { ArticleCardData } from "@/sanity/types";

type Props = {
  article: ArticleCardData;
  locale: Locale;
  categoryLabels: Dictionary["categories"];
};

export function ArticleArchiveListItem({
  article,
  locale,
  categoryLabels,
}: Props) {
  const publishedLabel = formatPublishedLabel(article.publishedAt, locale);
  const href = articlePath(locale, article.slug);
  const imageUrl = isSanityConfigured()
    ? coverImageUrl(article.coverImage, 640, 480)
    : null;
  const category =
    categoryLabels[article.category as keyof typeof categoryLabels] ??
    article.category;

  return (
    <li className="border-b border-ink/10 last:border-b-0">
      <Link
        href={href}
        className="group/list grid grid-cols-[minmax(0,1fr)_minmax(7rem,11rem)] items-start gap-x-6 gap-y-3 py-7 no-underline transition-colors max-archive:grid-cols-1"
      >
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="m-0 font-sans text-[0.72rem] leading-none tracking-[0.01em] text-muted">
              {category}
              {publishedLabel ? ` · ${publishedLabel}` : null}
            </p>
            <span
              className="mt-[-0.15rem] flex size-6 shrink-0 items-center justify-center font-sans text-[1.15rem] font-light leading-none text-ink/40 transition-colors group-hover/list:text-ink"
              aria-hidden
            >
              +
            </span>
          </div>
          {article.kicker ? (
            <p className="m-0 mt-2 label-caps text-green">{article.kicker}</p>
          ) : null}
          <ArticleDisplayTitle
            title={article.title}
            locale={locale}
            category={article.category}
            description={article.description}
            as="h2"
            className="m-0 mt-3 text-[clamp(1.15rem,2.2vw,1.45rem)] font-extrabold leading-[1.22] tracking-[-0.025em] text-ink"
          />
          {article.description ? (
            <p className="mt-3 mb-0 max-w-[42rem] line-clamp-2 font-sans text-[0.88rem] leading-[1.6] text-muted">
              {article.description}
            </p>
          ) : null}
        </div>
        {imageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[0.85rem] bg-[#ebe7df] max-archive:max-w-[16rem]">
            <Image
              src={imageUrl}
              alt={article.imageAlt || article.title}
              fill
              sizes="(max-width: 560px) 100vw, 176px"
              className="object-cover transition-transform duration-500 group-hover/list:scale-[1.03]"
              {...imageBlurProps(article.coverImageLqip)}
            />
          </div>
        ) : null}
      </Link>
    </li>
  );
}
