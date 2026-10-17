import assert from "node:assert/strict";
import { loadEnvConfig } from "@next/env";
import { parse, evaluate } from "groq-js";

loadEnvConfig(process.cwd());

async function main() {
  const { client } = await import("../src/sanity/client");
  const { articleAvailableLocales, articleSeo } = await import("../src/lib/article-seo");
  const { localeAlternates } = await import("../src/lib/locale-path");
  const { sitemapXmlResponse } = await import("../src/lib/sitemap-xml");
  const { articleJsonLd, breadcrumbJsonLd, serializeJsonLd } = await import("../src/lib/json-ld");
  const { middleware } = await import("../src/middleware");
  const { NextRequest } = await import("next/server");
  const queries = await import("../src/sanity/lib/queries");
  const { getSitemapEntries, getLocaleSitemapEntries } = await import("../src/lib/sitemap");
  const { generateMetadata } = await import("../src/app/[locale]/(site)/(pages)/articles/[slug]/page");
  const text = (value: string) => [{ _type: "block", children: [{ _type: "span", text: value }] }];
  const dataset = [
    { _id: "ko", _type: "article", slug: { current: "korean-only" }, title: "한국어 글", description: "한국어 요약", body: text("한국어 본문"), publishedAt: "2026-01-01T00:00:00Z", _updatedAt: "2026-10-16T00:00:00Z" },
    { _id: "partial", _type: "article", slug: { current: "title-only" }, title: "원문", titleEn: "Title only", titleJa: "タイトル", bodyEn: [], bodyJa: text(""), body: text("본문") },
    { _id: "all", _type: "article", slug: { current: "translated-story" }, title: "원문 제목", titleEn: "English story", titleJa: "日本語の物語", descriptionEn: "English summary", body: text("본문"), bodyEn: text("Full English body"), bodyJa: text("日本語の本文"), seoTitleEn: "Search title", seoDescriptionEn: "Search description" },
  ];
  const rows = await (await evaluate(parse(queries.SITEMAP_ARTICLES_QUERY), { dataset })).get();
  assert.equal(rows[0].hasEnglishTranslation, false);
  assert.equal(rows[0].hasJapaneseTranslation, false);
  assert.deepEqual(articleAvailableLocales(rows[1]), ["ko"]);
  assert.deepEqual(articleAvailableLocales(rows[2]), ["ko", "en", "ja"]);
  assert.equal(articleSeo({ slug: "x", title: "Title", category: "Routine", imageAlt: "", seoTitle: "  ", seoDescription: " ", description: "Summary" }, "ko").description, "Summary");

  assert(client, "Sanity project must be configured (the tests replace fetch with fixtures).");
  const originalFetch = client.fetch;
  client.fetch = (async (query: string, params: Record<string, unknown> = {}) =>
    (await evaluate(parse(query), { dataset, params })).get()) as typeof client.fetch;
  try {
    const entries = await getSitemapEntries();
    const urls = entries.map(entry => entry.url);
    assert.equal(new Set(urls).size, urls.length);
    assert(!urls.some(url => url.endsWith("/en/articles/title-only")));
    assert(!urls.some(url => url.endsWith("/ja/articles/korean-only")));
    assert.equal(entries.find(entry => entry.url.endsWith("/ko/articles/korean-only"))?.lastModified, "2026-10-16T00:00:00Z");
    for (const row of rows) {
      for (const locale of ["ko", "en", "ja"]) {
        const metadata = await generateMetadata({ params: Promise.resolve({ locale, slug: row.slug }) });
        const canonical = String(metadata.alternates?.canonical);
        assert(urls.includes(canonical));
        assert.deepEqual(metadata.alternates?.languages, entries.find(entry => entry.url === canonical)?.alternates?.languages);
        const indexable = row.slug === "translated-story" || locale === "ko";
        assert.equal(typeof metadata.robots === "object" ? metadata.robots?.index : undefined, indexable ? undefined : false);
        if (!indexable) assert(canonical.includes("/ko/articles/"));
        if (row.slug === "translated-story" && locale === "en") {
          assert.equal(metadata.title, "Search title");
          assert.equal(metadata.description, "Search description");
          assert.equal(metadata.openGraph?.title, "Search title");
        }
      }
    }
    const en = await getLocaleSitemapEntries("en");
    assert(en.every(entry => new URL(entry.url).pathname.startsWith("/en")));
    const xml = await sitemapXmlResponse(en).text();
    assert(xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
    assert(xml.includes('hreflang="ja"'));
    assert(!xml.includes("/en/articles/korean-only"));
  } finally { client.fetch = originalFetch; }

  const redirects = [
    ["/articles", "/en/articles", 308],
    ["/articles?category=Sleep", "/en/articles?category=Sleep", 308],
    ["/en/articles?locale=ja", "/ja/articles", 307],
    ["/ko?article=translated-story", "/ko/articles/translated-story", 308],
    ["/en?article=%25invalid", null, 200],
    ["/ja/articles/foot-soak-evening", "/ja/articles/foot-soak-evenning", 308],
  ] as const;
  for (const [path, destination, status] of redirects) {
    const response = middleware(new NextRequest(`https://www.pokitstory.com${path}`));
    assert.equal(response.status, status, path);
    if (destination) assert.equal(response.headers.get("location"), `https://www.pokitstory.com${destination}`);
  }
  const unsafe = { headline: '</script><script>alert("cms")</script>', description: "<routine> & wellness" };
  const serialized = serializeJsonLd(unsafe);
  assert(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), unsafe);
  const escapedXml = await sitemapXmlResponse([{ url: 'https://example.com/?q=a&b=<tag>', alternates: { languages: { en: 'https://example.com/en?q=a&b=2' } } }]).text();
  assert(escapedXml.includes("&amp;"));
  assert(escapedXml.includes("&lt;tag&gt;"));
  const article = articleJsonLd({ locale: "ko", slug: "korean-only", title: "한국어 글" });
  const breadcrumb = breadcrumbJsonLd([{ name: "글", path: "/articles/korean-only" }], "ko");
  assert.equal(article.url, breadcrumb.itemListElement[0].item);
  assert.equal(article.inLanguage, "ko-KR");
  assert.equal(localeAlternates("ja", "/articles/korean-only", { availableLocales: ["ko"] }).canonical, article.url);
  console.log("PASS: GROQ translation fixtures; metadata/sitemap agreement across 9 detail routes; SEO overrides and fallbacks; lastmod; locale XML; 6 redirect cases; Article/Breadcrumb URLs.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
