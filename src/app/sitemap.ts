import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { briefingWeekPath } from "@/lib/briefing-path";
import { newArrivalsWeekPath } from "@/lib/new-arrivals-path";
import { withLocale } from "@/lib/locale-path";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetchOptions } from "@/sanity/lib/cache";
import {
  SITEMAP_DIGESTS_QUERY,
  SITEMAP_NEW_ARRIVALS_QUERY,
} from "@/sanity/lib/queries";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/articles",
    "/briefing",
    "/new-arrivals",
    "/app",
    "/support",
  ] as const;

  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${site.siteUrl}${withLocale(locale, path)}`,
      changeFrequency:
        path === "" ||
        path === "/articles" ||
        path === "/briefing" ||
        path === "/new-arrivals" ||
        path === "/app"
          ? "weekly"
          : "monthly",
      priority:
        path === ""
          ? 1
          : path === "/articles" ||
              path === "/briefing" ||
              path === "/new-arrivals" ||
              path === "/app"
            ? 0.9
            : 0.5,
    })),
  );

  if (!isSanityConfigured() || !client) {
    return staticPages;
  }

  const [digests, newArrivals] = await Promise.all([
    client.fetch<{ weekOf: string; _updatedAt?: string }[]>(
      SITEMAP_DIGESTS_QUERY,
      {},
      sanityFetchOptions,
    ),
    client.fetch<{ weekOf: string; _updatedAt?: string }[]>(
      SITEMAP_NEW_ARRIVALS_QUERY,
      {},
      sanityFetchOptions,
    ),
  ]);

  const digestPages: MetadataRoute.Sitemap = (digests ?? [])
    .filter(({ weekOf }) => weekOf)
    .flatMap(({ weekOf, _updatedAt }) =>
      locales.map((locale) => ({
        url: `${site.siteUrl}${briefingWeekPath(locale, weekOf)}`,
        lastModified: _updatedAt ? new Date(_updatedAt) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
    );

  const newArrivalsPages: MetadataRoute.Sitemap = (newArrivals ?? [])
    .filter(({ weekOf }) => weekOf)
    .flatMap(({ weekOf, _updatedAt }) =>
      locales.map((locale) => ({
        url: `${site.siteUrl}${newArrivalsWeekPath(locale, weekOf)}`,
        lastModified: _updatedAt ? new Date(_updatedAt) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
    );

  return [...staticPages, ...digestPages, ...newArrivalsPages];
}
