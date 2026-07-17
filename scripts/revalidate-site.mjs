/**
 * Trigger Next.js on-demand revalidation on the deployed site.
 *
 * Requires in .env.local:
 *   SANITY_REVALIDATE_SECRET
 *   REVALIDATE_SITE_URL (default https://pokitstory.com)
 *
 * Usage:
 *   node scripts/revalidate-site.mjs
 *   node scripts/revalidate-site.mjs calendar-two-empty-blocks fridge-photo-before-grocery
 */
import { config } from "dotenv";

config({ path: ".env.local" });

const secret = process.env.SANITY_REVALIDATE_SECRET;
const siteUrl = (process.env.REVALIDATE_SITE_URL || "https://pokitstory.com").replace(
  /\/$/,
  "",
);

if (!secret) {
  console.error("Missing SANITY_REVALIDATE_SECRET in .env.local");
  process.exit(1);
}

const slugs = process.argv.slice(2).filter(Boolean);
const body =
  slugs.length === 0
    ? {}
    : slugs.length === 1
      ? { slug: { current: slugs[0] } }
      : slugs.map((slug) => ({ slug: { current: slug } }));

const url = `${siteUrl}/api/revalidate?secret=${encodeURIComponent(secret)}`;

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  json = { raw: text };
}

if (!res.ok) {
  console.error("Revalidate failed:", res.status, json);
  process.exit(1);
}

console.log("Revalidated:", json);
