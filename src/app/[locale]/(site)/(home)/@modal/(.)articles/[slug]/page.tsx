import { notFound } from "next/navigation";
import { RoutedArticlePreview } from "@/components/routed-article-preview";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { isValidArticleSlug } from "@/lib/article-path";
import { getArticleBySlug } from "@/sanity/lib/article";
import { coverImageUrl } from "@/sanity/image";

import { generateMetadata as articleMetadata } from "@/app/[locale]/(site)/(pages)/articles/[slug]/page";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  return articleMetadata(props);
}

export default async function ArticleModalPage({ params }: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isValidArticleSlug(slug)) notFound();
  const article = await getArticleBySlug(slug, locale);
  if (!article) notFound();
  const dict = await getDictionary(locale);
  const metadata = await articleMetadata({ params });
  const seo = {
    title: `${article.title} | POKIT`,
    description: String(metadata.description ?? ""),
    canonical: String(metadata.alternates?.canonical ?? ""),
    languages: Object.fromEntries(Object.entries(metadata.alternates?.languages ?? {})
      .map(([lang, href]) => [lang, String(href)])),
  };
  return <RoutedArticlePreview seo={seo} article={article} locale={locale}
    imageUrl={coverImageUrl(article.coverImage, 1200, 675)}
    categoryLabels={dict.categories} closeLabel={dict.home.closePreview}
    addToPokit={dict.article.addToPokit} />;
}
