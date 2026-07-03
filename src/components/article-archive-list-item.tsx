import Link from "next/link";

import { articlePath } from "@/lib/article-path";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { formatPublishedLabel } from "@/lib/format-published";
import type { ArticleCardData } from "@/sanity/types";

type Props = {
  article: ArticleCardData;
  locale: Locale;
};

export function ArticleArchiveListItem({ article, locale }: Props) {
  const publishedLabel = formatPublishedLabel(article.publishedAt, locale);

  return (
    <li className="border-b-2 border-black last:border-b-0">
      <article className="grid grid-cols-[minmax(7.5rem,9.5rem)_minmax(0,1fr)] gap-x-8 gap-y-2 py-6 hover:bg-wash max-archive:grid-cols-1">
        <div className="flex flex-col gap-2">
          {publishedLabel && (
            <p className="m-0 label-caps text-muted">
              <time dateTime={article.publishedAt}>{publishedLabel}</time>
            </p>
          )}
          {article.kicker && (
            <p className="m-0 label-caps text-green">
              {article.kicker}
            </p>
          )}
        </div>
        <div>
          <h2 className="m-0 text-[clamp(1.15rem,2.2vw,1.45rem)] font-bold leading-[1.25] tracking-[-0.025em] [&_a:hover]:text-indigo">
            <Link href={articlePath(locale, article.slug)}>{article.title}</Link>
          </h2>
          {article.description && (
            <p className="mt-3 mb-0 max-w-[46rem] font-sans text-[0.92rem] leading-[1.6] text-muted">
              {article.description}
            </p>
          )}
        </div>
      </article>
    </li>
  );
}
