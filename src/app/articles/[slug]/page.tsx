import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { articlePath } from "@/lib/article-path";
import { formatPublishedLabel } from "@/lib/format-published";
import { SiteHeader } from "@/components/site-header";
import { cn, monoContainer } from "@/lib/cn";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import {
  ARTICLE_QUERY,
  ARTICLE_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { ArticleDocument } from "@/sanity/types";

const fetchOptions = { next: { revalidate: 60 } };

export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!isSanityConfigured() || !client) {
    return [];
  }

  const slugs = await client.fetch<{ slug: string }[]>(
    ARTICLE_SLUGS_QUERY,
    {},
    fetchOptions,
  );

  return slugs.map(({ slug }) => ({ slug }));
}

export default async function ArticlePage({ params }: Props) {
  if (!isSanityConfigured() || !client) {
    notFound();
  }

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const article = await client.fetch<ArticleDocument | null>(
    ARTICLE_QUERY,
    { slug },
    fetchOptions,
  );

  if (!article) {
    notFound();
  }

  const coverUrl = coverImageUrl(article.coverImage, 1600, 900);

  return (
    <>
      <SiteHeader />
      <main className={cn(monoContainer, "py-8 pb-16")}>
        <Link
          href="/"
          className="mb-8 inline-block font-sans text-[0.78rem] tracking-[0.08em] text-muted uppercase hover:text-ink"
        >
          ← Back to POKIT
        </Link>
        <header className="mb-8 max-w-[42rem]">
          {article.kicker && (
            <p className="m-0 mb-3 font-sans text-[0.72rem] font-bold tracking-[0.12em] text-green uppercase">
              {article.kicker}
            </p>
          )}
          <h1 className="m-0 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-[1.08] font-medium">
            {article.title}
          </h1>
          {article.description && (
            <p className="mt-4 mb-0 font-sans text-[1.05rem] leading-[1.55] text-muted">
              {article.description}
            </p>
          )}
          {article.publishedAt && (
            <p className="mt-4 mb-0 font-sans text-[0.78rem] text-muted">
              <time dateTime={article.publishedAt}>
                {formatPublishedLabel(article.publishedAt)}
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
      </main>
      <SiteFooter />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isSanityConfigured() || !client) {
    return { title: "Article" };
  }

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const article = await client.fetch<ArticleDocument | null>(
    ARTICLE_QUERY,
    { slug },
    fetchOptions,
  );

  if (!article) {
    return { title: "Article not found" };
  }

  const coverImage = coverImageUrl(article.coverImage, 1200, 630) ?? undefined;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: articlePath(slug),
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      locale: "ko_KR",
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
