import { NextResponse } from "next/server";

import { isLocale, type Locale } from "@/i18n/config";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl } from "@/sanity/image";
import { getRoutineToolBySlug } from "@/sanity/lib/fetch";

type Params = { params: Promise<{ slug: string }> };

function isValidToolSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function GET(request: Request, { params }: Params) {
  if (!isSanityConfigured()) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  if (!isValidToolSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale") ?? "ko";
  if (!isLocale(localeParam)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  const locale: Locale = localeParam;

  const tool = await getRoutineToolBySlug(locale, slug);
  if (!tool) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    slug: tool.slug,
    name: tool.name,
    summary: tool.summary ?? null,
    imageAlt: tool.imageAlt ?? tool.name,
    body: tool.body ?? null,
    coverUrl: coverImageUrl(tool.image, 900, 1200),
    imageLqip: tool.imageLqip ?? null,
    hasEnglishTranslation: tool.hasEnglishTranslation,
    hasJapaneseTranslation: tool.hasJapaneseTranslation,
  });
}
