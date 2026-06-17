import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlForImage } from "@/sanity/image";
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

  const coverUrl = article.coverImage
    ? urlForImage(article.coverImage).width(1600).height(900).fit("crop").url()
    : null;

  return (
    <>
      <SiteHeader />
      <main className="article-page mono-container">
        <Link href="/" className="article-page__back">
          ← Back to POKIT
        </Link>
        <header className="article-page__header">
          {article.kicker && (
            <p className="article-page__kicker">{article.kicker}</p>
          )}
          <h1>{article.title}</h1>
          {article.description && (
            <p className="article-page__deck">{article.description}</p>
          )}
          {article.publishedAt && (
            <p className="article-page__meta">
              {new Date(article.publishedAt).toLocaleDateString("ko-KR")}
            </p>
          )}
        </header>
        {coverUrl && (
          <figure className="article-page__cover">
            <Image
              src={coverUrl}
              alt={article.imageAlt}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
            />
          </figure>
        )}
        {article.body && (
          <div className="article-page__body prose">
            <PortableText value={article.body} />
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

export async function generateMetadata({ params }: Props) {
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

  return {
    title: `${article.title} | POKIT`,
    description: article.description,
  };
}
