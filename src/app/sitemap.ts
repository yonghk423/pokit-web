import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemap";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}
