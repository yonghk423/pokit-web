"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { DisplayHeading } from "@/components/display-heading";
import type { Locale } from "@/i18n/config";
import { cn, monoContainer } from "@/lib/cn";
import {
  sanitizeBookText,
  type InitialLibraryData,
  type LibraryBook,
  type LibraryShelfSection,
} from "@/lib/library-shelves";

const navBtnClass =
  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-[#e3e2df]/80 p-0 font-sans text-[0.8rem] font-medium leading-none text-ink/75 transition-colors hover:bg-[#d7d6d2] hover:text-ink disabled:cursor-not-allowed disabled:bg-transparent disabled:text-ink/20";

function yes24CategoryHref(id: string): string {
  return `https://www.yes24.com/Product/Category/Display/${id}`;
}

const copy = {
  ko: {
    heroLine1: "오늘의 문장을",
    heroAccent: "서재에",
    heroRest: "남겨 봅니다.",
    heroCta: "책 검색하기",
    todayPick: "오늘의 한 권",
    feedTitle: "오늘의 책장",
    shelvesLine1: "하루의 결에 맞는",
    shelvesAccent: "책장을",
    shelvesRest: "열어 봅니다.",
    shelvesCta: "분야별 탐색",
    rowMore: "20권 더 보기",
    categoriesLine1: "YES24 국내도서",
    categoriesAccent: "분야별로",
    categoriesRest: "둘러보기.",
    categoriesCta: "국내도서 전체 ↗",
    categoriesHint: "세부 분야를 누르면 해당 YES24 도서 목록으로 바로 이동합니다.",
    openParentCategory: (label: string) => `${label} 전체 보기`,
    showAllCategories: "전체 분야 보기",
    showFewerCategories: "주요 분야만 보기",
    previous: "이전",
    next: "다음",
    search: "책 제목이나 저자를 검색해 보세요",
    submit: "검색",
    loading: "책을 불러오고 있어요…",
    empty: "검색 결과가 없어요. 다른 제목이나 저자로 찾아보세요.",
    error: "책 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    detail: "책 소개",
    buy: "YES24에서 책 보기",
    close: "닫기",
    attribution:
      "도서 정보와 표지는 YES24에서 제공하며, 상품 페이지에서 최신 정보를 확인할 수 있어요.",
    backToShelves: "추천 책장으로",
    result: "국내도서 검색 결과",
    pageLabel: (page: number, count: number) => `${page}페이지 · ${count}권`,
  },
  en: {
    heroLine1: "A quiet shelf",
    heroAccent: "for",
    heroRest: "your day.",
    heroCta: "Search books",
    todayPick: "Pick of the day",
    feedTitle: "Today's shelf",
    shelvesLine1: "Books arranged",
    shelvesAccent: "by",
    shelvesRest: "daily rhythm.",
    shelvesCta: "Browse topics",
    rowMore: "See 20 results",
    categoriesLine1: "Explore Apple Books",
    categoriesAccent: "by",
    categoriesRest: "topic.",
    categoriesCta: "Apple Books ↗",
    categoriesHint: "Select any topic to browse books from Apple Books right here.",
    openParentCategory: (label: string) => `Browse ${label}`,
    showAllCategories: "Show all topics",
    showFewerCategories: "Show featured",
    previous: "Previous",
    next: "Next",
    search: "Search by title or author",
    submit: "Search",
    loading: "Finding books…",
    empty: "No books found. Try another title or author.",
    error: "Book information is unavailable. Please try again shortly.",
    detail: "About this book",
    buy: "View on Apple Books",
    close: "Close",
    attribution:
      "Book details and covers are provided by Apple Books. See the store page for current information.",
    backToShelves: "Back to shelves",
    result: "Search results",
    pageLabel: (page: number, count: number) => `Page ${page} · ${count} books`,
  },
  ja: {
    heroLine1: "今日の一節を",
    heroAccent: "本棚に",
    heroRest: "残してみる。",
    heroCta: "本をさがす",
    todayPick: "今日の一冊",
    feedTitle: "今日の本棚",
    shelvesLine1: "一日のリズムに合う",
    shelvesAccent: "本棚を",
    shelvesRest: "ひらく。",
    shelvesCta: "テーマ別に見る",
    rowMore: "20冊を見る",
    categoriesLine1: "Apple Books を",
    categoriesAccent: "テーマ別に",
    categoriesRest: "探す。",
    categoriesCta: "Apple Books ↗",
    categoriesHint: "テーマを選ぶと、Apple Books の書籍をこの場で検索できます。",
    openParentCategory: (label: string) => `${label} の本を見る`,
    showAllCategories: "すべてのテーマ",
    showFewerCategories: "主なテーマのみ",
    previous: "前へ",
    next: "次へ",
    search: "タイトルまたは著者名で検索",
    submit: "検索",
    loading: "本を読み込んでいます…",
    empty: "見つかりませんでした。別のキーワードで検索してください。",
    error: "書籍情報を読み込めませんでした。しばらくしてからお試しください。",
    detail: "この本について",
    buy: "Apple Booksで見る",
    close: "閉じる",
    attribution:
      "書籍情報と表紙は Apple Books から提供されています。最新情報はストアページをご確認ください。",
    backToShelves: "おすすめの本棚へ",
    result: "検索結果",
    pageLabel: (page: number, count: number) => `${page}ページ · ${count}冊`,
  },
  "zh-TW": {
    heroLine1: "把今日的句子",
    heroAccent: "留在",
    heroRest: "書架上。",
    heroCta: "搜尋書籍",
    todayPick: "今日選書",
    feedTitle: "今日書架",
    shelvesLine1: "依循日常節奏",
    shelvesAccent: "打開",
    shelvesRest: "書架。",
    shelvesCta: "依主題瀏覽",
    rowMore: "看 20 本結果",
    categoriesLine1: "依主題探索",
    categoriesAccent: "Apple Books",
    categoriesRest: "繁體書單。",
    categoriesCta: "Apple Books ↗",
    categoriesHint: "點選主題即可直接在頁內瀏覽 Apple Books 繁體中文書籍。",
    openParentCategory: (label: string) => `瀏覽${label}`,
    showAllCategories: "顯示全部主題",
    showFewerCategories: "只看精選主題",
    previous: "上一頁",
    next: "下一頁",
    search: "搜尋書名或作者",
    submit: "搜尋",
    loading: "正在載入書籍…",
    empty: "沒有可顯示的書籍，請嘗試其他關鍵字。",
    error: "目前無法載入書籍資訊，請稍後再試。",
    detail: "書籍介紹",
    buy: "前往 Apple Books 查看",
    close: "關閉",
    attribution:
      "書籍資訊與封面由 Apple Books 提供。最新資訊請參考商店頁面。",
    backToShelves: "返回推薦書架",
    result: "搜尋結果",
    pageLabel: (page: number, count: number) => `第 ${page} 頁 · ${count} 本`,
  },
} as const;

function formatPubDate(raw: string | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 6) {
    return `${digits.slice(0, 4)}.${digits.slice(4, 6)}`;
  }
  return raw;
}

const BOOK_COVER_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSI0MiI+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2U5ZThlNiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2RjZGJlMCIvPjwvbGluZWFyR3JhZGllbnQ+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjQyIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+";

/**
 * Renders any book cover at its natural aspect ratio inside its stage so wide
 * or square covers are never cropped, with blur placeholder + smooth reveal.
 */
function BookCoverImage({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoadedSrc(src);
    }
  }, [src]);

  if (!src) {
    return (
      <span className="line-clamp-3 p-3 text-center font-serif text-sm text-ink/70">
        {alt}
      </span>
    );
  }

  const isLoaded = loadedSrc === src;

  return (
    <Image
      ref={imgRef}
      src={src}
      alt={alt}
      width={300}
      height={420}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      placeholder="blur"
      blurDataURL={BOOK_COVER_BLUR_DATA_URL}
      unoptimized
      onLoad={() => setLoadedSrc(src)}
      onError={() => setLoadedSrc(src)}
      className={cn(
        "block h-auto max-h-full w-auto max-w-full rounded-[0.25rem] object-contain shadow-[0_12px_26px_rgba(24,26,46,0.16)] transition-[filter,opacity,transform] duration-500 ease-out",
        isLoaded ? "blur-0 opacity-100" : "blur-[6px] opacity-80",
        className,
      )}
    />
  );
}

function BookFeedCard({
  book,
  onSelect,
}: {
  book: LibraryBook;
  onSelect: (book: LibraryBook) => void;
}) {
  const pubLabel = formatPubDate(book.pubDate);

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className="group/feed relative block w-full cursor-pointer overflow-visible border-0 bg-transparent p-0 text-left"
    >
      <div className="relative overflow-visible pr-6">
        <p className="m-0 overflow-visible truncate font-sans text-[0.7rem] leading-normal text-muted">
          {book.publisher}
          {pubLabel ? ` · ${pubLabel}` : null}
        </p>
        <p className="m-0 mt-1.5 truncate font-sans text-[0.9rem] font-bold leading-snug tracking-[-0.02em] text-ink">
          {book.title}
        </p>
        {book.description ? (
          <p className="m-0 mt-1 line-clamp-2 font-sans text-[0.74rem] leading-[1.45] text-muted">
            {book.description}
          </p>
        ) : null}
        <span
          className="absolute top-0 right-0 flex size-5 items-center justify-center font-sans text-[1.05rem] font-light leading-none text-ink/40 transition-colors group-hover/feed:text-ink"
          aria-hidden
        >
          +
        </span>
      </div>

      <div className="mt-2.5 flex h-[8.5rem] w-full items-center justify-center overflow-hidden rounded-[0.45rem] bg-[#f5f5f7] p-3">
        <BookCoverImage
          src={book.coverUrl}
          alt={book.title}
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/feed:scale-[1.04]"
        />
      </div>
    </button>
  );
}

function LibraryShelfRow({
  section,
  moreLabel,
  prevLabel,
  nextLabel,
  onSelectBook,
  onSearchShelf,
}: {
  section: LibraryShelfSection;
  moreLabel: string;
  prevLabel: string;
  nextLabel: string;
  onSelectBook: (book: LibraryBook) => void;
  onSearchShelf: (query: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const active =
    section.books.find((book) => book.itemId === activeId) ?? null;
  const showControls = section.books.length > 3;

  const updateControls = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateControls();
    el.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      el.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [section.books, updateControls]);

  const scrollByCard = useCallback((direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-book-card]");
    const step = card ? card.offsetWidth + 12 : el.clientWidth / 3;
    el.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  }, []);

  if (section.books.length === 0) return null;

  return (
    <div
      id={`shelf-${section.id}`}
      className="group/row relative grid scroll-mt-24 grid-cols-1 items-start gap-4 overflow-hidden border-t border-ink/10 py-6 max-nav:py-6 nav:grid-cols-[minmax(12rem,0.78fr)_minmax(0,1.62fr)] nav:items-stretch nav:gap-8 nav:py-7"
    >
      <div className="flex min-h-0 flex-col gap-3 nav:h-full nav:justify-between nav:gap-6">
        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-3 nav:block">
            <p className="m-0 font-sans text-[0.92rem] font-extrabold leading-none tracking-[-0.02em] text-ink">
              {section.name}
            </p>
            <button
              type="button"
              onClick={() => onSearchShelf(section.query)}
              className="inline-flex shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.72rem] font-semibold tracking-[-0.01em] text-ink/55 transition-colors hover:text-ink nav:mt-2.5"
            >
              {moreLabel}
            </button>
          </div>
          <p className="m-0 mt-1.5 font-sans text-[0.78rem] leading-snug text-muted">
            {section.title}
          </p>
        </div>

        <div
          className={cn(
            "hidden min-h-[4rem] max-w-[21rem] transition-opacity duration-300 nav:block",
            active ? "opacity-100" : "opacity-45",
          )}
          aria-live="polite"
        >
          {active ? (
            <>
              <p className="m-0 font-sans text-[0.9rem] font-bold leading-snug tracking-[-0.02em] text-ink">
                {active.title}
              </p>
              <p className="m-0 mt-1 font-sans text-[0.73rem] text-muted">
                {[active.author, active.publisher].filter(Boolean).join(" · ")}
              </p>
              {active.description ? (
                <p className="m-0 mt-1.5 line-clamp-2 font-sans text-[0.78rem] leading-relaxed text-muted">
                  {active.description}
                </p>
              ) : null}
            </>
          ) : (
            <p className="m-0 font-sans text-[0.78rem] leading-relaxed text-muted">
              {section.title}
            </p>
          )}
        </div>

        {showControls ? (
          <div className="hidden items-center gap-2 nav:flex">
            <button
              type="button"
              className={navBtnClass}
              aria-label={prevLabel}
              disabled={!canPrev}
              onClick={() => scrollByCard("prev")}
            >
              ←
            </button>
            <button
              type="button"
              className={navBtnClass}
              aria-label={nextLabel}
              disabled={!canNext}
              onClick={() => scrollByCard("next")}
            >
              →
            </button>
          </div>
        ) : null}
      </div>

      <div className="relative min-w-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-1"
          aria-label={section.name}
        >
          {section.books.map((book) => {
            const isActive = activeId === book.itemId;
            return (
              <button
                key={book.itemId}
                type="button"
                data-book-card
                onClick={() => onSelectBook(book)}
                onMouseEnter={() => setActiveId(book.itemId)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(book.itemId)}
                onBlur={() => setActiveId(null)}
                aria-label={book.title}
                className={cn(
                  "group/card flex shrink-0 cursor-pointer snap-start flex-col border-0 bg-transparent p-0 text-left transition-opacity duration-300",
                  "w-[8.25rem] sm:w-[9.25rem] nav:w-[9.75rem]",
                  activeId !== null && !isActive && "opacity-55",
                )}
              >
                <span className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[0.95rem] bg-[#f5f5f7] p-3 transition-colors group-hover/card:bg-[#ededf0]">
                  <BookCoverImage
                    src={book.coverUrl}
                    alt={book.title}
                    className={cn(
                      "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive ? "scale-[1.04]" : "scale-100",
                    )}
                  />
                </span>
                <span className="mt-2.5 block line-clamp-2 font-sans text-[0.8rem] font-semibold leading-snug tracking-[-0.015em] text-ink">
                  {book.title}
                </span>
                <span className="mt-0.5 block truncate font-sans text-[0.7rem] text-muted">
                  {book.author}
                </span>
              </button>
            );
          })}
        </div>

        {showControls ? (
          <div className="mt-2.5 hidden items-center justify-end gap-2 max-nav:flex">
            <button
              type="button"
              className={navBtnClass}
              aria-label={prevLabel}
              disabled={!canPrev}
              onClick={() => scrollByCard("prev")}
            >
              ←
            </button>
            <button
              type="button"
              className={navBtnClass}
              aria-label={nextLabel}
              disabled={!canNext}
              onClick={() => scrollByCard("next")}
            >
              →
            </button>
          </div>
        ) : null}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden"
        aria-hidden
      >
        <div className="h-full w-full origin-left scale-x-0 bg-ink/35 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-x-100" />
      </div>
    </div>
  );
}

function BookPreviewModal({
  book,
  labels,
  onClose,
}: {
  book: LibraryBook;
  labels: {
    close: string;
    detail: string;
    buy: string;
    attribution: string;
  };
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const pubLabel = formatPubDate(book.pubDate);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 border-0 bg-ink/45 backdrop-blur-[2px]"
        aria-label={labels.close}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-preview-modal-panel
        className={cn(
          "absolute inset-x-1.5 top-1.5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] overflow-hidden rounded-[1.15rem] bg-[#FEFEFF] shadow-[0_24px_80px_rgba(24,26,46,0.28)] outline-none",
          "nav:inset-3 nav:mx-auto nav:max-w-[64rem] nav:rounded-[1.35rem]",
          "flex flex-col",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 px-5 py-2.5 max-nav:px-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[0.82rem] font-medium tracking-[-0.01em] text-muted transition-colors hover:text-ink"
          >
            <span aria-hidden className="text-[0.95em]">
              ←
            </span>
            {labels.close}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="relative z-10 inline-flex size-10 shrink-0 cursor-pointer touch-manipulation items-center justify-center border-0 bg-transparent p-0 font-sans text-[1.35rem] font-light leading-none text-muted transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>

        <div className="scrollbar-hide grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-y-auto px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-1 max-nav:gap-5 nav:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.25fr)] nav:gap-8 nav:overflow-hidden nav:px-6 nav:pb-6">
          <div className="min-h-0 shrink-0 max-nav:mx-auto max-nav:w-full max-nav:max-w-[18rem]">
            <div
              data-preview-cover
              className="relative isolate flex h-[15rem] items-center justify-center overflow-hidden rounded-[1rem] bg-[#f5f5f7] p-5 nav:h-full nav:min-h-72 nav:p-8"
            >
              <BookCoverImage
                src={book.coverUrl}
                alt={book.title}
                className="shadow-[0_18px_38px_rgba(24,26,46,0.22)]"
              />
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col">
            <div className="shrink-0 border-b border-ink/8 pb-4">
              <p className="m-0 font-sans text-[0.7rem] font-semibold leading-snug tracking-[0.06em] text-green uppercase">
                {labels.detail}
              </p>
              <h2
                id={titleId}
                className="mt-2 mb-0 font-sans text-[clamp(1.3rem,2.6vw,1.95rem)] font-bold leading-[1.25] tracking-[-0.03em] text-ink"
              >
                {book.title}
              </h2>
              <p className="mt-2 mb-0 font-sans text-[0.82rem] text-muted">
                {[book.author, book.publisher, pubLabel]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto py-4">
              {book.description ? (
                <p className="m-0 max-w-[38rem] whitespace-pre-line font-sans text-[0.9rem] leading-[1.75] text-ink/80">
                  {book.description}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={book.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#e3e2df] px-5 font-sans text-[0.82rem] font-semibold text-[#111322] no-underline shadow-[0_3px_10px_rgba(24,26,46,0.12)] transition-all hover:bg-[#d7d6d2]"
                >
                  <span className="size-2 rounded-full bg-[#2ca6a4] shadow-[0_0_6px_rgba(44,166,164,0.55)]" aria-hidden />
                  {labels.buy} ↗
                </a>
              </div>

              <p className="mt-4 mb-0 max-w-[36rem] font-sans text-[0.72rem] leading-relaxed text-muted">
                {labels.attribution}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LibraryExperience({
  locale,
  initialData,
}: {
  locale: Locale;
  initialData: InitialLibraryData;
}) {
  const t = copy[locale];
  const searchSectionRef = useRef<HTMLElement>(null);
  const categoriesSectionRef = useRef<HTMLElement>(null);
  const feedScrollRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<LibraryBook | null>(null);
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [query, setQuery] = useState("");
  const [showAllGroups, setShowAllGroups] = useState(false);
  const [listing, setListing] = useState({ query: "", page: 1 });
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [feedCanPrev, setFeedCanPrev] = useState(false);
  const [feedCanNext, setFeedCanNext] = useState(false);

  const { provider, hero, feed, shelves, categoryGroups } = initialData;
  const isAppleBooks = provider === "apple-books";

  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    () => categoryGroups[0]?.id ?? "001001047",
  );

  const activeGroup =
    categoryGroups.find((g) => g.id === selectedGroupId) ??
    categoryGroups[0] ??
    null;

  const visibleGroups = showAllGroups
    ? categoryGroups
    : categoryGroups.slice(0, 12);

  useEffect(() => {
    const root = document.documentElement;
    const prevPaper = root.style.getPropertyValue("--color-paper");
    const prevBodyBg = document.body.style.backgroundColor;
    root.style.setProperty("--color-paper", "#FEFEFF");
    document.body.style.backgroundColor = "#FEFEFF";
    return () => {
      if (prevPaper) root.style.setProperty("--color-paper", prevPaper);
      else root.style.removeProperty("--color-paper");
      document.body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  const updateFeedControls = useCallback(() => {
    const el = feedScrollRef.current;
    if (!el) return;
    setFeedCanPrev(el.scrollLeft > 4);
    setFeedCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = feedScrollRef.current;
    if (!el) return;
    updateFeedControls();
    el.addEventListener("scroll", updateFeedControls, { passive: true });
    window.addEventListener("resize", updateFeedControls);
    return () => {
      el.removeEventListener("scroll", updateFeedControls);
      window.removeEventListener("resize", updateFeedControls);
    };
  }, [feed.length, updateFeedControls]);

  const scrollFeedByCard = useCallback((direction: "prev" | "next") => {
    const el = feedScrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-feed-card]");
    const step = card ? card.offsetWidth + 12 : el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!listing.query) return;
    const controller = new AbortController();
    async function loadBooks() {
      const endpoint = isAppleBooks
        ? `/api/library-books?${new URLSearchParams({
            locale,
            query: listing.query,
            page: String(listing.page),
          })}`
        : `/api/pokitstory-books?${new URLSearchParams({
            operation: "search",
            query: listing.query,
            page: String(listing.page),
          })}`;

      try {
        const response = await fetch(endpoint, {
          signal: controller.signal,
        });
        const payload = await response.json();
        if (!response.ok || !Array.isArray(payload.items)) {
          throw new Error("books_unavailable");
        }
        if (controller.signal.aborted) return;
        setBooks(
          (payload.items as LibraryBook[]).map((item) => ({
            ...item,
            title: sanitizeBookText(item.title),
            description: sanitizeBookText(item.description),
          })),
        );
        setHasMore(payload.hasMore === true);
      } catch {
        if (!controller.signal.aborted) {
          setFailed(true);
          setBooks([]);
          setHasMore(false);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadBooks();
    return () => controller.abort();
  }, [isAppleBooks, listing, locale]);

  const runSearch = useCallback((nextQuery: string, page = 1) => {
    const normalized = nextQuery.trim();
    if (!normalized) return;
    setQuery(normalized);
    setSelected(null);
    setFailed(false);
    setLoading(true);
    setListing({ query: normalized, page });
    searchSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch(query, 1);
  }

  function clearSearch() {
    setQuery("");
    setListing({ query: "", page: 1 });
    setBooks([]);
    setFailed(false);
    setHasMore(false);
  }

  const heroPubLabel = formatPubDate(hero?.pubDate);

  return (
    <main className="min-h-screen bg-[#FEFEFF] pb-14">
      {/* ── Editorial Hero (matches /ko HomeHero) ── */}
      <section className="relative pt-5 max-nav:pt-4">
        <div className={monoContainer}>
          <h1 className="sr-only">{t.feedTitle}</h1>

          {hero || feed.length > 0 ? (
            <div className="flex gap-3 max-nav:flex-col max-nav:gap-6 nav:h-[clamp(24rem,calc(100svh-14rem),33rem)]">
              {/* Featured Book Stage */}
              {hero ? (
                <button
                  type="button"
                  onClick={() => setSelected(hero)}
                  className="home-hero-rise home-hero-rise-delay group/hero relative flex min-w-0 flex-1 cursor-pointer flex-col justify-between gap-4 overflow-hidden rounded-[0.65rem] border-0 bg-[#f5f5f7] p-5 text-left nav:h-full nav:gap-5 nav:p-7"
                  aria-label={hero.title}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-sans text-[0.7rem] font-semibold tracking-[0.06em] text-green uppercase">
                      {t.todayPick}
                    </span>
                    <span className="truncate font-sans text-[0.7rem] text-muted">
                      {[hero.publisher, heroPubLabel]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>

                  <div className="flex h-[13.5rem] items-center justify-center sm:h-[15.5rem] nav:min-h-0 nav:flex-1">
                    <BookCoverImage
                      src={hero.coverUrl}
                      alt={hero.title}
                      priority
                      className="shadow-[0_18px_36px_rgba(24,26,46,0.2)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/hero:scale-[1.03]"
                    />
                  </div>

                  <div className="max-w-[34rem]">
                    <p className="m-0 font-sans text-[clamp(1.05rem,1.8vw,1.35rem)] font-bold leading-snug tracking-[-0.025em] text-ink">
                      {hero.title}
                    </p>
                    <p className="mt-1 mb-0 font-sans text-[0.76rem] text-muted">
                      {hero.author}
                    </p>
                    {hero.description ? (
                      <p className="mt-2 mb-0 line-clamp-2 font-sans text-[0.78rem] leading-relaxed text-ink/70 max-nav:hidden">
                        {hero.description}
                      </p>
                    ) : null}
                  </div>
                </button>
              ) : (
                <div className="h-[18rem] min-w-0 flex-1 rounded-[0.65rem] bg-[#f5f5f7] nav:h-full" />
              )}

              {/* Right Scrollable Rail (desktop vertical, mobile horizontal snap) */}
              <aside
                className={cn(
                  "relative flex h-full w-[19.5rem] shrink-0 flex-col overflow-visible",
                  "max-nav:h-auto max-nav:w-full",
                )}
                aria-label={t.feedTitle}
              >
                <div className="relative min-h-0 flex-1 overflow-visible">
                  <div
                    ref={feedScrollRef}
                    className={cn(
                      "scrollbar-hide absolute inset-0 overflow-y-auto overflow-x-visible",
                      "max-nav:relative max-nav:inset-auto max-nav:flex max-nav:snap-x max-nav:snap-mandatory max-nav:overflow-x-auto max-nav:overflow-y-hidden max-nav:scroll-smooth",
                    )}
                  >
                    <div
                      className={cn(
                        "flex flex-col gap-4 pt-0.5 pb-8",
                        "max-nav:w-max max-nav:flex-row max-nav:gap-3 max-nav:pt-0 max-nav:pb-1",
                      )}
                    >
                      {feed.map((book) => (
                        <div
                          key={book.itemId}
                          data-feed-card
                          className="min-w-0 max-nav:w-[14.5rem] max-nav:shrink-0 max-nav:snap-start"
                        >
                          <BookFeedCard book={book} onSelect={setSelected} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-[#FEFEFF] to-transparent max-nav:hidden"
                    aria-hidden
                  />
                </div>

                {feed.length > 1 ? (
                  <div className="mt-3 flex items-center gap-2 nav:hidden">
                    <button
                      type="button"
                      className={navBtnClass}
                      aria-label={t.previous}
                      disabled={!feedCanPrev}
                      onClick={() => scrollFeedByCard("prev")}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className={navBtnClass}
                      aria-label={t.next}
                      disabled={!feedCanNext}
                      onClick={() => scrollFeedByCard("next")}
                    >
                      →
                    </button>
                  </div>
                ) : null}
              </aside>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Domestic Book Search (/v1/goods/itemList, 20 per page) ── */}
      <section
        ref={searchSectionRef}
        className="mt-9 scroll-mt-20 max-nav:mt-7"
        aria-label={t.search}
      >
        <div className={monoContainer}>
          <div className="rounded-2xl border border-ink/10 bg-white/75 p-2.5 shadow-[0_8px_24px_rgba(40,34,25,0.04)] sm:p-3.5">
            <form
              onSubmit={submitSearch}
              className="flex flex-wrap items-center gap-2"
            >
              <label className="sr-only" htmlFor="library-search">
                {t.search}
              </label>
              <input
                id="library-search"
                maxLength={100}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2 font-sans text-[0.88rem] text-ink outline-none placeholder:text-muted/65"
              />
              {listing.query ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="shrink-0 cursor-pointer rounded-full bg-[#e3e2df]/70 px-3 py-1.5 font-sans text-xs font-medium text-ink/80 transition-colors hover:bg-[#d7d6d2] hover:text-ink"
                >
                  {t.backToShelves}
                </button>
              ) : null}
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#e3e2df] px-4 py-2 font-sans text-[0.8rem] font-semibold text-[#111322] shadow-[0_3px_10px_rgba(24,26,46,0.12)] transition-all hover:bg-[#d7d6d2] disabled:cursor-default disabled:opacity-90"
              >
                <span className="size-2 rounded-full bg-[#2ca6a4] shadow-[0_0_6px_rgba(44,166,164,0.55)]" aria-hidden />
                {t.submit}
              </button>
            </form>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-ink/8 pt-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {shelves.map((shelf) => {
                  const active = listing.query === shelf.query;
                  return (
                    <button
                      key={shelf.id}
                      type="button"
                      onClick={() => runSearch(shelf.query, 1)}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[0.74rem] transition-all",
                        active
                          ? "bg-[#e3e2df] font-semibold text-ink shadow-[0_3px_10px_rgba(24,26,46,0.12)]"
                          : "bg-[#f2f1ef] font-medium text-ink/75 hover:bg-[#e3e2df] hover:text-ink",
                      )}
                    >
                      {active ? (
                        <span
                          className="size-2 rounded-full bg-[#2ca6a4] shadow-[0_0_6px_rgba(44,166,164,0.55)]"
                          aria-hidden
                        />
                      ) : null}
                      {shelf.name}
                    </button>
                  );
                })}
              </div>

              {categoryGroups.length > 0 ? (
                <button
                  type="button"
                  onClick={() =>
                    categoriesSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.74rem] font-semibold text-ink/65 underline underline-offset-4 transition-colors hover:text-ink"
                >
                  {t.shelvesCta} ↓
                </button>
              ) : null}
            </div>
          </div>

          {/* ── Active Search Results (20 books / page) ── */}
          {listing.query ? (
            <div className="mt-8">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-3.5">
                <div>
                  <p className="m-0 font-sans text-[0.7rem] font-semibold tracking-[0.06em] text-green uppercase">
                    {t.result}
                    {!loading && books.length > 0
                      ? ` · ${t.pageLabel(listing.page, books.length)}`
                      : null}
                  </p>
                  <h2 className="mt-1 mb-0 font-sans text-[clamp(1.25rem,2.6vw,1.75rem)] font-bold tracking-[-0.03em] text-ink">
                    {listing.query}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#e3e2df] px-3.5 py-1.5 font-sans text-[0.74rem] font-semibold text-[#111322] transition-colors hover:bg-[#d7d6d2]"
                >
                  ← {t.backToShelves}
                </button>
              </div>

              {loading ? (
                <p className="m-0 rounded-[1rem] bg-[#f5f5f7] px-5 py-9 font-sans text-sm text-muted">
                  {t.loading}
                </p>
              ) : failed ? (
                <p
                  role="alert"
                  className="m-0 rounded-[1rem] bg-[#f5f5f7] px-5 py-9 font-sans text-sm text-muted"
                >
                  {t.error}
                </p>
              ) : books.length === 0 ? (
                <p className="m-0 rounded-[1rem] bg-[#f5f5f7] px-5 py-9 font-sans text-sm text-muted">
                  {t.empty}
                </p>
              ) : (
                <ul className="m-0 grid list-none grid-cols-2 gap-x-3.5 gap-y-6 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {books.map((book) => (
                    <li key={book.itemId}>
                      <button
                        type="button"
                        onClick={() => setSelected(book)}
                        className="group flex w-full cursor-pointer flex-col border-0 bg-transparent p-0 text-left"
                      >
                        <span className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[0.95rem] bg-[#f5f5f7] p-3 transition-colors group-hover:bg-[#ededf0]">
                          <BookCoverImage
                            src={book.coverUrl}
                            alt={book.title}
                            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                          />
                        </span>
                        <span className="mt-2.5 block line-clamp-2 font-sans text-[0.84rem] font-bold leading-snug tracking-[-0.015em] text-ink">
                          {book.title}
                        </span>
                        <span className="mt-0.5 block truncate font-sans text-[0.72rem] text-muted">
                          {[book.author, book.publisher]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {!loading && (listing.page > 1 || hasMore) ? (
                <div className="mt-7 flex items-center justify-center gap-3 font-sans text-sm text-ink">
                  <button
                    type="button"
                    className={navBtnClass}
                    aria-label={t.previous}
                    disabled={listing.page === 1}
                    onClick={() => runSearch(listing.query, listing.page - 1)}
                  >
                    ←
                  </button>
                  <span className="min-w-6 text-center text-xs font-semibold text-muted">
                    {listing.page}
                  </span>
                  <button
                    type="button"
                    className={navBtnClass}
                    aria-label={t.next}
                    disabled={!hasMore}
                    onClick={() => runSearch(listing.query, listing.page + 1)}
                  >
                    →
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Curated Shelf Rows (matches /ko HomeWorkRows) ── */}
      {shelves.some((s) => s.books.length > 0) ? (
        <section
          className="mt-14 max-nav:mt-10"
          aria-labelledby="library-shelves-heading"
        >
          <div className={monoContainer}>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4 max-nav:mb-5">
              <DisplayHeading
                id="library-shelves-heading"
                line1={t.shelvesLine1}
                accent={t.shelvesAccent}
                rest={t.shelvesRest}
                as="h2"
                className="text-[clamp(1.5rem,3.6vw,2.5rem)]"
              />
              <button
                type="button"
                onClick={() =>
                  categoriesSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#e3e2df] px-3.5 py-1.5 font-sans text-[0.76rem] font-semibold text-[#111322] shadow-[0_3px_10px_rgba(24,26,46,0.12)] transition-all hover:bg-[#d7d6d2]"
              >
                <span className="size-2 rounded-full bg-[#2ca6a4] shadow-[0_0_6px_rgba(44,166,164,0.55)]" aria-hidden />
                {t.shelvesCta}
              </button>
            </div>

            <div className="border-b border-ink/10">
              {shelves.map((shelf) => (
                <LibraryShelfRow
                  key={shelf.id}
                  section={shelf}
                  moreLabel={t.rowMore}
                  prevLabel={`${shelf.name} ${t.previous}`}
                  nextLabel={`${shelf.name} ${t.next}`}
                  onSelectBook={setSelected}
                  onSearchShelf={(shelfQuery) => runSearch(shelfQuery, 1)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── YES24 Category Directory (/v1/category/list) ── */}
      {categoryGroups.length > 0 ? (
        <section
          ref={categoriesSectionRef}
          id="library-categories"
          className="mt-16 scroll-mt-20 max-nav:mt-12"
          aria-labelledby="library-categories-heading"
        >
          <div className={monoContainer}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <DisplayHeading
                  id="library-categories-heading"
                  line1={t.categoriesLine1}
                  accent={t.categoriesAccent}
                  rest={t.categoriesRest}
                  as="h2"
                  className="text-[clamp(1.5rem,3.6vw,2.5rem)]"
                />
                <p className="mt-2 mb-0 font-sans text-[0.8rem] text-muted">
                  {t.categoriesHint}
                </p>
              </div>
              <a
                href={
                  isAppleBooks
                    ? locale === "ja"
                      ? "https://books.apple.com/jp/genre/books/id38"
                      : "https://books.apple.com/us/genre/books/id38"
                    : yes24CategoryHref("001")
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#e3e2df] px-3.5 py-1.5 font-sans text-[0.76rem] font-semibold text-[#111322] no-underline shadow-[0_3px_10px_rgba(24,26,46,0.12)] transition-all hover:bg-[#d7d6d2]"
              >
                <span className="size-2 rounded-full bg-[#2ca6a4] shadow-[0_0_6px_rgba(44,166,164,0.55)]" aria-hidden />
                {t.categoriesCta}
              </a>
            </div>

            <div className="rounded-[1rem] border border-ink/10 bg-[#f5f5f7] p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-1.5">
                {visibleGroups.map((group) => {
                  const isSelected = activeGroup?.id === group.id;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedGroupId(group.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[0.76rem] font-semibold transition-all",
                        isSelected
                          ? "bg-[#e3e2df] text-ink shadow-[0_3px_10px_rgba(24,26,46,0.12)]"
                          : "border border-ink/10 bg-white/80 text-ink/80 hover:border-ink/20 hover:bg-[#e3e2df]/70 hover:text-ink",
                      )}
                    >
                      {isSelected ? (
                        <span
                          className="size-2 rounded-full bg-[#2ca6a4] shadow-[0_0_6px_rgba(44,166,164,0.55)]"
                          aria-hidden
                        />
                      ) : null}
                      {group.label}
                    </button>
                  );
                })}

                {categoryGroups.length > 12 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllGroups((prev) => !prev)}
                    className="cursor-pointer rounded-full bg-[#e3e2df]/70 px-3 py-1.5 font-sans text-[0.74rem] font-medium text-ink/80 transition-colors hover:bg-[#d7d6d2] hover:text-ink"
                  >
                    {showAllGroups
                      ? t.showFewerCategories
                      : `${t.showAllCategories} (${categoryGroups.length})`}
                  </button>
                ) : null}
              </div>

              {activeGroup ? (
                <div className="mt-5 border-t border-ink/10 pt-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="m-0 font-sans text-[0.96rem] font-bold tracking-[-0.02em] text-ink">
                      {activeGroup.label}
                    </h3>
                    {isAppleBooks && activeGroup.query ? (
                      <button
                        type="button"
                        onClick={() => runSearch(activeGroup.query!, 1)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#e3e2df] px-3.5 py-1.5 font-sans text-[0.74rem] font-semibold text-[#111322] shadow-[0_3px_10px_rgba(24,26,46,0.12)] transition-all hover:bg-[#d7d6d2]"
                      >
                        <span
                          className="size-2 rounded-full bg-[#2ca6a4] shadow-[0_0_6px_rgba(44,166,164,0.55)]"
                          aria-hidden
                        />
                        {t.openParentCategory(activeGroup.label)} →
                      </button>
                    ) : (
                      <a
                        href={yes24CategoryHref(activeGroup.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#e3e2df] px-3.5 py-1.5 font-sans text-[0.74rem] font-semibold text-[#111322] no-underline shadow-[0_3px_10px_rgba(24,26,46,0.12)] transition-all hover:bg-[#d7d6d2]"
                      >
                        <span
                          className="size-2 rounded-full bg-[#2ca6a4] shadow-[0_0_6px_rgba(44,166,164,0.55)]"
                          aria-hidden
                        />
                        {t.openParentCategory(activeGroup.label)} ↗
                      </a>
                    )}
                  </div>

                  {activeGroup.children.length > 0 ? (
                    <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                      {activeGroup.children.map((sub) => (
                        <li key={sub.id}>
                          {isAppleBooks && sub.query ? (
                            <button
                              type="button"
                              onClick={() => runSearch(sub.query!, 1)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-ink/10 bg-[#FEFEFF] px-3 py-1 font-sans text-[0.75rem] font-medium text-ink/85 transition-colors hover:border-ink/25 hover:bg-[#e3e2df]/70 hover:text-ink"
                            >
                              <span>{sub.label}</span>
                              <span
                                aria-hidden="true"
                                className="text-[0.68rem] text-muted"
                              >
                                →
                              </span>
                            </button>
                          ) : (
                            <a
                              href={yes24CategoryHref(sub.id)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-[#FEFEFF] px-3 py-1 font-sans text-[0.75rem] font-medium text-ink/85 no-underline transition-colors hover:border-ink/30 hover:bg-white hover:text-ink"
                            >
                              <span>{sub.label}</span>
                              <span
                                aria-hidden="true"
                                className="text-[0.68rem] text-muted"
                              >
                                ↗
                              </span>
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <div className={cn(monoContainer, "mt-10")}>
        <p className="m-0 font-sans text-xs leading-relaxed text-muted">
          {t.attribution}
        </p>
      </div>

      {selected ? (
        <BookPreviewModal
          book={selected}
          labels={{
            close: t.close,
            detail: t.detail,
            buy: t.buy,
            attribution: t.attribution,
          }}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </main>
  );
}
