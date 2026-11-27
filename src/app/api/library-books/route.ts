import { NextResponse } from "next/server";

import { isLocale, type Locale } from "@/i18n/config";
import { searchAppleBooks } from "@/lib/apple-books";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawLocale = url.searchParams.get("locale") ?? "en";
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const query = url.searchParams.get("query")?.trim() ?? "";
  const page = Number(url.searchParams.get("page") ?? "1");

  if (!query || query.length > 100) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (!Number.isSafeInteger(page) || page < 1) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const result = await searchAppleBooks({ query, locale, page });
    return NextResponse.json(result, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
