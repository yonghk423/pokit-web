import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const operation = url.searchParams.get("operation");
  const query = url.searchParams.get("query")?.trim() ?? "";
  const page = Number(url.searchParams.get("page") ?? "1");
  const byId = operation === "detail" || operation === "content" || operation === "author";
  if ((operation !== "categories" && operation !== "search" && operation !== "chart" && !byId) || (byId && !/^[1-9]\d{0,11}$/.test(query))) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (operation === "search" && (!query || query.length > 100)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (!Number.isSafeInteger(page) || page < 1) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const projectUrl = process.env.POKITSTORY_SUPABASE_URL?.trim() || "https://wvvtyaxsedpqiscogrwk.supabase.co";

  try {
    const response = await fetch(`${projectUrl.replace(/\/$/, "")}/functions/v1/pokitstory-books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation, query, page }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const payload = await response.json().catch(() => ({ error: "provider_error" }));
    return NextResponse.json(payload, {
      status: response.ok ? 200 : response.status,
      headers: { "Cache-Control": response.ok && operation !== "search" ? "public, s-maxage=300, stale-while-revalidate=900" : "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
