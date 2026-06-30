import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToPokitCta } from "@/components/add-to-pokit-cta";
import { JsonLd } from "@/components/json-ld";
import { RelatedArticles } from "@/components/related-articles";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { articlePath } from "@/lib/article-path";
import { formatPublishedLabel } from "@/lib/format-published";
import { cn, monoContainer } from "@/lib/cn";
import { articleJsonLd } from "@/lib/json-ld";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
import { shouldShowPokitCta, toPokitRoutineArticle } from "@/lib/pokit-bridge";
import { getArticleBySlug } from "@/sanity/lib/article";
import { getRelatedArticles } from "@/sanity/lib/articles";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import { ARTICLE_SLUGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetchOptions } from "@/sanity/lib/cache";

export const revalidate = false;
export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  if (!isSanityConfigured() || !client) {
    return [];
  }

  const slugs = await client.fetch<{ slug: string }[]>(
    ARTICLE_SLUGS_QUERY,
    {},
    sanityFetchOptions,
  );

  return locales.flatMap((locale) => slugs.map(({ slug }) => ({ locale, slug })));
}

export default async function ArticlePage({ params }: Props) {
  const { locale: rawLocale, slug: rawSlug } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  if (!isSanityConfigured() || !client) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = await getDictionary(locale);
  const slug = decodeURIComponent(rawSlug);
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const related = await getRelatedArticles(slug, article.category, locale, dict);
  const showKoreanOnlyBanner =
    locale === "en" && article.hasEnglishTranslation === false;

  const coverUrl = coverImageUrl(article.coverImage, 1600, 900);
  const jsonLdImage = coverImageUrl(article.coverImage, 1200, 630) ?? undefined;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          locale,
          slug,
          title: article.title,
          description: article.description,
          publishedAt: article.publishedAt,
          imageUrl: jsonLdImage ?? undefined,
        })}
      />
      <main className={cn(monoContainer, "py-8 pb-16")}>
        <Link
          href={withLocale(locale, "/")}
          className="mb-8 inline-block font-sans text-[0.78rem] tracking-[0.08em] text-muted uppercase hover:text-ink"
        >
          {dict.article.backHome}
        </Link>

        {showKoreanOnlyBanner && (
          <p
            className="mb-6 max-w-[42rem] border border-fine-line bg-wash px-4 py-3 font-sans text-[0.88rem] leading-[1.5] text-muted"
            role="note"
          >
            {dict.article.koreanOnlyBanner}
          </p>
        )}

        <header className="mb-8">
          {article.kicker && (
            <p className="m-0 mb-3 max-w-[42rem] font-sans text-[0.72rem] font-bold tracking-[0.12em] text-green uppercase">
              {article.kicker}
            </p>
          )}
          <h1 className="m-0 font-serif text-[clamp(1.75rem,3.25vw,2.65rem)] leading-[1.08] font-medium">
            {article.title}
          </h1>
          {article.description && (
            <p className="mt-4 mb-0 max-w-[42rem] font-sans text-[1.05rem] leading-[1.55] text-muted">
              {article.description}
            </p>
          )}
          {article.publishedAt && (
            <p className="mt-4 mb-0 max-w-[42rem] font-sans text-[0.78rem] text-muted">
              <time dateTime={article.publishedAt}>
                {formatPublishedLabel(article.publishedAt, locale)}
              </time>
            </p>
          )}
        </header>
        {coverUrl && (
          <figure className="mb-10 overflow-hidden bg-wash">
            <Image
              src={coverUrl}
              alt={article.imageAlt}
              width={1600}
              height={900}
              priority
              className="block h-auto w-full"
              sizes="(min-width: 1024px) 960px, 100vw"
              {...imageBlurProps(article.coverImageLqip)}
            />
          </figure>
        )}
        {article.body && (
          <div className="prose max-w-[42rem] font-sans text-ink">
            <PortableText value={article.body} />
          </div>
        )}
        {shouldShowPokitCta(article) && (
          <AddToPokitCta
            article={toPokitRoutineArticle(article)}
            locale={locale}
            copy={dict.article.addToPokit}
          />
        )}
        {related && (
          <RelatedArticles
            related={related}
            locale={locale}
            categoryLabels={dict.categories}
            heading={dict.article.relatedStories(related.label)}
            viewMoreLabel={dict.article.viewMore}
          />
        )}
      </main>
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug: rawSlug } = await params;

  if (!isLocale(rawLocale) || !isSanityConfigured() || !client) {
    return { title: "Article" };
  }

  const slug = decodeURIComponent(rawSlug);
  const article = await getArticleBySlug(slug, rawLocale);

  if (!article) {
    return { title: "Article not found" };
  }

  const coverImage = coverImageUrl(article.coverImage, 1200, 630) ?? undefined;
  const path = articlePath(rawLocale, slug).replace(`/${rawLocale}`, "");

  return {
    title: article.title,
    description: article.description,
    alternates: localeAlternates(rawLocale, path),
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      locale: localeOpenGraph(rawLocale),
      images: coverImage
        ? [{ url: coverImage, alt: article.imageAlt }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}
