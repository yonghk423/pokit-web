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
      className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 border-t-2 border-black pt-8 font-sans text-[0.88rem]"
      aria-label={dict.archive.paginationAria}
    >
      {page > 1 ? (
        <Link
          href={articlesArchiveHref(locale, page - 1, category, q, section)}
          scroll={false}
          className="border-2 border-black bg-panel px-4 py-2 font-bold text-ink hover:bg-wash"
        >
          {dict.archive.prev}
        </Link>
      ) : (
        <span className="pointer-events-none border-2 border-fine-line px-4 py-2 text-muted">
          {dict.archive.prev}
        </span>
      )}

      <ol className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0">
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            {pageNumber === page ? (
              <span
                className="inline-flex h-10 min-w-10 items-center justify-center border-2 border-black bg-wash px-2 font-bold text-ink"
                aria-current="page"
              >
                {pageNumber}
              </span>
            ) : (
              <Link
                href={articlesArchiveHref(locale, pageNumber, category, q, section)}
                scroll={false}
                className="inline-flex h-10 min-w-10 items-center justify-center border-2 border-black bg-panel px-2 font-bold text-ink hover:bg-wash"
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
          className="border-2 border-black bg-panel px-4 py-2 font-bold text-ink hover:bg-wash"
        >
          {dict.archive.next}
        </Link>
      ) : (
        <span className="pointer-events-none border-2 border-fine-line px-4 py-2 text-muted">
          {dict.archive.next}
        </span>
      )}
    </nav>
  );
}
