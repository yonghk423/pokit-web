import { siteName } from "@/config/site";
import { notFound } from "next/navigation";
import { RoutedArticlePreview } from "@/components/routed-article-preview";
import { isLocale } from "@/i18n/config";
import { getAppInstallMessages } from "@/i18n/get-app-install-messages";
import { createTranslator } from "@/i18n/create-translator";
import { getHomeMessages } from "@/i18n/get-home-messages";
import { getCommonMessages } from "@/i18n/get-common-messages";
import { createCategoryLabels } from "@/i18n/category-labels";
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
  const [commonMessages, installMessages, homeMessages] = await Promise.all([
    getCommonMessages(locale),
    getAppInstallMessages(locale),
    getHomeMessages(locale),
  ]);
  const categoryLabels = createCategoryLabels(createTranslator(commonMessages));
  const t = createTranslator(homeMessages);
  const metadata = await articleMetadata({ params });
  const seo = {
    title: `${String(metadata.title ?? article.title)} | ${siteName()}`,
    description: String(metadata.description ?? ""),
    robots: metadata.robots ? "noindex, follow" : "index, follow",
    canonical: String(metadata.alternates?.canonical ?? ""),
    languages: Object.fromEntries(Object.entries(metadata.alternates?.languages ?? {})
      .map(([lang, href]) => [lang, String(href)])),
  };
  return <RoutedArticlePreview seo={seo} article={article} locale={locale}
    imageUrl={coverImageUrl(article.coverImage, 1200, 675)}
    categoryLabels={categoryLabels} closeLabel={t("목록으로")}
    installMessages={installMessages} />;
}
