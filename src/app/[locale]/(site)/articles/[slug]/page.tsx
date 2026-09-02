import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToPokitCta } from "@/components/add-to-pokit-cta";
import { ArticleDisplayTitle } from "@/components/article-display-title";
import { JsonLd } from "@/components/json-ld";
import { RelatedArticles } from "@/components/related-articles";
import { site } from "@/config/site";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { articlePath } from "@/lib/article-path";
import { formatPublishedLabel } from "@/lib/format-published";
import { cn, monoContainer } from "@/lib/cn";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
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

function articleAvailableLocales(hasEnglishTranslation: boolean | undefined): readonly Locale[] {
  return hasEnglishTranslation === false ? (["ko", "ja"] as const) : locales;
}

function articleMetaDescription(title: string, description?: string) {
  const trimmed = description?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : title;
}

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
    (locale === "en" && article.hasEnglishTranslation === false) ||
    locale === "ja";

  const coverUrl = coverImageUrl(article.coverImage, 1600, 900);
  const jsonLdImage = coverImageUrl(article.coverImage, 1200, 630) ?? undefined;
  const description = articleMetaDescription(article.title, article.description);
  const jsonLdLocale =
    locale === "en" && article.hasEnglishTranslation === false
      ? ("ko" as const)
      : locale === "ja"
        ? ("ko" as const)
        : locale;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          locale: jsonLdLocale,
          slug,
          title: article.title,
          description,
          publishedAt: article.publishedAt,
          modifiedAt: article._updatedAt,
          imageUrl: jsonLdImage ?? undefined,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: site.name, path: "/" },
            { name: dict.header.allStories, path: "/articles" },
            { name: article.title, path: `/articles/${slug}` },
          ],
          jsonLdLocale,
        )}
      />
      <main className={cn(monoContainer, "py-12 pb-20")}>
        <Link
          href={withLocale(locale, "/")}
          className="mb-10 inline-block border-2 border-black bg-panel px-4 py-2 label-caps text-muted hover:bg-wash hover:text-ink"
        >
          {dict.article.backHome}
        </Link>

        {showKoreanOnlyBanner && (
          <p
            className="mb-8 max-w-[42rem] border-2 border-black bg-pink-soft px-5 py-4 font-sans text-[0.88rem] leading-[1.6] text-ink"
            role="note"
          >
            {dict.article.koreanOnlyBanner}
          </p>
        )}

        <header className="mb-10">
          {article.kicker && (
            <p className="m-0 mb-4 max-w-[42rem] label-caps text-green">
              {article.kicker}
            </p>
          )}
          <ArticleDisplayTitle
            title={article.title}
            locale={locale}
            category={article.category}
            description={article.description}
            as="h1"
            className="m-0 font-sans text-[clamp(1.75rem,3.25vw,2.65rem)] font-extrabold leading-[1.1] tracking-[-0.03em]"
          />
          {article.description && (
            <p className="mt-5 mb-0 max-w-[42rem] font-sans text-[1.05rem] leading-[1.65] text-muted">
              {article.description}
            </p>
          )}
          {article.publishedAt && (
            <p className="mt-5 mb-0 max-w-[42rem] label-caps text-muted">
              <time dateTime={article.publishedAt}>
                {formatPublishedLabel(article.publishedAt, locale)}
              </time>
            </p>
          )}
        </header>
        {coverUrl && (
          <figure className="mb-12 overflow-hidden border-2 border-black bg-beige">
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
  const availableLocales = articleAvailableLocales(article.hasEnglishTranslation);
  const alternates = localeAlternates(rawLocale, path, { availableLocales });
  const description = articleMetaDescription(article.title, article.description);
  const isKoreanOnlyOnEn =
    rawLocale === "en" && article.hasEnglishTranslation === false;

  return {
    title: article.title,
    description,
    alternates,
    robots: isKoreanOnlyOnEn ? { index: false, follow: true } : undefined,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      siteName: site.name,
      url: alternates.canonical,
      publishedTime: article.publishedAt,
      modifiedTime: article._updatedAt,
      locale: localeOpenGraph(
        availableLocales.includes(rawLocale) ? rawLocale : availableLocales[0],
      ),
      images: coverImage
        ? [{ url: coverImage, alt: article.imageAlt }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}
