import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticlesArchiveSearch } from "@/components/articles-archive-search";
import { ArticlesArchiveView } from "@/components/articles-archive-view";
import { ArticlePagination } from "@/components/article-pagination";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/config/site";
import {
  ARTICLES_PER_PAGE,
  articlesArchiveHref,
  getPaginatedArticles,
} from "@/sanity/lib/articles";

type Props = {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
};

function parsePage(raw?: string) {
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page: rawPage, category, q } = await searchParams;
  const page = parsePage(rawPage);
  const searchTerm = q?.trim();
  const categoryLabel = category ? ` · ${category}` : "";
  const searchLabel = searchTerm ? ` · "${searchTerm}"` : "";
  const title =
    page > 1
      ? `모든 이야기 (${page}페이지${categoryLabel}${searchLabel}) | ${site.name}`
      : `모든 이야기${categoryLabel}${searchLabel} | ${site.name}`;

  return {
    title,
    description: "POKIT에 발행된 모든 이야기를 최신순으로 확인하세요.",
    alternates: {
      canonical: `${site.siteUrl}${articlesArchiveHref(page, category, searchTerm)}`,
    },
  };
}

export default async function ArticlesPage({ searchParams }: Props) {
  const { page: rawPage, category, q } = await searchParams;
  const page = parsePage(rawPage);
  const searchTerm = q?.trim();
  const { articles, total, totalPages } = await getPaginatedArticles(
    page,
    category,
    searchTerm,
  );

  if (total > 0 && page > totalPages) {
    notFound();
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * ARTICLES_PER_PAGE + 1;
  const rangeEnd = Math.min(page * ARTICLES_PER_PAGE, total);

  return (
    <>
      <SiteHeader />

      <main>
        <section className="articles-archive mono-container">
          <header className="articles-archive__header">
            <p className="articles-archive__kicker">Archive</p>
            <h1>{category ? `${category} 이야기` : "모든 이야기"}</h1>
            <p className="articles-archive__summary">
              {searchTerm ? (
                total > 0 ? (
                  <>
                    &quot;{searchTerm}&quot; 검색 결과 {total}편 · {rangeStart}–
                    {rangeEnd}번째
                  </>
                ) : (
                  <> &quot;{searchTerm}&quot;에 맞는 이야기가 없습니다.</>
                )
              ) : total > 0 ? (
                <>
                  총 {total}편 · {rangeStart}–{rangeEnd}번째 (최신순)
                </>
              ) : (
                "아직 발행된 이야기가 없습니다."
              )}
            </p>
            <ArticlesArchiveSearch q={searchTerm} category={category} />
            {category && (
              <p className="articles-archive__filter">
                <Link href={articlesArchiveHref(1, undefined, searchTerm)}>
                  필터 해제 · 전체 이야기 보기
                </Link>
              </p>
            )}
          </header>

          {articles.length > 0 ? (
            <>
              <ArticlesArchiveView articles={articles} />
              <ArticlePagination
                page={page}
                totalPages={totalPages}
                category={category}
                q={searchTerm}
              />
            </>
          ) : (
            <p className="section-empty">
              {searchTerm
                ? "다른 검색어를 시도하거나 검색을 초기화해 보세요."
                : "Sanity Studio에서 이야기를 발행하면 여기에 표시됩니다."}
            </p>
          )}

          <p className="articles-archive__back">
            <Link href="/">← 홈으로</Link>
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
