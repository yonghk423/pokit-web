import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticlesArchiveSearch } from "@/components/articles-archive-search";
import { ArticlesArchiveView } from "@/components/articles-archive-view";
import { ArticlePagination } from "@/components/article-pagination";
import { site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getArchiveHeading, getArchiveSectionLabel, getCategoryLabel, isArchiveSection } from "@/lib/category-label";
import { cn, monoContainer } from "@/lib/cn";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
import {
  ARTICLES_PER_PAGE,
  articlesArchiveHref,
  getPaginatedArticles,
} from "@/sanity/lib/articles";

export const revalidate = false;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string; section?: string; q?: string }>;
};

function parsePage(raw?: string) {
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

const ARCHIVE_OG_IMAGE = {
  url: "/pokitstory.png",
  alt: site.name,
  width: 512,
  height: 512,
} as const;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const { page: rawPage, category, section, q } = await searchParams;
  const page = parsePage(rawPage);
  const searchTerm = q?.trim();
  const archiveSection = section && isArchiveSection(section) ? section : undefined;
  const dict = await getDictionary(rawLocale);
  const heading = getArchiveHeading(dict, category, archiveSection);
  const pageSuffix = page > 1 ? dict.archive.pageSuffix(page, searchTerm) : searchTerm ? ` · "${searchTerm}"` : "";
  const title = `${heading}${pageSuffix}`;
  const description = searchTerm
    ? dict.archive.descriptionSearch(searchTerm)
    : archiveSection
      ? dict.archive.descriptionSection(getArchiveSectionLabel(archiveSection, dict))
      : category
        ? dict.archive.descriptionCategory(getCategoryLabel(category, dict))
        : dict.archive.descriptionAll;
  const path = articlesArchiveHref(rawLocale, page, category, searchTerm, archiveSection).replace(
    `/${rawLocale}`,
    "",
  );

  return {
    title,
    description,
    alternates: localeAlternates(rawLocale, path),
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: localeAlternates(rawLocale, path).canonical,
      locale: localeOpenGraph(rawLocale),
      type: "website",
      images: [ARCHIVE_OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title: `${title} | ${site.name}`,
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
  const dict = await getDictionary(rawLocale);
  const { page: rawPage, category, section, q } = await searchParams;
  const page = parsePage(rawPage);
  const searchTerm = q?.trim();
  const archiveSection = section && isArchiveSection(section) ? section : undefined;

  if (section && !archiveSection) {
    notFound();
  }

  const { articles, total, totalPages } = await getPaginatedArticles(
    page,
    locale,
    category,
    searchTerm,
    archiveSection,
  );

  if (total > 0 && page > totalPages) {
    notFound();
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * ARTICLES_PER_PAGE + 1;
  const rangeEnd = Math.min(page * ARTICLES_PER_PAGE, total);
  const heading = getArchiveHeading(dict, category, archiveSection);

  return (
    <main>
      <section className={cn(monoContainer, "py-10 pb-14")}>
        <header className="mb-8 border-b-4 border-line pb-5">
          <p className="m-0 mb-2 font-sans text-[0.72rem] font-extrabold tracking-[0.1em] text-green uppercase">
            {dict.archive.label}
          </p>
          <h1 className="m-0 text-[clamp(2rem,4vw,2.85rem)] leading-[1.05] tracking-[-0.035em]">
            {heading}
          </h1>
          <p className="mt-[0.85rem] mb-0 font-sans text-[0.92rem] text-muted">
            {searchTerm ? (
              total > 0 ? (
                dict.archive.searchResults(searchTerm, total, rangeStart, rangeEnd)
              ) : (
                dict.archive.searchNoResults(searchTerm)
              )
            ) : total > 0 ? (
              dict.archive.totalRange(total, rangeStart, rangeEnd)
            ) : (
              dict.archive.empty
            )}
          </p>
          <ArticlesArchiveSearch
            locale={locale}
            dict={dict}
            q={searchTerm}
            category={category}
            section={archiveSection}
          />
          {(category || archiveSection) && (
            <p className="mt-[0.65rem] mb-0 font-sans text-[0.88rem] [&_a:hover]:text-green">
              <Link href={articlesArchiveHref(locale, 1, undefined, searchTerm)}>
                {dict.archive.clearFilters}
              </Link>
            </p>
          )}
        </header>

        {articles.length > 0 ? (
          <>
            <ArticlesArchiveView
              articles={articles}
              locale={locale}
              categoryLabels={dict.categories}
              labels={{
                viewLabel: dict.archive.viewLabel,
                viewModeAria: dict.archive.viewModeAria,
                viewGrid: dict.archive.viewGrid,
                viewList: dict.archive.viewList,
              }}
            />
            <ArticlePagination
              locale={locale}
              dict={dict}
              page={page}
              totalPages={totalPages}
              category={category}
              section={archiveSection}
              q={searchTerm}
            />
          </>
        ) : (
          <p className="m-0 border-t border-fine-line py-[1.2rem] font-sans text-[0.9rem] text-muted">
            {searchTerm ? dict.archive.noSearchMatch : dict.archive.studioHint}
          </p>
        )}

        <p className="mt-10 mb-0 border-t border-fine-line pt-6 font-sans text-[0.88rem] [&_a:hover]:text-green">
          <Link href={withLocale(locale, "/")}>{dict.archive.backHome}</Link>
        </p>
      </section>
    </main>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
