import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { articlesArchiveHref } from "@/sanity/lib/articles";

type Props = {
  locale: Locale;
  dict: Dictionary;
  page: number;
  totalPages: number;
  category?: string;
  section?: string;
  q?: string;
};

export function ArticlePagination({
  locale,
  dict,
  page,
  totalPages,
  category,
  section,
  q,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 border-t border-fine-line pt-6 font-sans text-[0.88rem]"
      aria-label={dict.archive.paginationAria}
    >
      {page > 1 ? (
        <Link
          href={articlesArchiveHref(locale, page - 1, category, q, section)}
          scroll={false}
          className="text-ink underline-offset-[0.14em] hover:underline"
        >
          {dict.archive.prev}
        </Link>
      ) : (
        <span className="pointer-events-none text-muted">{dict.archive.prev}</span>
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
                href={articlesArchiveHref(locale, pageNumber, category, q, section)}
                scroll={false}
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
          href={articlesArchiveHref(locale, page + 1, category, q, section)}
          scroll={false}
          className="text-ink underline-offset-[0.14em] hover:underline"
        >
          {dict.archive.next}
        </Link>
      ) : (
        <span className="pointer-events-none text-muted">{dict.archive.next}</span>
      )}
    </nav>
  );
}
