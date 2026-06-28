import { NextRequest, NextResponse } from "next/server";

import {
  revalidateSanityContent,
  slugsFromSanityWebhook,
} from "@/lib/revalidate-sanity";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
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
