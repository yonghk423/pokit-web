import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticlesArchiveSections } from "@/components/articles-archive-sections";
import { ArticlesArchiveSearch } from "@/components/articles-archive-search";
import { ArticlesArchiveView } from "@/components/articles-archive-view";
import { ArticlePagination } from "@/components/article-pagination";
import { appName } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getArchiveMessages } from "@/i18n/get-archive-messages";
import { getCommonMessages } from "@/i18n/get-common-messages";
import { createCategoryLabels } from "@/i18n/category-labels";
import {
  getArchiveHeading,
  getArchiveSectionLabel,
  getCategoryLabel,
  isArchiveSection,
} from "@/lib/category-label";
import { cn, monoContainer } from "@/lib/cn";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
import {
  ARTICLES_PER_PAGE,
  articlesArchiveHref,
  getPaginatedArticles,
  parseArchiveSort,
} from "@/sanity/lib/articles";

export const revalidate = false;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    category?: string;
    section?: string;
    q?: string;
    sort?: string;
  }>;
};

function parsePage(raw?: string) {
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

const ARCHIVE_OG_IMAGE = {
  url: "/pokit-logo.png",
  alt: "Your Day",
  width: 512,
  height: 512,
} as const;

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const { page: rawPage, category, section, q, sort: rawSort } =
    await searchParams;
  const page = parsePage(rawPage);
  const searchTerm = q?.trim();
  const archiveSection =
    section && isArchiveSection(section) ? section : undefined;
  const sort = parseArchiveSort(rawSort);
  const [commonMessages, messages] = await Promise.all([
    getCommonMessages(rawLocale),
    getArchiveMessages(rawLocale),
  ]);
  const categoryLabels = createCategoryLabels(createTranslator(commonMessages));
  const t = createTranslator(messages);
  const heading = getArchiveHeading(categoryLabels, t, category, archiveSection);
  const pageSuffix =
    page > 1
      ? searchTerm
        ? t(" ({{page}}페이지 · \"{{term}}\")", { page, term: searchTerm })
        : t(" ({{page}}페이지)", { page })
      : searchTerm
        ? t(" · \"{{term}}\"", { term: searchTerm })
        : "";
  const title = `${heading}${pageSuffix}`;
  const description = searchTerm
    ? t("\"{{term}}\" 검색 결과. 일상·루틴·웰니스 이야기를 POKIT에서 확인하세요.", { term: searchTerm })
    : archiveSection
      ? t("{{label}}. 일상 루틴·웰니스 이야기 | POKIT", {
        label: getArchiveSectionLabel(archiveSection, categoryLabels),
      })
      : category
        ? t("{{label}}. 일상 속 루틴과 웰니스 이야기 | POKIT", { label: getCategoryLabel(category, categoryLabels) })
        : t("일상 루틴과 웰니스 가이드. POKIT에 발행된 모든 이야기를 확인하세요.");

  const isSearchResult = Boolean(searchTerm);

  const canonicalPath = isSearchResult
    ? "/articles"
    : articlesArchiveHref(
      rawLocale,
      page,
      category,
      undefined,
      archiveSection,
      sort,
    ).replace(`/${rawLocale}`, "");

  const alternates = localeAlternates(rawLocale, canonicalPath);

  return {
    title,
    description,
    alternates,
    robots: isSearchResult ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${title} | ${appName(rawLocale)}`,
      description,
      url: alternates.canonical,
      siteName: appName(rawLocale),
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [ARCHIVE_OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title: `${title} | ${appName(rawLocale)}`,
      description,
      images: [ARCHIVE_OG_IMAGE.url],
    },
  };
}

export default async function ArticlesPage({ params, searchParams }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const [commonMessages, messages] = await Promise.all([
    getCommonMessages(rawLocale),
    getArchiveMessages(rawLocale),
  ]);
  const categoryLabels = createCategoryLabels(createTranslator(commonMessages));
  const commonT = createTranslator(commonMessages);
  const t = createTranslator(messages);
  const { page: rawPage, category, section, q, sort: rawSort } =
    await searchParams;
  const page = parsePage(rawPage);
  const searchTerm = q?.trim();
  const archiveSection =
    section && isArchiveSection(section) ? section : undefined;
  const sort = parseArchiveSort(rawSort);

  if (section && !archiveSection) {
    notFound();
  }

  const { articles, total, totalPages } = await getPaginatedArticles(
    page,
    locale,
    category,
    searchTerm,
    archiveSection,
    sort,
  );

  if (total > 0 && page > totalPages) {
    notFound();
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * ARTICLES_PER_PAGE + 1;
  const rangeEnd = Math.min(page * ARTICLES_PER_PAGE, total);
  const heading = getArchiveHeading(categoryLabels, t, category, archiveSection);
  const sortLabel =
    sort === "oldest" ? t("오래된순") : t("최신순");

  return (
    <main className="pb-8">
      <section className={cn(monoContainer, "pt-10 pb-16 max-nav:pt-8")}>
        <header className="mb-10 max-nav:mb-8">
          <p className="m-0 font-sans text-[0.72rem] font-semibold tracking-[0.08em] text-muted uppercase">
            {t("Archive")}
          </p>
          <h1 className="m-0 mt-3 max-w-[40rem] font-sans text-[clamp(2.35rem,5.5vw,4rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink">
            {heading}
          </h1>
          <p className="mt-4 mb-0 max-w-[36rem] font-sans text-[0.95rem] leading-relaxed text-muted">
            {searchTerm ? (
              total > 0 ? (
                t("\"{{term}}\" 검색 결과 {{total}}편 · {{start}}-{{end}}번째", {
                  term: searchTerm, total, start: rangeStart, end: rangeEnd,
                })
              ) : (
                t("\"{{term}}\"에 맞는 이야기가 없습니다.", { term: searchTerm })
              )
            ) : total > 0 ? (
              t("총 {{total}}편 · {{start}}-{{end}}번째 ({{sortLabel}})", { total, start: rangeStart, end: rangeEnd, sortLabel })
            ) : (
              t("아직 발행된 이야기가 없습니다.")
            )}
          </p>

          <ArticlesArchiveSections
            locale={locale}
            messages={messages}
            categoryLabels={categoryLabels}
            categoriesAria={commonT("카테고리")}
            category={category}
            section={archiveSection}
            q={searchTerm}
            sort={sort}
          />

          <ArticlesArchiveSearch
            locale={locale}
            messages={messages}
            q={searchTerm}
            category={category}
            section={archiveSection}
            sort={sort}
          />


        </header>

        {articles.length > 0 ? (
          <>
            <ArticlesArchiveView
              articles={articles}
              locale={locale}
              categoryLabels={categoryLabels}
              sort={sort}
              newestHref={articlesArchiveHref(
                locale,
                1,
                category,
                searchTerm,
                archiveSection,
                "newest",
              )}
              oldestHref={articlesArchiveHref(
                locale,
                1,
                category,
                searchTerm,
                archiveSection,
                "oldest",
              )}
              labels={{
                viewModeAria: t("보기 방식"),
                viewGrid: t("갤러리"),
                viewList: t("리스트"),
                sortAria: t("정렬"),
                sortNewest: t("최신순"),
                sortOldest: t("오래된순"),
              }}
            />
            <ArticlePagination
              locale={locale}
              messages={messages}
              page={page}
              totalPages={totalPages}
              category={category}
              section={archiveSection}
              q={searchTerm}
              sort={sort}
            />
          </>
        ) : (
          <p className="m-0 rounded-[1.1rem] border border-ink/10 bg-white/60 px-5 py-8 font-sans text-[0.92rem] text-muted">
            {searchTerm
              ? t("다른 검색어를 시도하거나 검색을 초기화해 보세요.")
              : t("Sanity Studio에서 이야기를 발행하면 여기에 표시됩니다.")}
          </p>
        )}

        <p className="mt-14 mb-0 border-t border-ink/8 pt-8">
          <Link
            href={withLocale(locale, "/")}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-sans text-[0.8rem] font-semibold text-white no-underline transition-colors hover:bg-indigo"
          >
            {t("← 홈으로")}
          </Link>
        </p>
      </section>
    </main>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
