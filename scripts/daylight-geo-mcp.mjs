#!/usr/bin/env node

import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

const SITE_URL = (process.env.GEO_SITE_URL || "https://www.pokitstory.com").replace(/\/$/, "");
const LOCALES = [
  { key: "ko", sitemap: "/sitemap.xml", storePath: "/kr/" },
  { key: "en", sitemap: "/sitemap-en.xml", storePath: "/us/" },
  { key: "ja", sitemap: "/sitemap-ja.xml", storePath: "/jp/" },
  { key: "zh-TW", sitemap: "/sitemap-zh-TW.xml", storePath: "/tw/" },
];
const APP_PATH = locale => `/${locale}/app`;
const USER_AGENT = "DaylightGEOAudit/1.0";
const REQUEST_TIMEOUT_MS = 15_000;

await loadLocalEnv();

function decodeEntities(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

async function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    const content = await readFile(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]] !== undefined) continue;
      let value = match[2];
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[match[1]] = value;
    }
  } catch {
    // Environment variables may be provided by the MCP host instead.
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": USER_AGENT },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    redirect: "follow",
  });
  return { response, text: await response.text() };
}

function readAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function scriptJsonLd(html) {
  const nodes = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/type\s*=\s*["']application\/ld\+json["']/i.test(match[1])) continue;
    try {
      const parsed = JSON.parse(match[2]);
      nodes.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      nodes.push({ parseError: true });
    }
  }
  return nodes.flatMap(node => (Array.isArray(node?.["@graph"]) ? node["@graph"] : [node]));
}

function check(condition, severity, message) {
  return { status: condition ? "ok" : severity, message };
}

async function auditLocale(locale) {
  const checks = [];
  const expectedUrl = `${SITE_URL}${APP_PATH(locale.key)}`;
  try {
    const { response, text: html } = await fetchText(expectedUrl);
    const finalUrl = new URL(response.url);
    checks.push(check(response.ok, "error", `${locale.key}: app page HTTP ${response.status}`));
    checks.push(check(finalUrl.hostname === new URL(SITE_URL).hostname, "warning", `${locale.key}: redirects to ${finalUrl.hostname}`));

    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/<[^>]+>/g, "").trim();
    const h1Count = [...html.matchAll(/<h1\b/gi)].length;
    const descriptionTag = [...html.matchAll(/<meta\b[^>]*>/gi)]
      .map(match => match[0])
      .find(tag => readAttribute(tag, "name").toLowerCase() === "description");
    const description = descriptionTag ? readAttribute(descriptionTag, "content") : "";
    checks.push(check(Boolean(title), "warning", `${locale.key}: title is present`));
    checks.push(check(Boolean(description), "warning", `${locale.key}: meta description is present`));
    checks.push(check(h1Count === 1, "warning", `${locale.key}: exactly one H1 (found ${h1Count})`));

    const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)]
      .map(match => match[0])
      .find(tag => /\brel\s*=\s*["']canonical["']/i.test(tag));
    const canonical = canonicalTag ? readAttribute(canonicalTag, "href") : "";
    checks.push(check(canonical === expectedUrl || canonical === `${expectedUrl}/`, "warning", `${locale.key}: canonical points to its localized app page`));

    const alternateTags = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => match[0]);
    const hreflangs = alternateTags
      .filter(tag => /\brel\s*=\s*["']alternate["']/i.test(tag))
      .map(tag => readAttribute(tag, "hreflang"));
    const expectedHreflangs = ["ko", "en", "ja", "zh-TW"];
    const missingHreflangs = expectedHreflangs.filter(language => !hreflangs.includes(language));
    checks.push(check(missingHreflangs.length === 0, "warning", missingHreflangs.length ? `${locale.key}: missing hreflang ${missingHreflangs.join(", ")}` : `${locale.key}: all four hreflang alternates are present`));

    const application = scriptJsonLd(html).find(node => {
      const types = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
      return types.includes("SoftwareApplication");
    });
    checks.push(check(Boolean(application), "error", `${locale.key}: SoftwareApplication JSON-LD is present`));
    if (application) {
      const downloadUrl = application.downloadUrl || application.sameAs || "";
      checks.push(check(application.name === "Daylight", "warning", `${locale.key}: application name is Daylight`));
      checks.push(check(application.operatingSystem === "iOS", "warning", `${locale.key}: operating system is iOS`));
      checks.push(check(application.applicationCategory === "Lifestyle", "warning", `${locale.key}: app category is Lifestyle`));
      checks.push(check((application.featureList || []).length > 0, "warning", `${locale.key}: featureList is populated`));
      checks.push(check((application.screenshot || []).length > 0, "warning", `${locale.key}: app screenshots are included`));
      checks.push(check(downloadUrl.includes(locale.storePath), "error", `${locale.key}: App Store URL uses the expected ${locale.storePath} storefront`));
    }

    const noindex = /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)
      || /<meta\b[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(html);
    checks.push(check(!noindex, "error", `${locale.key}: page is not marked noindex`));
    return { locale: locale.key, url: response.url, status: response.status, title, checks };
  } catch (error) {
    return {
      locale: locale.key,
      url: expectedUrl,
      status: "unavailable",
      title: "",
      checks: [{ status: "error", message: `${locale.key}: request failed (${error instanceof Error ? error.message : "unknown error"})` }],
    };
  }
}

async function auditRobotsAndSitemaps() {
  const results = [];
  try {
    const { response, text } = await fetchText(`${SITE_URL}/robots.txt`);
    const botSection = text.match(/user-agent:\s*oai-searchbot([\s\S]*?)(?=\nuser-agent:|$)/i)?.[1] || "";
    const referencedSitemaps = [...text.matchAll(/^sitemap:\s*(\S+)/gim)].map(match => match[1]);
    results.push(check(response.ok, "error", `robots.txt HTTP ${response.status}`));
    const botDirectives = botSection.split(/\r?\n/).map(line => line.trim());
    const allowsRoot = botDirectives.some(line => /^allow:\s*\/\s*$/i.test(line));
    const disallowsRoot = botDirectives.some(line => /^disallow:\s*\/\s*$/i.test(line));
    results.push(check(allowsRoot && !disallowsRoot, "error", "OAI-SearchBot can crawl public pages"));
    results.push(check(referencedSitemaps.length >= 4, "warning", `robots.txt references ${referencedSitemaps.length} sitemap files`));
    for (const locale of LOCALES) {
      const sitemapUrl = `${SITE_URL}${locale.sitemap}`;
      const listed = referencedSitemaps.includes(sitemapUrl);
      results.push(check(listed, "warning", `robots.txt references ${locale.sitemap}`));
      try {
        const { response: sitemapResponse, text: xml } = await fetchText(sitemapUrl);
        const hasAppPage = xml.includes(expectedEscapedUrl(`${SITE_URL}${APP_PATH(locale.key)}`))
          || xml.includes(`${SITE_URL}${APP_PATH(locale.key)}`);
        results.push(check(sitemapResponse.ok, "error", `${locale.sitemap} HTTP ${sitemapResponse.status}`));
        results.push(check(hasAppPage, "warning", `${locale.sitemap} includes ${APP_PATH(locale.key)}`));
      } catch (error) {
        results.push({ status: "error", message: `${locale.sitemap}: request failed (${error instanceof Error ? error.message : "unknown error"})` });
      }
    }
  } catch (error) {
    results.push({ status: "error", message: `robots.txt request failed (${error instanceof Error ? error.message : "unknown error"})` });
  }
  return results;
}

function expectedEscapedUrl(value) {
  return value.replaceAll("&", "&amp;");
}

async function auditDaylightSite() {
  const started = Date.now();
  const [locales, infrastructure] = await Promise.all([
    Promise.all(LOCALES.map(locale => auditLocale(locale))),
    auditRobotsAndSitemaps(),
  ]);
  const checks = [...locales.flatMap(locale => locale.checks), ...infrastructure];
  return {
    checkedAt: new Date().toISOString(),
    site: SITE_URL,
    elapsedMs: Date.now() - started,
    summary: {
      ok: checks.filter(item => item.status === "ok").length,
      warnings: checks.filter(item => item.status === "warning").length,
      errors: checks.filter(item => item.status === "error").length,
    },
    locales,
    infrastructure,
  };
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

async function getGoogleAccessToken(serviceAccount) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const claims = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: issuedAt,
    exp: issuedAt + 3600,
  };
  const unsigned = `${base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64url(JSON.stringify(claims))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(serviceAccount.private_key, "base64url")}`;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!tokenResponse.ok) throw new Error(`Google OAuth returned HTTP ${tokenResponse.status}`);
  const tokenBody = await tokenResponse.json();
  return tokenBody.access_token;
}

async function querySearchConsolePeriod(accessToken, property, startDate, endDate, dimensions = [], dimensionFilterGroups = []) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ startDate, endDate, dimensions, dimensionFilterGroups, rowLimit: 1000 }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Search Console returned HTTP ${response.status}`);
  const body = await response.json();
  return body.rows || [];
}

function shiftIsoDate(date, days) {
  const copy = new Date(`${date}T00:00:00.000Z`);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy.toISOString().slice(0, 10);
}

function isGenerativeAiAppearance(value = "") {
  return /AI[_\s-]*(OVERVIEW|MODE)|GENERATIVE[_\s-]*AI/i.test(value);
}

async function getGoogleAiSearchVisibility() {
  const keyFile = process.env.GSC_SERVICE_ACCOUNT_KEY_FILE;
  const property = process.env.GSC_SITE_URL || "sc-domain:pokitstory.com";
  if (!keyFile) {
    return {
      configured: false,
      source: "Google Search Console API",
      reason: "GSC_SERVICE_ACCOUNT_KEY_FILE is not configured",
      setup: "Configure the read-only Search Console service account. Only AI Overview / AI Mode appearance data is eligible for the GEO performance section; regular web-search totals are excluded.",
    };
  }

  try {
    const serviceAccount = JSON.parse(await readFile(resolve(keyFile), "utf8"));
    const accessToken = await getGoogleAccessToken(serviceAccount);
    const endDate = shiftIsoDate(new Date().toISOString().slice(0, 10), -3);
    const currentStart = shiftIsoDate(endDate, -6);
    const previousEnd = shiftIsoDate(currentStart, -1);
    const previousStart = shiftIsoDate(previousEnd, -6);
    const [currentAppearances, previousAppearances] = await Promise.all([
      querySearchConsolePeriod(accessToken, property, currentStart, endDate, ["searchAppearance"]),
      querySearchConsolePeriod(accessToken, property, previousStart, previousEnd, ["searchAppearance"]),
    ]);
    const currentAiAppearances = currentAppearances.filter(row => isGenerativeAiAppearance(row.keys?.[0]));
    const previousAiAppearances = previousAppearances.filter(row => isGenerativeAiAppearance(row.keys?.[0]));
    const appearanceNames = [...new Set(currentAiAppearances.map(row => row.keys[0]))];
    const previousAppearanceNames = [...new Set(previousAiAppearances.map(row => row.keys[0]))];
    const appearances = [...new Set([...appearanceNames, ...previousAppearanceNames])];
    const [currentPagesByAppearance, previousPagesByAppearance] = appearances.length
      ? await Promise.all([
        Promise.all(appearances.map(appearance => querySearchConsolePeriod(
          accessToken, property, currentStart, endDate, ["page"], [{ groupType: "and", filters: [{ dimension: "searchAppearance", operator: "equals", expression: appearance }] }],
        ))),
        Promise.all(appearances.map(appearance => querySearchConsolePeriod(
          accessToken, property, previousStart, previousEnd, ["page"], [{ groupType: "and", filters: [{ dimension: "searchAppearance", operator: "equals", expression: appearance }] }],
        ))),
      ])
      : [[], []];
    const toMetrics = rows => rows.reduce((total, row) => ({
      clicks: total.clicks + (row.clicks || 0),
      impressions: total.impressions + (row.impressions || 0),
    }), { clicks: 0, impressions: 0 });
    const pageRows = currentPagesByAppearance.flat();
    const previousPageRows = previousPagesByAppearance.flat();
    const topPages = new Map();
    for (const row of pageRows) {
      const page = row.keys?.[0];
      if (!page) continue;
      const metrics = topPages.get(page) || { page, impressions: 0, clicks: 0 };
      metrics.impressions += row.impressions || 0;
      metrics.clicks += row.clicks || 0;
      topPages.set(page, metrics);
    }
    const previousPages = new Map();
    for (const row of previousPageRows) {
      const page = row.keys?.[0];
      if (!page) continue;
      const metrics = previousPages.get(page) || { impressions: 0, clicks: 0 };
      metrics.impressions += row.impressions || 0;
      metrics.clicks += row.clicks || 0;
      previousPages.set(page, metrics);
    }
    return {
      configured: true,
      available: appearances.length > 0,
      source: "Google Search Console API — AI Overview / AI Mode search appearances only",
      property,
      appearances,
      currentPeriod: { startDate: currentStart, endDate, metrics: toMetrics(currentAiAppearances) },
      previousPeriod: { startDate: previousStart, endDate: previousEnd, metrics: toMetrics(previousAiAppearances) },
      topPages: [...topPages.values()]
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 10)
        .map(row => ({ ...row, previousImpressions: previousPages.get(row.page)?.impressions || 0 })),
      note: "Uses only AI Overview / AI Mode searchAppearance rows exposed by the Search Console API. Missing rows mean this API did not return AI-specific data; they do not prove that the site had no AI visibility. The API result is never replaced with regular search totals. Uses the last seven complete days ending three days ago.",
    };
  } catch (error) {
    return {
      configured: true,
      available: false,
      source: "Google Search Console API — AI-only data unavailable",
      reason: error instanceof Error ? error.message : "unknown error",
    };
  }
}

function renderDailyReport(audit, aiSearch) {
  const lines = [
    `# PokitStory GEO 일일 리포트 — ${audit.checkedAt.slice(0, 10)}`,
    "",
    `- Site: ${audit.site}`,
    "",
    "## 생성형 AI 검색 노출",
  ];
  if (!aiSearch.configured) {
    lines.push(`- GEO 성과 데이터: 확인 불가 (${aiSearch.reason})`, `- 설정 안내: ${aiSearch.setup}`);
  } else if (!aiSearch.available) {
    lines.push(aiSearch.reason
      ? `- Google AI Overview / AI Mode 전용 데이터를 조회하지 못했습니다 (${aiSearch.reason}).`
      : "- Search Console API에서 Google AI Overview / AI Mode 전용 search appearance 행이 반환되지 않았습니다. 이는 AI 노출이 0이라는 뜻이 아닙니다.");
    lines.push("- 일반 Google 검색 클릭·노출·순위는 GEO 성과로 대체하지 않았습니다.");
  } else {
    const current = aiSearch.currentPeriod.metrics;
    const previous = aiSearch.previousPeriod.metrics;
    lines.push(`- 수집 범위: ${aiSearch.currentPeriod.startDate}–${aiSearch.currentPeriod.endDate} (비교 ${aiSearch.previousPeriod.startDate}–${aiSearch.previousPeriod.endDate})`);
    lines.push(`- 포함된 AI 검색 유형: ${aiSearch.appearances.join(", ")}`);
    lines.push(`- AI 기능 노출: ${current.impressions}회 (이전 ${previous.impressions}회)`);
    lines.push(`- AI 기능에서 발생한 클릭: ${current.clicks}회 (이전 ${previous.clicks}회)`);
    lines.push("- 상위 노출 페이지:");
    for (const page of aiSearch.topPages) lines.push(`  - ${page.page}: 노출 ${page.impressions}회, 클릭 ${page.clicks}회 (이전 노출 ${page.previousImpressions}회)`);
  }
  lines.push(`- 데이터 출처: ${aiSearch.source}`);
  if (aiSearch.note) lines.push(`- 해석 한계: ${aiSearch.note}`);

  lines.push("", "## GEO 기술 준비 상태");
  for (const locale of audit.locales) {
    lines.push(`- ${locale.locale} 공개 페이지 HTTP ${locale.status}; ${locale.checks.find(item => item.message.includes("SoftwareApplication JSON-LD"))?.message || "구조화 데이터 점검 결과 없음"}`);
  }
  const botCheck = audit.infrastructure.find(item => item.message.includes("OAI-SearchBot"));
  const sitemapChecks = audit.infrastructure.filter(item => item.message.includes("sitemap") || item.message.includes("Sitemap"));
  if (botCheck) lines.push(`- ${botCheck.status.toUpperCase()}: ${botCheck.message}`);
  for (const item of sitemapChecks) lines.push(`- ${item.status.toUpperCase()}: ${item.message}`);
  lines.push("", "## 해석 한계", "- Google AI 기능의 전용 노출만 GEO 성과로 집계했습니다. 일반 검색 실적은 제외했습니다.", "- API에 AI 전용 행이 없으면 AI 노출이 없다는 뜻이 아니라 API에서 분리 데이터를 받지 못했다는 뜻입니다.", "- 크롤링·사이트맵·구조화 데이터 점검은 준비 상태이며 AI 답변 인용이나 방문 성과를 뜻하지 않습니다.");
  return lines.join("\n");
}

async function buildDailyReport() {
  const [audit, aiSearch] = await Promise.all([auditDaylightSite(), getGoogleAiSearchVisibility()]);
  return { audit, aiSearch, markdown: renderDailyReport(audit, aiSearch) };
}

function textResult(value) {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

async function startMcpServer() {
  const server = new McpServer({ name: "daylight-geo", version: "0.1.0" });
  server.registerTool(
    "audit_daylight_site",
    {
      title: "Audit Daylight GEO readiness",
      description: "Read-only audit of the public Daylight app pages, SoftwareApplication JSON-LD, localized App Store URLs, robots.txt, and localized sitemaps on pokitstory.com.",
      inputSchema: z.object({}),
    },
    async () => textResult(await auditDaylightSite()),
  );
  server.registerTool(
    "get_google_ai_search_visibility",
    {
      title: "Get Google AI search visibility",
      description: "Read-only Search Console AI Overview / AI Mode search-appearance visibility only. Regular organic-search totals and queries are excluded. Requires the configured read-only service account.",
      inputSchema: z.object({}),
    },
    async () => textResult(await getGoogleAiSearchVisibility()),
  );
  server.registerTool(
    "build_daily_geo_report",
    {
      title: "Build daily Daylight GEO report",
      description: "Combines AI-specific Google Search visibility, when available, with GEO crawlability and structured-data readiness. Excludes regular SEO performance and never publishes or changes content.",
      inputSchema: z.object({}),
    },
    async () => {
      const report = await buildDailyReport();
      return { content: [{ type: "text", text: report.markdown }] };
    },
  );
  serveStdio(() => server);
}

if (process.argv.includes("--daily-report")) {
  try {
    const report = await buildDailyReport();
    process.stdout.write(`${report.markdown}\n`);
  } catch (error) {
    process.stderr.write(`Daylight GEO report failed: ${error instanceof Error ? error.message : "unknown error"}\n`);
    process.exitCode = 1;
  }
} else {
  await startMcpServer();
}
