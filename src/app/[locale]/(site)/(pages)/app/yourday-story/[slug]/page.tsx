import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "@/components/yourday-story.module.css";
import { appName, site } from "@/config/site";
import { isLocale, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getAppPageMessages } from "@/i18n/get-app-page-messages";
import { articleSeo } from "@/lib/article-seo";
import { formatPublishedLabel } from "@/lib/format-published";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
import { getArticleBySlug } from "@/sanity/lib/article";
import { YOURDAY_STORY_SLUGS } from "@/sanity/lib/yourday-stories";
import walk from "@/assets/app-demo/walk.webp";
import coffee from "@/assets/app-demo/coffee.webp";
import books from "@/assets/app-demo/books.webp";

const illustrations = [walk, coffee, books];

type Props = { params: Promise<{ locale: string; slug: string }> };
function isYourdayStorySlug(slug: string) {
  return YOURDAY_STORY_SLUGS.some((storySlug) => storySlug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || !isYourdayStorySlug(slug)) return { title: "Story" };
  const article = await getArticleBySlug(slug, rawLocale);
  if (!article?.appStory) return { title: "Story not found" };
  const { availableLocales, contentLocale, title, description } = articleSeo(article, rawLocale);
  const canonicalPath = `/app/yourday-story/${slug}`;
  const alternates = localeAlternates(rawLocale, canonicalPath, { availableLocales });
  return {
    title: `${title} | ${appName(rawLocale)}`,
    description,
    alternates,
    openGraph: {
      title, description, type: "article", siteName: appName(rawLocale),
      url: alternates.canonical, publishedTime: article.publishedAt,
      locale: localeOpenGraph(contentLocale),
    },
  };
}

export default async function YourdayStoryArticlePage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || !isYourdayStorySlug(slug)) notFound();
  const locale: Locale = rawLocale;
  const [article, messages] = await Promise.all([
    getArticleBySlug(slug, locale), getAppPageMessages(locale),
  ]);
  if (!article?.appStory || !article.body?.length) notFound();
  const t = createTranslator(messages);
  const imageIndex = Math.max(0, YOURDAY_STORY_SLUGS.indexOf(slug as (typeof YOURDAY_STORY_SLUGS)[number]));
  const { contentLocale } = articleSeo(article, locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    inLanguage: contentLocale === "ko" ? "ko-KR" : contentLocale === "ja" ? "ja-JP" : "en-US",
    datePublished: article.publishedAt,
    mainEntityOfPage: `${site.siteUrl}${withLocale(locale, `/app/yourday-story/${slug}`)}`,
    publisher: { "@type": "Organization", name: appName(locale), url: site.siteUrl },
  };

  return <main className={styles.page} data-yourday-story>
    <div className={styles.shell}>
      <header className={styles.masthead}>
        <span className={styles.brand}>{t("YOURDAY STORY")}</span>
      </header>
      <article className={styles.article}>
        <Link className={styles.articleBack} href={withLocale(locale, "/app/yourday-story")}>← {t("이야기 목록으로")}</Link>
        <figure className={styles.art}>
          <Image src={illustrations[imageIndex]} alt="" sizes="(max-width: 760px) 100vw, 740px" priority />
        </figure>
        <header className={styles.articleHeader}>
          {article.kicker && <p className={styles.eyebrow}>{article.kicker}</p>}
          <h1>{article.title}</h1>
          <p className={styles.articleDescription}>{article.description}</p>
          {article.publishedAt && <p className={styles.date}><time dateTime={article.publishedAt}>{formatPublishedLabel(article.publishedAt, locale)}</time></p>}
        </header>
        <div className={styles.body}><PortableText value={article.body} /></div>
        <p className={styles.footerNote}>{t("오늘의 주인공에서 일기와 메모를 남기는 방법을 함께 살펴봐요.")}</p>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  </main>;
}
