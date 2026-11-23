import type { MetadataRoute } from "next";

import { sitemapPaths } from "@/lib/sitemap-paths";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: "/studio/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: "/studio/",
      },
    ],
    sitemap: sitemapPaths.map(path => `${site.siteUrl}${path}`),
  };
}
