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
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 border-t border-fine-line pt-6 font-sans text-[0.88rem]"
      aria-label="이야기 목록 페이지"
    >
      {page > 1 ? (
        <Link
          href={articlesArchiveHref(page - 1, category, q)}
          className="text-ink underline-offset-[0.14em] hover:underline"
        >
          ← 이전
        </Link>
      ) : (
        <span className="pointer-events-none text-muted">← 이전</span>
      )}

      <ol className="m-0 flex list-none flex-wrap items-center justify-center gap-[0.35rem] p-0">
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            {pageNumber === page ? (
              <span
                className="inline-flex h-8 min-w-8 items-center justify-center border border-line px-[0.35rem] font-bold text-ink"
                aria-current="page"
              >
                {pageNumber}
              </span>
            ) : (
              <Link
                href={articlesArchiveHref(pageNumber, category, q)}
                className="inline-flex h-8 min-w-8 items-center justify-center border border-transparent px-[0.35rem] text-ink hover:border-fine-line"
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
          className="text-ink underline-offset-[0.14em] hover:underline"
        >
          다음 →
        </Link>
      ) : (
        <span className="pointer-events-none text-muted">다음 →</span>
      )}
    </nav>
  );
}
