"use client";

import { useSyncExternalStore } from "react";

import { ArticleArchiveListItem } from "@/components/article-archive-list-item";
import { ArticleCard } from "@/components/article-card";
import { cn } from "@/lib/cn";
import type { ArticleCardData } from "@/sanity/types";

const STORAGE_KEY = "pokit-archive-view";
const STORAGE_EVENT = "pokit-archive-view-change";

type ViewMode = "grid" | "list";

type Props = {
  articles: ArticleCardData[];
};

function getSnapshot(): ViewMode {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "list" ? "list" : "grid";
}

function getServerSnapshot(): ViewMode {
  return "grid";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

function selectView(next: ViewMode) {
  window.localStorage.setItem(STORAGE_KEY, next);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="1" y="1" width="5" height="5" fill="currentColor" />
      <rect x="8" y="1" width="5" height="5" fill="currentColor" />
      <rect x="1" y="8" width="5" height="5" fill="currentColor" />
      <rect x="8" y="8" width="5" height="5" fill="currentColor" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="1" y="2" width="12" height="2" fill="currentColor" />
      <rect x="1" y="6" width="12" height="2" fill="currentColor" />
      <rect x="1" y="10" width="12" height="2" fill="currentColor" />
    </svg>
  );
}

export function ArticlesArchiveView({ articles }: Props) {
  const view = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="m-0 font-sans text-[0.72rem] font-extrabold tracking-[0.06em] uppercase">
          보기
        </p>
        <div
          className="inline-flex border border-line"
          role="group"
          aria-label="보기 방식"
        >
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-[0.4rem] border-0 bg-transparent px-[0.9rem] py-[0.45rem] font-sans text-[0.78rem] font-bold tracking-[0.04em] text-muted",
              view === "grid" && "bg-ink text-panel",
              view !== "grid" && "hover:text-ink",
            )}
            aria-pressed={view === "grid"}
            onClick={() => selectView("grid")}
          >
            <GridIcon />
            갤러리
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-[0.4rem] border-0 border-l border-line bg-transparent px-[0.9rem] py-[0.45rem] font-sans text-[0.78rem] font-bold tracking-[0.04em] text-muted",
              view === "list" && "bg-ink text-panel",
              view !== "list" && "hover:text-ink",
            )}
            aria-pressed={view === "list"}
            onClick={() => selectView("list")}
          >
            <ListIcon />
            리스트
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-4 gap-x-5 gap-y-6 max-nav:grid-cols-2 max-archive:grid-cols-1">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              variant="vertical"
            />
          ))}
        </div>
      ) : (
        <ul className="m-0 list-none border-t border-line p-0">
          {articles.map((article) => (
            <ArticleArchiveListItem key={article.slug} article={article} />
          ))}
        </ul>
      )}
    </>
  );
}
