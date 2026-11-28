import { NextResponse } from "next/server";

import { isLocale, type Locale } from "@/i18n/config";
import { fetchAppleBooksChart, searchAppleBooks } from "@/lib/apple-books";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawLocale = url.searchParams.get("locale") ?? "en";
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const query = url.searchParams.get("query")?.trim() ?? "";
  const page = Number(url.searchParams.get("page") ?? "1");
  const genreId = url.searchParams.get("genre") ?? undefined;

  if (url.searchParams.get("operation") === "chart") {
    if (locale === "ko" || (query !== "topfreeebooks" && query !== "toppaidebooks")) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    try {
      const items = await fetchAppleBooksChart(locale, query);
      return NextResponse.json({ items }, { headers: { "Cache-Control": "public, s-maxage=300" } });
    } catch {
      return NextResponse.json({ error: "provider_error" }, { status: 502 });
    }
  }
  if (!query || query.length > 100) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (genreId !== undefined && !/^\d{1,8}$/.test(genreId)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (!Number.isSafeInteger(page) || page < 1) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const result = await searchAppleBooks({ query, locale, page, genreId });
    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
