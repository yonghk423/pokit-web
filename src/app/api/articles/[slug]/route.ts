import { NextResponse } from "next/server";

import { isLocale, type Locale } from "@/i18n/config";
import { isValidArticleSlug } from "@/lib/article-path";
import { getArticleBySlug } from "@/sanity/lib/article";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl } from "@/sanity/image";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Params) {
  if (!isSanityConfigured()) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  if (!isValidArticleSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale") ?? "ko";
  if (!isLocale(localeParam)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  const locale: Locale = localeParam;

  const article = await getArticleBySlug(slug, locale);
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    slug: article.slug,
    title: article.title,
    titleKo: article.titleKo ?? article.title,
    description: article.description ?? null,
    kicker: article.kicker ?? null,
    category: article.category,
    categoryKey: article.categoryKey ?? null,
    durationMinutes: article.durationMinutes ?? null,
    imageAlt: article.imageAlt,
    publishedAt: article.publishedAt ?? null,
    body: article.body ?? null,
    coverUrl: coverImageUrl(article.coverImage, 900, 1200),
    coverImageLqip: article.coverImageLqip ?? null,
    hasEnglishTranslation: article.hasEnglishTranslation,
    hasJapaneseTranslation: article.hasJapaneseTranslation,
  });
}
