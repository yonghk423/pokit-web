import Link from "next/link";

import { articlePath } from "@/lib/article-path";
import { formatPublishedLabel } from "@/lib/format-published";
import type { ArticleCardData } from "@/sanity/types";

type Props = {
  article: ArticleCardData;
};

export function ArticleArchiveListItem({ article }: Props) {
  const publishedLabel = formatPublishedLabel(article.publishedAt);

  return (
    <li className="border-b border-fine-line">
      <article className="grid grid-cols-[minmax(7.5rem,9.5rem)_minmax(0,1fr)] gap-x-7 gap-y-[0.45rem] py-[1.15rem] max-archive:grid-cols-1">
        <div className="flex flex-col gap-[0.35rem]">
          {publishedLabel && (
            <p className="m-0 font-sans text-[0.72rem] leading-snug font-bold text-muted">
              <time dateTime={article.publishedAt}>{publishedLabel}</time>
            </p>
          )}
          {article.kicker && (
            <p className="m-0 font-sans text-[0.72rem] font-extrabold tracking-[0.08em] text-green uppercase">
              {article.kicker}
            </p>
          )}
        </div>
        <div>
          <h2 className="m-0 text-[clamp(1.15rem,2.2vw,1.45rem)] leading-[1.2] font-bold tracking-[-0.025em] [&_a:hover]:text-green">
            <Link href={articlePath(article.slug)}>{article.title}</Link>
          </h2>
          {article.description && (
            <p className="mt-[0.55rem] mb-0 max-w-[46rem] font-sans text-[0.92rem] leading-[1.55] text-muted">
              {article.description}
            </p>
          )}
        </div>
      </article>
    </li>
  );
}
