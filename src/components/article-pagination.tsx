import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
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
  const navBtn =
    "inline-flex items-center justify-center rounded-full border px-4 py-2 font-sans text-[0.82rem] font-semibold transition-colors";

  return (
    <nav
      className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 border-t border-ink/8 pt-8"
      aria-label={dict.archive.paginationAria}
    >
      {page > 1 ? (
        <Link
          href={articlesArchiveHref(
            locale,
            page - 1,
            category,
            q,
            section,
            sort,
          )}
          scroll={false}
          className={cn(
            navBtn,
            "border-ink/12 bg-white text-ink no-underline hover:border-ink/35",
          )}
        >
          {dict.archive.prev}
        </Link>
      ) : (
        <span
          className={cn(
            navBtn,
            "pointer-events-none border-ink/8 text-muted/50",
          )}
        >
          {dict.archive.prev}
        </span>
      )}

      <ol className="m-0 flex list-none flex-wrap items-center justify-center gap-1.5 p-0">
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            {pageNumber === page ? (
              <span
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-ink px-2 font-sans text-[0.85rem] font-semibold text-white"
                aria-current="page"
              >
                {pageNumber}
              </span>
            ) : (
              <Link
                href={articlesArchiveHref(
                  locale,
                  pageNumber,
                  category,
                  q,
                  section,
                  sort,
                )}
                scroll={false}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-ink/12 bg-white px-2 font-sans text-[0.85rem] font-semibold text-ink no-underline transition-colors hover:border-ink/35"
              >
                {pageNumber}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {page < totalPages ? (
        <Link
          href={articlesArchiveHref(
            locale,
            page + 1,
            category,
            q,
            section,
            sort,
          )}
          scroll={false}
          className={cn(
            navBtn,
            "border-ink/12 bg-white text-ink no-underline hover:border-ink/35",
          )}
        >
          {dict.archive.next}
        </Link>
      ) : (
        <span
          className={cn(
            navBtn,
            "pointer-events-none border-ink/8 text-muted/50",
          )}
        >
          {dict.archive.next}
        </span>
      )}
    </nav>
  );
}
