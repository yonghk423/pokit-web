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
    shelvesLine1: "하루의 결에 맞는",
    shelvesAccent: "책장을",
    shelvesRest: "열어 봅니다.",
    shelvesCta: "분야별 탐색",
    topicsLabel: "주제",
    rowMore: "20권 더 보기",
    categoriesLine1: "YES24 국내도서",
    categoriesAccent: "분야별로",
    categoriesRest: "둘러보기.",
    categoriesCta: "국내도서 전체 ↗",
    categoriesHint: "분야를 선택하면 그 분야의 주목할 신간을 볼 수 있어요.",
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
    backToShelves: "책장으로",
    result: "국내도서 검색 결과",
    pageLabel: (page: number, count: number) => `${page}페이지 · ${count}권`,
  },
  en: {
    heroLine1: "A quiet shelf",
    heroAccent: "for",
    heroRest: "your day.",
    shelvesLine1: "Books arranged",
    shelvesAccent: "by",
    shelvesRest: "daily rhythm.",
    shelvesCta: "Browse topics",
    topicsLabel: "Topics",
    rowMore: "See 20 results",
    categoriesLine1: "Explore Apple Books",
    categoriesAccent: "by",
    categoriesRest: "genre.",
    categoriesCta: "Apple Books ↗",
    categoriesHint: "Pick a genre to see books Apple Books files under it, right here.",
    openParentCategory: (label: string) => `Browse ${label}`,
    showAllCategories: "Show all genres",
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
    shelvesLine1: "一日のリズムに合う",
    shelvesAccent: "本棚を",
    shelvesRest: "ひらく。",
    shelvesCta: "テーマ別に見る",
    topicsLabel: "テーマ",
    rowMore: "20冊を見る",
    categoriesLine1: "Apple Books を",
    categoriesAccent: "ジャンル別に",
    categoriesRest: "探す。",
    categoriesCta: "Apple Books ↗",
    categoriesHint: "ジャンルを選ぶと、Apple Books でそのジャンルに分類された本をこの場で表示します。",
    openParentCategory: (label: string) => `${label} の本を見る`,
    showAllCategories: "すべてのジャンル",
    showFewerCategories: "主なジャンルのみ",
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
    backToShelves: "本棚へ戻る",
    result: "検索結果",
    pageLabel: (page: number, count: number) => `${page}ページ · ${count}冊`,
  },
  "zh-TW": {
    heroLine1: "把今日的句子",
    heroAccent: "留在",
    heroRest: "書架上。",
    shelvesLine1: "依循日常節奏",
    shelvesAccent: "打開",
    shelvesRest: "書架。",
    shelvesCta: "依主題瀏覽",
    topicsLabel: "主題",
    rowMore: "看 20 本結果",
    categoriesLine1: "依類別探索",
    categoriesAccent: "Apple Books",
    categoriesRest: "書單。",
    categoriesCta: "Apple Books ↗",
    categoriesHint: "點選類別，即可在頁內瀏覽 Apple Books 歸在該類別的繁體中文書籍。",
    openParentCategory: (label: string) => `瀏覽${label}`,
    showAllCategories: "顯示全部類別",
    showFewerCategories: "只看主要類別",
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
    backToShelves: "返回書架",
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
        "block h-auto max-h-full w-auto max-w-full rounded-[0.25rem] object-contain shadow-[0_14px_32px_rgba(24,26,46,0.28),0_4px_10px_rgba(24,26,46,0.16)] transition-[filter,opacity,transform] duration-500 ease-out",
        isLoaded ? "blur-0 opacity-100" : "blur-[6px] opacity-80",
        className,
      )}
    />
  );
}

function LibraryShelfRow({
  section,
  moreLabel,
  prevLabel,
  nextLabel,
  onSelectBook,
  onSearchShelf,
  autoplayOffsetMs,
}: {
  section: LibraryShelfSection;
  moreLabel: string;
  prevLabel: string;
  nextLabel: string;
  onSelectBook: (book: LibraryBook) => void;
  onSearchShelf: (query: string) => void;
  autoplayOffsetMs: number;
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

  useEffect(() => {
    if (!showControls) return;
    const el = scrollRef.current;
    if (!el) return;

    let paused = false;
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    const advance = () => {
      if (paused) return;
      const track = scrollRef.current;
      if (!track) return;
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      const card = track.querySelector<HTMLElement>("[data-book-card]");
      const step = card ? card.offsetWidth + 12 : track.clientWidth / 3;
      track.scrollBy({ left: step, behavior: "smooth" });
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    let intervalId = 0;
    const startId = window.setTimeout(() => {
      advance();
      intervalId = window.setInterval(advance, 5000);
    }, autoplayOffsetMs);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [showControls, section.books.length, autoplayOffsetMs]);

  if (section.books.length === 0) return null;

  return (
    <div
      id={`shelf-${section.id}`}
      className="group/row relative grid scroll-mt-24 grid-cols-1 items-start gap-4 overflow-visible py-7 max-nav:py-7 nav:grid-cols-[minmax(12rem,0.78fr)_minmax(0,1.62fr)] nav:items-stretch nav:gap-8 nav:py-8"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-ink/[0.025] to-transparent"
        aria-hidden
      />

      <div className="relative z-[1] flex min-h-0 flex-col gap-3 nav:h-full nav:justify-between nav:gap-6">
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

      <div className="relative z-[1] min-w-0">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-1 pt-2 pb-6"
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
                <span className="flex aspect-[4/5] w-full items-center justify-center overflow-visible p-2">
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
          <div className="mt-1 hidden items-center justify-end gap-2 max-nav:flex">
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-ink/[0.015] to-transparent opacity-0 transition-opacity duration-500 group-hover/row:opacity-100"
        aria-hidden
      />
    </div>
  );
}

function BookPreviewModal({
  book: summary,
  locale,
  provider,
  picker,
  labels,
  onClose,
}: {
  book: LibraryBook;
  locale: Locale;
  provider: InitialLibraryData["provider"];
  picker: boolean;
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
  const [book, setBook] = useState(summary);
  const [section, setSection] = useState<"content" | "author" | null>(null);
  const [extra, setExtra] = useState("");
  useEffect(() => {
    if (provider !== "yes24") return;
    const controller = new AbortController();
    fetch(`/api/pokitstory-books?operation=detail&query=${summary.itemId}`, { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        const detail = data?.items?.[0] as LibraryBook | undefined;
        if (detail?.itemId === summary.itemId && !controller.signal.aborted) {
          setBook({ ...summary, totalPages: detail.totalPages ?? summary.totalPages,
            description: sanitizeBookText(detail.description) || summary.description });
        }
      }).catch(() => {});
    return () => controller.abort();
  }, [provider, summary]);

  useEffect(() => {
    if (!section) return;
    const controller = new AbortController();
    fetch(`/api/pokitstory-books?operation=${section}&query=${summary.itemId}`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!controller.signal.aborted) setExtra(sanitizeBookText(data.text) || "등록된 정보가 없습니다.");
      }).catch(() => { if (!controller.signal.aborted) setExtra("정보를 불러오지 못했습니다."); });
    return () => controller.abort();
  }, [section, summary.itemId]);

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
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 hidden nav:block border-0 bg-ink/45 backdrop-blur-[2px]"
        aria-label={labels.close}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute inset-0 overflow-hidden bg-[#FEFEFF] nav:shadow-[0_24px_80px_rgba(24,26,46,0.28)] outline-none",
          "nav:inset-3 nav:mx-auto nav:max-w-[64rem] nav:rounded-[1.35rem]",
          "flex flex-col",
        )}
      >
        <div className="flex shrink-0 justify-end px-2 nav:px-4">
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="relative z-10 inline-flex size-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center border-0 bg-transparent p-0 font-sans text-[1.35rem] font-light leading-none text-muted transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>

        <div className="scrollbar-hide grid min-h-0 flex-1 grid-cols-[minmax(5rem,28%)_minmax(0,1fr)] content-start gap-4 overflow-y-auto px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-1 nav:content-normal nav:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.25fr)] nav:gap-8 nav:overflow-hidden nav:px-6 nav:pb-6">
          <div className="min-h-0 shrink-0 self-start nav:self-stretch">
            <div
              className="relative isolate flex aspect-[3/4] items-start justify-center nav:aspect-auto nav:items-center overflow-visible nav:h-full nav:min-h-72 nav:p-8"
            >
              <BookCoverImage
                src={book.coverUrl}
                alt={book.title}
                className="shadow-sm"
              />
            </div>
          </div>

          <div className="contents nav:flex nav:min-h-0 nav:min-w-0 nav:flex-col">
            <div className="min-w-0 self-center nav:self-stretch nav:shrink-0 nav:border-b nav:border-ink/8 nav:pb-4">
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

            <div className="col-span-full border-t border-ink/10 py-4 nav:min-h-0 nav:flex-1 nav:overflow-y-auto nav:border-0">
              {book.description ? (
                <p className="m-0 max-w-[38rem] whitespace-pre-line font-sans text-[0.9rem] leading-[1.75] text-ink/80">
                  {book.description}
                </p>
              ) : null}

              {provider === "yes24" && (
                <div className="mt-4">
                  {(["content", "author"] as const).map(key => (
                    <button key={key} type="button" aria-expanded={section === key} className="mr-4 underline"
                      onClick={() => { setExtra("불러오는 중…"); setSection(section === key ? null : key); }}>
                      {key === "content" ? "목차" : "저자 소개"}
                    </button>
                  ))}
                  {section && <p aria-live="polite" className="whitespace-pre-line">{extra}</p>}
                </div>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {picker && (
                  <button type="button" className="min-h-10 rounded-full bg-ink px-5 text-sm font-semibold text-white"
                    onClick={() => window.ReactNativeWebView?.postMessage(JSON.stringify({
                      type: "daylight.selectBook.v1", source: provider,
                      book: { itemId: book.itemId, title: book.title, author: book.author,
                        coverUrl: book.coverUrl, link: book.link, totalPages: book.totalPages },
                    }))}>
                    {{ ko: "이 책 선택", en: "Select this book", ja: "この本を選ぶ", "zh-TW": "選擇此書" }[locale]}
                  </button>
                )}
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

const chartLabels = {
  "ko": {
    "bestsellerRealtime": "실시간 베스트셀러",
    "bestseller": "종합 베스트셀러",
    "bestsellerDaily": "일간 베스트셀러",
    "bestsellerMonthly": "월간 베스트셀러",
    "bestsellerSteady": "스테디셀러",
    "bestsellerDeal": "특가 베스트셀러",
    "newproduct": "신간",
    "newproductAttention": "주목할 신간"
  },
  en: { toppaidebooks: "Top paid books", topfreeebooks: "Top free books" },
  ja: { toppaidebooks: "有料ランキング", topfreeebooks: "無料ランキング" },
  "zh-TW": { topfreeebooks: "免費圖書排行" },
} as const;

function LibraryCharts({ locale, onSelect, category }: { category?: { id: string; label: string }; locale: Locale; onSelect: (book: LibraryBook) => void }) {
  const labels = chartLabels[locale];
  const [chartDate, setChartDate] = useState("");
  const [feed, setFeed] = useState(category ? "newproductAttention" : Object.keys(labels)[0]);
  const [books, setBooks] = useState<(LibraryBook & { rank?: number })[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setBooks(null);
    setChartDate("");
    setFailed(false);
    const endpoint = locale === "ko" ? "/api/pokitstory-books" : "/api/library-books";
    fetch(`${endpoint}?operation=chart&locale=${locale}&query=${feed}${category ? "&categoryId=" + category.id : ""}`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error();
        const payload = await response.json();
        if (!Array.isArray(payload.items)) throw new Error();
        if (!controller.signal.aborted) {
          setBooks(payload.items);
          setChartDate(payload.chartDate ?? "");
        }
      }).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [feed, attempt, locale, category?.id]);
  const heading = category ? category.label + " 주목할 신간" : { ko: "YES24 국내도서 순위", en: "Apple Books charts", ja: "Apple Books ランキング", "zh-TW": "Apple Books 圖書排行榜" }[locale];
  return <section id={category ? "category-new-books" : "library-charts"} className={cn(monoContainer, "mt-6 scroll-mt-16")}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-bold">{heading}</h2>
      {!category && <select aria-label={heading} value={feed} onChange={e => setFeed(e.target.value)} className="max-w-full rounded-lg border border-ink/15 px-2 py-1 text-sm">
        {Object.entries(labels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select>}
    </div>
    {chartDate && <small>{feed === "bestsellerMonthly" ? chartDate.slice(0, 7) : chartDate}</small>}
    {failed ? <button onClick={() => setAttempt(n => n + 1)} className="py-2 text-sm underline">{copy[locale].error} ↻</button>
      : books === null ? <p role="status">{copy[locale].loading}</p>
      : books.length === 0 ? <p>{ { ko: "집계된 도서가 없습니다.", en: "No chart entries available.", ja: "ランキングはまだありません。", "zh-TW": "尚無排行資料。" }[locale] }</p>
      : <ol className="mt-2 flex snap-x gap-3 overflow-x-auto pb-2">{books.map((book, index) => (
        <li key={book.itemId} className="w-24 shrink-0 snap-start">
          <button type="button" onClick={() => onSelect(book)} className="w-full text-left">
            <span className="relative flex h-32 items-center justify-center overflow-hidden">
              <BookCoverImage src={book.coverUrl} alt={book.title} />
              <strong className="absolute bottom-0 left-0 rounded bg-ink px-1.5 text-sm text-white">{book.rank || index + 1}</strong>
            </span>
            <span className="mt-1 block line-clamp-2 text-sm">{sanitizeBookText(book.title)}</span>
          </button>
        </li>))}</ol>}
  </section>;
}

export function LibraryExperience({
  locale,
  initialData,
}: {
  locale: Locale;
  initialData: InitialLibraryData;
}) {
  const t = copy[locale];
  const [picker, setPicker] = useState(false);
  useEffect(() => {
    setPicker(new URLSearchParams(window.location.search).get("picker") === "1" && !!window.ReactNativeWebView?.postMessage);
  }, []);
  const searchSectionRef = useRef<HTMLElement>(null);
  const categoriesSectionRef = useRef<HTMLElement>(null);

  const [selected, setSelected] = useState<LibraryBook | null>(null);
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [query, setQuery] = useState("");
  const [showAllGroups, setShowAllGroups] = useState(false);
  const [listing, setListing] = useState<{
    query: string;
    page: number;
    genreId?: string;
  }>({ query: "", page: 1 });
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const { provider, shelves, categoryGroups } = initialData;
  const isAppleBooks = provider === "apple-books";

  const [subCategory, setSubCategory] = useState<{ id: string; label: string } | null>(null);
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

  useEffect(() => {
    if (!listing.query) return;
    const controller = new AbortController();
    async function loadBooks() {
      const endpoint = isAppleBooks
        ? `/api/library-books?${new URLSearchParams({
            locale,
            query: listing.query,
            page: String(listing.page),
            ...(listing.genreId ? { genre: listing.genreId } : {}),
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

  const runSearch = useCallback(
    (nextQuery: string, page = 1, genreId?: string) => {
    const normalized = nextQuery.trim();
    if (!normalized) return;
    setQuery(normalized);
    setSelected(null);
    setFailed(false);
    setLoading(true);
    setListing({ query: normalized, page, genreId });
    searchSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    },
    [],
  );

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

  return (
    <main className="min-h-screen bg-[#FEFEFF] pb-14">
      <section className="relative pt-10 max-nav:pt-3">
        <div className={monoContainer}>
          <DisplayHeading
            line1={t.heroLine1}
            accent={t.heroAccent}
            rest={t.heroRest}
            as="h1"
            className="text-[clamp(1.75rem,4vw,2.85rem)]"
          />
        </div>
      </section>

      {/* ── Domestic Book Search (/v1/goods/itemList, 20 per page) ── */}
      <section
        ref={searchSectionRef}
        className="mt-9 scroll-mt-20 max-nav:mt-4"
        aria-label={t.search}
      >
        <div className={monoContainer}>
          <form
            onSubmit={submitSearch}
            className="group/search flex items-end gap-4 border-b-[1.5px] border-ink/80 pb-2.5 transition-colors focus-within:border-ink"
          >
            <label className="sr-only" htmlFor="library-search">
              {t.search}
            </label>
            <input
              id="library-search"
              type="search"
              maxLength={100}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[clamp(1.15rem,2.4vw,1.5rem)] font-medium tracking-[-0.02em] text-ink outline-none placeholder:font-normal placeholder:text-ink/30 [&::-webkit-search-cancel-button]:hidden"
            />
            {listing.query ? (
              <button
                type="button"
                onClick={clearSearch}
                className="shrink-0 cursor-pointer border-0 bg-transparent p-0 pb-1 font-sans text-[0.78rem] text-muted transition-colors hover:text-ink"
              >
                {t.backToShelves}
              </button>
            ) : null}
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="shrink-0 cursor-pointer border-0 bg-transparent p-0 pb-1 font-sans text-[0.85rem] font-semibold text-ink transition-opacity disabled:cursor-default disabled:opacity-30"
            >
              {t.submit} →
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 font-sans">
              <span className="text-[0.7rem] font-medium tracking-[0.08em] text-muted uppercase">
                {t.topicsLabel}
              </span>
              {shelves.map((shelf) => {
                const active = listing.query === shelf.query;
                return (
                  <button
                    key={shelf.id}
                    type="button"
                    onClick={() => runSearch(shelf.query, 1)}
                    aria-pressed={active}
                    className={cn(
                      "cursor-pointer border-0 bg-transparent p-0 text-[0.86rem] underline-offset-[5px] transition-colors",
                      active
                        ? "font-semibold text-ink underline decoration-[1.5px]"
                        : "text-ink/55 hover:text-ink hover:underline hover:decoration-ink/30",
                    )}
                  >
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
                className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.8rem] text-ink/55 transition-colors hover:text-ink"
              >
                {t.shelvesCta} ↓
              </button>
            ) : null}
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
                  className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.8rem] text-ink/55 transition-colors hover:text-ink"
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
                        <span className="flex aspect-[4/5] w-full items-center justify-center overflow-visible p-2">
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
                    onClick={() => runSearch(listing.query, listing.page - 1, listing.genreId)}
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
                    onClick={() => runSearch(listing.query, listing.page + 1, listing.genreId)}
                  >
                    →
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <LibraryCharts key={locale} locale={locale} onSelect={setSelected} />

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
            </div>

            <div>
              {shelves.map((shelf, index) => (
                <LibraryShelfRow
                  key={shelf.id}
                  section={shelf}
                  moreLabel={t.rowMore}
                  prevLabel={`${shelf.name} ${t.previous}`}
                  nextLabel={`${shelf.name} ${t.next}`}
                  onSelectBook={setSelected}
                  onSearchShelf={(shelfQuery) => runSearch(shelfQuery, 1)}
                  autoplayOffsetMs={(index + 1) * 1000}
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
                      onClick={() => { setSubCategory(null); setSelectedGroupId(group.id); }}
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
                        onClick={() => runSearch(activeGroup.query!, 1, activeGroup.genreId)}
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
                              onClick={() => runSearch(sub.query!, 1, sub.genreId)}
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
                            <button type="button" onClick={() => setSubCategory(sub)} aria-pressed={subCategory?.id === sub.id}
                              className="rounded-full border border-ink/10 px-3 py-1 text-xs aria-pressed:bg-ink aria-pressed:text-white">{sub.label}</button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {!isAppleBooks && <LibraryCharts locale={locale} key={subCategory?.id ?? activeGroup.id} category={subCategory ?? activeGroup} onSelect={setSelected} />}
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
          key={provider + selected.itemId}
          provider={provider}
          locale={locale}
          picker={picker}
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
