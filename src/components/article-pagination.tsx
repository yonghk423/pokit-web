import Link from "next/link";

import { articlesArchiveHref } from "@/sanity/lib/articles";

type Props = {
  page: number;
  totalPages: number;
  category?: string;
  q?: string;
};

export function ArticlePagination({ page, totalPages, category, q }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="article-pagination" aria-label="이야기 목록 페이지">
      {page > 1 ? (
        <Link
          href={articlesArchiveHref(page - 1, category, q)}
          className="article-pagination__nav"
        >
          ← 이전
        </Link>
      ) : (
        <span className="article-pagination__nav article-pagination__nav--disabled">
          ← 이전
        </span>
      )}

      <ol className="article-pagination__pages">
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            {pageNumber === page ? (
              <span
                className="article-pagination__page article-pagination__page--current"
                aria-current="page"
              >
                {pageNumber}
              </span>
            ) : (
              <Link
                href={articlesArchiveHref(pageNumber, category, q)}
                className="article-pagination__page"
              >
                {pageNumber}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {page < totalPages ? (
        <Link
          href={articlesArchiveHref(page + 1, category, q)}
          className="article-pagination__nav"
        >
          다음 →
        </Link>
      ) : (
        <span className="article-pagination__nav article-pagination__nav--disabled">
          다음 →
        </span>
      )}
    </nav>
  );
}
