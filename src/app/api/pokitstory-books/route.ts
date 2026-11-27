import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Operation = "bestseller" | "search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const operation = url.searchParams.get("operation") as Operation | null;
  const query = url.searchParams.get("query")?.trim() ?? "";
  if (operation !== "bestseller" && operation !== "search") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (operation === "search" && (!query || query.length > 100)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const projectUrl = process.env.POKITSTORY_SUPABASE_URL?.trim() || "https://wvvtyaxsedpqiscogrwk.supabase.co";

  try {
    const response = await fetch(`${projectUrl.replace(/\/$/, "")}/functions/v1/pokitstory-books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation, ...(operation === "search" ? { query } : {}) }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const payload = await response.json().catch(() => ({ error: "provider_error" }));
    return NextResponse.json(payload, {
      status: response.ok ? 200 : response.status,
      headers: { "Cache-Control": operation === "bestseller" ? "public, s-maxage=300, stale-while-revalidate=900" : "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
