import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { withLocale } from "@/lib/locale-path";
import { articlesArchiveHref, type ArchiveSort } from "@/sanity/lib/articles";

type Props = {
  locale: Locale;
  dict: Dictionary;
  q?: string;
  category?: string;
  section?: string;
  sort?: ArchiveSort;
};

export function ArticlesArchiveSearch({
  locale,
  dict,
  q,
  category,
  section,
  sort = "newest",
}: Props) {
  const trimmed = q?.trim();

  return (
    <form className="mt-7" action={withLocale(locale, "/articles")} method="get">
      {section && <input type="hidden" name="section" value={section} />}
      {category && <input type="hidden" name="category" value={category} />}
      {sort === "oldest" && <input type="hidden" name="sort" value="oldest" />}
      <label
        className="mb-2 block font-sans text-[0.72rem] font-semibold tracking-[0.06em] text-muted uppercase"
        htmlFor="articles-search"
      >
        {dict.archive.search}
      </label>
      <div className="flex max-w-xl gap-2">
        <input
          id="articles-search"
          name="q"
          type="search"
          defaultValue={trimmed ?? ""}
          placeholder={dict.archive.searchPlaceholder}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-full border border-ink/12 bg-white px-5 py-3 font-sans text-[0.92rem] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink/35"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-full bg-ink px-5 py-3 font-sans text-[0.85rem] font-semibold text-white transition-colors hover:bg-indigo"
        >
          {dict.archive.searchSubmit}
        </button>
      </div>
      {trimmed && (
        <p className="mt-3 mb-0 font-sans text-[0.85rem]">
          <Link
            href={articlesArchiveHref(
              locale,
              1,
              category,
              undefined,
              section,
              sort,
            )}
            className="font-semibold text-ink underline decoration-ink/25 underline-offset-[0.2em] hover:decoration-ink"
          >
            {dict.archive.clearSearch}
          </Link>
        </p>
      )}
    </form>
  );
}
