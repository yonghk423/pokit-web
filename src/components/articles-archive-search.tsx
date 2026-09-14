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
    <form className="mt-6" action={withLocale(locale, "/articles")} method="get">
      {section && <input type="hidden" name="section" value={section} />}
      {category && <input type="hidden" name="category" value={category} />}
      {sort === "oldest" && <input type="hidden" name="sort" value="oldest" />}
      <label
        className="mb-2 inline-block bg-indigo px-2 py-1 label-caps text-white"
        htmlFor="articles-search"
      >
        {dict.archive.search}
      </label>
      <div className="flex max-w-lg gap-3">
        <input
          id="articles-search"
          name="q"
          type="search"
          defaultValue={trimmed ?? ""}
          placeholder={dict.archive.searchPlaceholder}
          autoComplete="off"
          className="min-w-0 flex-1 border border-ink/15 bg-white px-4 py-3 font-[inherit] text-[0.92rem] focus:border-indigo focus:outline-none"
        />
        <button
          type="submit"
          className="cursor-pointer bg-indigo px-5 py-3 font-[inherit] text-[0.88rem] font-semibold text-white hover:bg-ink"
        >
          {dict.archive.searchSubmit}
        </button>
      </div>
      {trimmed && (
        <p className="mt-3 mb-0 text-[0.88rem] [&_a]:border-b-2 [&_a]:border-indigo [&_a:hover]:text-indigo">
          <Link href={articlesArchiveHref(locale, 1, category, undefined, section, sort)}>
            {dict.archive.clearSearch}
          </Link>
        </p>
      )}
    </form>
  );
}
