import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { withLocale } from "@/lib/locale-path";
import { articlesArchiveHref } from "@/sanity/lib/articles";

type Props = {
  locale: Locale;
  dict: Dictionary;
  q?: string;
  category?: string;
  section?: string;
};

export function ArticlesArchiveSearch({ locale, dict, q, category, section }: Props) {
  const trimmed = q?.trim();

  return (
    <form className="mt-5" action={withLocale(locale, "/articles")} method="get">
      {section && <input type="hidden" name="section" value={section} />}
      {category && <input type="hidden" name="category" value={category} />}
      <label
        className="mb-[0.45rem] block font-sans text-[0.72rem] font-extrabold tracking-[0.06em] uppercase"
        htmlFor="articles-search"
      >
        {dict.archive.search}
      </label>
      <div className="flex max-w-lg gap-2">
        <input
          id="articles-search"
          name="q"
          type="search"
          defaultValue={trimmed ?? ""}
          placeholder={dict.archive.searchPlaceholder}
          autoComplete="off"
          className="min-w-0 flex-1 border border-line bg-panel px-3 py-[0.65rem] font-[inherit] text-[0.92rem]"
        />
        <button
          type="submit"
          className="cursor-pointer border border-ink bg-ink px-4 py-[0.65rem] font-[inherit] text-[0.88rem] font-bold text-panel"
        >
          {dict.archive.searchSubmit}
        </button>
      </div>
      {trimmed && (
        <p className="mt-[0.55rem] mb-0 text-[0.88rem] [&_a:hover]:text-green">
          <Link href={articlesArchiveHref(locale, 1, category, undefined, section)}>
            {dict.archive.clearSearch}
          </Link>
        </p>
      )}
    </form>
  );
}
