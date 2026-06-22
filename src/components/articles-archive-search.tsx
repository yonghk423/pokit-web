import Link from "next/link";

import { articlesArchiveHref } from "@/sanity/lib/articles";

type Props = {
  q?: string;
  category?: string;
};

export function ArticlesArchiveSearch({ q, category }: Props) {
  const trimmed = q?.trim();

  return (
    <form className="articles-archive__search" action="/articles" method="get">
      {category && <input type="hidden" name="category" value={category} />}
      <label className="articles-archive__search-label" htmlFor="articles-search">
        검색
      </label>
      <div className="articles-archive__search-row">
        <input
          id="articles-search"
          name="q"
          type="search"
          defaultValue={trimmed ?? ""}
          placeholder="제목, 설명, 키워드"
          autoComplete="off"
        />
        <button type="submit">검색</button>
      </div>
      {trimmed && (
        <p className="articles-archive__search-clear">
          <Link href={articlesArchiveHref(1, category)}>검색 초기화</Link>
        </p>
      )}
    </form>
  );
}
