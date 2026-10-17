import { getLocaleSitemapEntries } from "@/lib/sitemap";
import { sitemapXmlResponse } from "@/lib/sitemap-xml";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  return sitemapXmlResponse(await getLocaleSitemapEntries("en"));
}
