import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { articlesArchiveHref, type ArchiveSort } from "@/sanity/lib/articles";

type Props = {
  locale: Locale;
  dict: Dictionary;
  page: number;
  totalPages: number;
  category?: string;
  section?: string;
  q?: string;
  sort?: ArchiveSort;
};

export function ArticlePagination({
  locale,
  dict,
  page,
  totalPages,
  category,
  section,
  q,
  sort = "newest",
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 border-t border-ink/10 pt-8 font-sans text-[0.88rem]"
      aria-label={dict.archive.paginationAria}
    >
      {page > 1 ? (
        <Link
          href={articlesArchiveHref(locale, page - 1, category, q, section, sort)}
          scroll={false}
          className="border border-ink/15 bg-white px-4 py-2 font-semibold text-ink hover:bg-indigo hover:text-white"
        >
          {dict.archive.prev}
        </Link>
      ) : (
        <span className="pointer-events-none border border-ink/10 px-4 py-2 text-muted">
          {dict.archive.prev}
        </span>
      )}

      <ol className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0">
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            {pageNumber === page ? (
              <span
                className="inline-flex h-10 min-w-10 items-center justify-center bg-indigo px-2 font-semibold text-white"
                aria-current="page"
              >
                {pageNumber}
              </span>
            ) : (
              <Link
                href={articlesArchiveHref(locale, pageNumber, category, q, section, sort)}
                scroll={false}
                className="inline-flex h-10 min-w-10 items-center justify-center border border-ink/15 bg-white px-2 font-semibold text-ink hover:bg-indigo hover:text-white"
              >
                {pageNumber}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {page < totalPages ? (
        <Link
          href={articlesArchiveHref(locale, page + 1, category, q, section, sort)}
          scroll={false}
          className="border border-ink/15 bg-white px-4 py-2 font-semibold text-ink hover:bg-indigo hover:text-white"
        >
          {dict.archive.next}
        </Link>
      ) : (
        <span className="pointer-events-none border border-ink/10 px-4 py-2 text-muted">
          {dict.archive.next}
        </span>
      )}
    </nav>
  );
}
