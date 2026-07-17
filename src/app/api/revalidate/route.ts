import { NextRequest, NextResponse } from "next/server";

import {
  revalidateSanityContent,
  slugsFromSanityWebhook,
} from "@/lib/revalidate-sanity";

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!configuredSecret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  const querySecret = request.nextUrl.searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : null;
  const secret = querySecret || bearerSecret;

  if (secret !== configuredSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const slugs = slugsFromSanityWebhook(body);
  const result = revalidateSanityContent(slugs);

  return NextResponse.json({
    revalidated: true,
    ...result,
    at: new Date().toISOString(),
  });
}
