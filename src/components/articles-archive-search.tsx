import Link from "next/link";

import { articlesArchiveHref } from "@/sanity/lib/articles";

type Props = {
  q?: string;
  category?: string;
};

export function ArticlesArchiveSearch({ q, category }: Props) {
  const trimmed = q?.trim();

  return (
    <form className="mt-5" action="/articles" method="get">
      {category && <input type="hidden" name="category" value={category} />}
      <label
        className="mb-[0.45rem] block font-sans text-[0.72rem] font-extrabold tracking-[0.06em] uppercase"
        htmlFor="articles-search"
      >
        검색
      </label>
      <div className="flex max-w-lg gap-2">
        <input
          id="articles-search"
          name="q"
          type="search"
          defaultValue={trimmed ?? ""}
          placeholder="제목, 설명, 키워드"
          autoComplete="off"
          className="min-w-0 flex-1 border border-line bg-panel px-3 py-[0.65rem] font-[inherit] text-[0.92rem]"
        />
        <button
          type="submit"
          className="cursor-pointer border border-ink bg-ink px-4 py-[0.65rem] font-[inherit] text-[0.88rem] font-bold text-panel"
        >
          검색
        </button>
      </div>
      {trimmed && (
        <p className="mt-[0.55rem] mb-0 text-[0.88rem] [&_a:hover]:text-green">
          <Link href={articlesArchiveHref(1, category)}>검색 초기화</Link>
        </p>
      )}
    </form>
  );
}
