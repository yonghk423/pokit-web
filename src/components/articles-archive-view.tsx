"use client";

import { useSyncExternalStore } from "react";

import { ArticleArchiveListItem } from "@/components/article-archive-list-item";
import { ArticleCard } from "@/components/article-card";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
import type { ArticleCardData } from "@/sanity/types";

const STORAGE_KEY = "pokit-archive-view";
const STORAGE_EVENT = "pokit-archive-view-change";

type ViewMode = "grid" | "list";

type ArchiveViewLabels = {
  viewLabel: string;
  viewModeAria: string;
  viewGrid: string;
  viewList: string;
};

type Props = {
  articles: ArticleCardData[];
  locale: Locale;
  categoryLabels: Dictionary["categories"];
  labels: ArchiveViewLabels;
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

export function ArticlesArchiveView({ articles, locale, categoryLabels, labels }: Props) {
  const view = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-6">
        <p className="m-0 label-caps">
          {labels.viewLabel}
        </p>
        <div
          className="inline-flex border-2 border-black"
          role="group"
          aria-label={labels.viewModeAria}
        >
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 border-0 bg-transparent px-4 py-2 font-sans text-[0.78rem] font-bold tracking-[0.04em] text-muted",
              view === "grid" && "bg-ink text-panel",
              view !== "grid" && "hover:bg-wash hover:text-ink",
            )}
            aria-pressed={view === "grid"}
            onClick={() => selectView("grid")}
          >
            <GridIcon />
            {labels.viewGrid}
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 border-0 border-l-2 border-black bg-transparent px-4 py-2 font-sans text-[0.78rem] font-bold tracking-[0.04em] text-muted",
              view === "list" && "bg-ink text-panel",
              view !== "list" && "hover:bg-wash hover:text-ink",
            )}
            aria-pressed={view === "list"}
            onClick={() => selectView("list")}
          >
            <ListIcon />
            {labels.viewList}
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-4 gap-x-5 gap-y-6 max-nav:grid-cols-2 max-archive:grid-cols-1">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              locale={locale}
              categoryLabels={categoryLabels}
              variant="vertical"
            />
          ))}
        </div>
      ) : (
        <ul className="m-0 list-none border-t-2 border-black p-0">
          {articles.map((article) => (
            <ArticleArchiveListItem key={article.slug} article={article} locale={locale} />
          ))}
        </ul>
      )}
    </>
  );
}
