"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import type { Locale } from "@/i18n/config";
import { cn, monoContainer } from "@/lib/cn";

type Book = {
  rank?: number;
  itemId: number;
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  coverUrl: string;
  link: string;
  description: string;
};

const copy = {
  ko: { eyebrow: "POKIT STORY · LIBRARY", title: "오늘의 책장", intro: "지금 많이 읽는 책을 둘러보고, 마음에 남는 한 권을 발견해 보세요.", bestseller: "지금 많이 읽는 책", search: "책 제목이나 작가를 검색해 보세요", submit: "검색", loading: "책을 불러오고 있어요…", empty: "검색 결과가 없어요. 다른 제목으로 찾아보세요.", error: "책 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.", detail: "책 소개", buy: "YES24에서 책 보기", attribution: "도서 정보와 표지는 YES24에서 제공하며, 상품 페이지에서 최신 정보를 확인할 수 있어요.", back: "추천 목록으로", result: "검색 결과" },
  en: { eyebrow: "POKIT STORY · LIBRARY", title: "Your book shelf", intro: "Browse books readers love and find one to take with you.", bestseller: "Popular right now", search: "Search by title or author", submit: "Search", loading: "Finding books…", empty: "No books found. Try another title.", error: "Book information is unavailable. Please try again shortly.", detail: "About this book", buy: "View on YES24", attribution: "Book details and covers are provided by YES24. See the product page for current information.", back: "Back to picks", result: "Search results" },
  ja: { eyebrow: "POKIT STORY · LIBRARY", title: "今日の本棚", intro: "人気の本を眺めながら、心に残る一冊を見つけてみましょう。", bestseller: "今よく読まれている本", search: "タイトルまたは著者名で検索", submit: "検索", loading: "本を読み込んでいます…", empty: "見つかりませんでした。別の言葉で検索してください。", error: "書籍情報を読み込めませんでした。しばらくしてからお試しください。", detail: "この本について", buy: "YES24で見る", attribution: "書籍情報と表紙はYES24から提供されています。最新情報は商品ページをご確認ください。", back: "おすすめに戻る", result: "検索結果" },
  "zh-TW": { eyebrow: "POKIT STORY · LIBRARY", title: "今日書架", intro: "看看大家喜愛的書，找到一本想帶回家的好書。", bestseller: "近期熱門書籍", search: "搜尋書名或作者", submit: "搜尋", loading: "正在載入書籍…", empty: "找不到書籍，請嘗試其他關鍵字。", error: "目前無法載入書籍資訊，請稍後再試。", detail: "書籍介紹", buy: "前往 YES24 查看", attribution: "書籍資訊與封面由 YES24 提供。最新資訊請參考商品頁面。", back: "返回推薦", result: "搜尋結果" },
} satisfies Record<Locale, Record<string, string>>;

export function LibraryExperience({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [books, setBooks] = useState<Book[]>([]);
  const [selected, setSelected] = useState<Book | null>(null);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const loadBooks = useCallback(async (search = "") => {
    setLoading(true);
    setFailed(false);
    setSelected(null);
    try {
      const params = new URLSearchParams({ operation: search ? "search" : "bestseller" });
      if (search) params.set("query", search);
      const response = await fetch(`/api/pokitstory-books?${params}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !Array.isArray(payload.items)) throw new Error("books_unavailable");
      setBooks(payload.items);
      setActiveQuery(search);
    } catch {
      setFailed(true);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadBooks(); }, [loadBooks]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();
    if (normalized) void loadBooks(normalized);
  }

  return (
    <main className="pb-12">
      <section className={cn(monoContainer, "pt-10 pb-16 max-nav:pt-8")}>
        <header className="mb-8">
          <p className="m-0 font-sans text-[0.72rem] font-semibold tracking-[0.1em] text-green">{t.eyebrow}</p>
          <h1 className="m-0 mt-3 font-sans text-[clamp(2.35rem,5.5vw,4rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink">{t.title}</h1>
          <p className="mt-4 mb-0 max-w-[38rem] font-sans text-[0.95rem] leading-relaxed text-muted">{t.intro}</p>
        </header>

        <form onSubmit={submitSearch} className="mb-10 flex gap-2 rounded-2xl border border-ink/10 bg-white/75 p-2 shadow-[0_8px_30px_rgba(40,34,25,0.04)]">
          <label className="sr-only" htmlFor="library-search">{t.search}</label>
          <input id="library-search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-3 font-sans text-[0.92rem] text-ink outline-none placeholder:text-muted/70" />
          <button type="submit" disabled={!query.trim() || loading} className="shrink-0 rounded-xl bg-ink px-5 py-3 font-sans text-[0.85rem] font-semibold text-white transition-colors hover:bg-indigo disabled:opacity-50">{t.submit}</button>
        </form>

        {selected ? (
          <article className="grid grid-cols-[minmax(8rem,15rem)_minmax(0,1fr)] gap-8 rounded-[1.5rem] border border-ink/10 bg-white/60 p-6 max-nav:grid-cols-1 max-nav:gap-6 max-nav:p-5">
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[15rem] overflow-hidden rounded-xl bg-[#eee9df] shadow-[0_14px_30px_rgba(40,34,25,0.13)]">
              {selected.coverUrl ? <Image src={selected.coverUrl} alt={selected.title} fill sizes="240px" unoptimized className="object-cover" /> : <div className="flex h-full items-center justify-center p-4 text-center font-serif text-xl text-ink">{selected.title}</div>}
            </div>
            <div className="self-center">
              <button type="button" onClick={() => setSelected(null)} className="mb-8 rounded-full border border-ink/15 px-4 py-2 font-sans text-xs text-muted hover:text-ink">← {t.back}</button>
              <p className="m-0 font-sans text-xs font-semibold tracking-wider text-green">{t.detail}</p>
              <h2 className="mt-3 mb-0 font-sans text-[clamp(1.6rem,4vw,2.5rem)] font-bold leading-tight tracking-[-0.03em] text-ink">{selected.title}</h2>
              <p className="mt-4 mb-0 font-sans text-sm text-muted">{[selected.author, selected.publisher, selected.pubDate].filter(Boolean).join(" · ")}</p>
              {selected.description ? <p className="mt-6 mb-0 max-w-[38rem] whitespace-pre-line font-sans text-[0.92rem] leading-[1.75] text-ink/80">{selected.description}</p> : null}
              <a href={selected.link} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-sans text-sm font-semibold text-white no-underline transition-colors hover:bg-indigo">{t.buy} ↗</a>
              <p className="mt-5 mb-0 max-w-[34rem] font-sans text-xs leading-relaxed text-muted">{t.attribution}</p>
            </div>
          </article>
        ) : (
          <>
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="m-0 font-sans text-xl font-bold tracking-[-0.025em] text-ink">{activeQuery ? t.result : t.bestseller}</h2>
              {activeQuery ? <button type="button" onClick={() => { setQuery(""); void loadBooks(); }} className="font-sans text-xs text-muted underline underline-offset-4">{t.back}</button> : null}
            </div>
            {loading ? <p className="m-0 rounded-2xl border border-ink/10 bg-white/50 px-5 py-8 font-sans text-sm text-muted">{t.loading}</p> : failed ? <p role="alert" className="m-0 rounded-2xl border border-ink/10 bg-white/50 px-5 py-8 font-sans text-sm text-muted">{t.error}</p> : books.length === 0 ? <p className="m-0 rounded-2xl border border-ink/10 bg-white/50 px-5 py-8 font-sans text-sm text-muted">{t.empty}</p> : (
              <ul className="m-0 grid list-none grid-cols-2 gap-x-5 gap-y-8 p-0 sm:grid-cols-3 lg:grid-cols-4">
                {books.map((book, index) => (
                  <li key={book.itemId}>
                    <button type="button" onClick={() => setSelected(book)} className="group block w-full text-left">
                      <span className="relative block aspect-[2/3] overflow-hidden rounded-[0.85rem] bg-[#eee9df] shadow-[0_10px_22px_rgba(40,34,25,0.11)] transition-transform duration-300 group-hover:-translate-y-1">
                        {book.coverUrl ? <Image src={book.coverUrl} alt="" fill sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 220px" unoptimized className="object-cover" /> : <span className="flex h-full items-center justify-center p-4 text-center font-serif text-lg text-ink">{book.title}</span>}
                        {book.rank || index + 1 ? <span className="absolute left-2 top-2 flex size-8 items-center justify-center rounded-full bg-paper/95 font-sans text-xs font-bold text-ink">{book.rank || index + 1}</span> : null}
                      </span>
                      <span className="mt-4 block line-clamp-2 font-sans text-[0.95rem] font-bold leading-snug text-ink">{book.title}</span>
                      <span className="mt-1 block truncate font-sans text-xs text-muted">{book.author}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <p className="mt-12 mb-0 border-t border-ink/8 pt-6 font-sans text-xs leading-relaxed text-muted">{t.attribution}</p>
      </section>
    </main>
  );
}
