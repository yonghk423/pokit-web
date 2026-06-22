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
    <li className="articles-archive__list-item">
      <article className="articles-archive__list-row">
        <div className="articles-archive__list-meta">
          {publishedLabel && (
            <p className="articles-archive__list-date">
              <time dateTime={article.publishedAt}>{publishedLabel}</time>
            </p>
          )}
          {article.kicker && (
            <p className="articles-archive__list-kicker">{article.kicker}</p>
          )}
        </div>
        <div className="articles-archive__list-content">
          <h2 className="articles-archive__list-title">
            <Link href={articlePath(article.slug)}>{article.title}</Link>
          </h2>
          {article.description && (
            <p className="articles-archive__list-desc">{article.description}</p>
          )}
        </div>
      </article>
    </li>
  );
}
