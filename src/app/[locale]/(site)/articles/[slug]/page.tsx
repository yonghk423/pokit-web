import { notFound, permanentRedirect } from "next/navigation";

import { isLocale } from "@/i18n/config";
import { isValidArticleSlug } from "@/lib/article-path";
import { withLocale } from "@/lib/locale-path";

export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Legacy article URLs redirect to the home preview modal. */
export default async function ArticlePage({ params }: Props) {
  const { locale: rawLocale, slug: rawSlug } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const slug = decodeURIComponent(rawSlug);
  if (!isValidArticleSlug(slug)) {
    notFound();
  }

  permanentRedirect(
    `${withLocale(rawLocale, "/")}?article=${encodeURIComponent(slug)}`,
  );
}
