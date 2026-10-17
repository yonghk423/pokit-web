import type { MetadataRoute } from "next";

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

/** Serialize the URL fields shared by our full and language-specific sitemaps. */
export function sitemapXmlResponse(entries: MetadataRoute.Sitemap): Response {
  const urls = entries.map(entry => {
    const fields = [`<loc>${escapeXml(entry.url)}</loc>`];
    if (entry.lastModified) {
      const date = entry.lastModified instanceof Date
        ? entry.lastModified.toISOString() : entry.lastModified;
      fields.push(`<lastmod>${escapeXml(date)}</lastmod>`);
    }
    if (entry.changeFrequency) fields.push(`<changefreq>${entry.changeFrequency}</changefreq>`);
    if (entry.priority !== undefined) fields.push(`<priority>${entry.priority}</priority>`);
    return `  <url>${fields.join("")}</url>`;
  });
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.join("\n") + "\n</urlset>\n";
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
