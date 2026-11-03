import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

import { appName, site } from "@/config/site";
import { isLocale, type Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/create-translator";
import { getAppPageMessages } from "@/i18n/get-app-page-messages";
import { articleSeo } from "@/lib/article-seo";
import { cn, monoContainer } from "@/lib/cn";
import { formatPublishedLabel } from "@/lib/format-published";
import { localeAlternates, localeOpenGraph, withLocale } from "@/lib/locale-path";
import { getArticleBySlug } from "@/sanity/lib/article";
import { YOURDAY_STORY_SLUGS } from "@/sanity/lib/yourday-stories";

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
      title,
      description,
      type: "article",
      siteName: appName(rawLocale),
      url: alternates.canonical,
      publishedTime: article.publishedAt,
      locale: localeOpenGraph(contentLocale),
    },
  };
}

export default async function YourdayStoryArticlePage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || !isYourdayStorySlug(slug)) notFound();
  const locale: Locale = rawLocale;
  const [article, messages] = await Promise.all([
    getArticleBySlug(slug, locale),
    getAppPageMessages(locale),
  ]);
  if (!article?.appStory || !article.body?.length) notFound();
  const t = createTranslator(messages);
  const { contentLocale } = articleSeo(article, locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    inLanguage:
      contentLocale === "ko"
        ? "ko-KR"
        : contentLocale === "ja"
          ? "ja-JP"
          : "en-US",
    datePublished: article.publishedAt,
    mainEntityOfPage: `${site.siteUrl}${withLocale(locale, `/app/yourday-story/${slug}`)}`,
    publisher: {
      "@type": "Organization",
      name: appName(locale),
      url: site.siteUrl,
    },
  };

  return (
    <>
      <main className={cn(monoContainer, "py-12 pb-20")}>
        <Link
          href={withLocale(locale, "/app/yourday-story")}
          className="mb-10 inline-block rounded-full bg-ink px-4 py-2 label-caps text-white transition-colors hover:bg-indigo"
        >
          ← {t("이야기 목록으로")}
        </Link>

        <header className="mb-10">
          <p className="m-0 mb-4 max-w-[42rem] label-caps text-green">
            {article.kicker || t("일기와 메모")}
          </p>
          <h1 className="m-0 max-w-[42rem] font-sans text-[clamp(1.75rem,3.25vw,2.65rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
            {article.title}
          </h1>
          {article.description ? (
            <p className="mt-5 mb-0 max-w-[42rem] font-sans text-[1.05rem] leading-[1.65] text-muted">
              {article.description}
            </p>
          ) : null}
          {article.publishedAt ? (
            <p className="mt-5 mb-0 max-w-[42rem] label-caps text-muted">
              <time dateTime={article.publishedAt}>
                {formatPublishedLabel(article.publishedAt, locale)}
              </time>
            </p>
          ) : null}
        </header>

        <div className="prose max-w-[42rem] font-sans text-ink">
          <PortableText value={article.body} />
        </div>

        <p className="mt-12 mb-0 max-w-[42rem] border-t border-ink/10 pt-8 font-sans text-[0.9rem] leading-relaxed text-muted">
          {t("오늘의 주인공에서 일기와 메모를 남기는 방법을 함께 살펴봐요.")}
        </p>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
