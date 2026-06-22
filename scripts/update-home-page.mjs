import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p1a0jtm8",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-15",
  token,
  useCdn: false,
});

function ref(id, key) {
  return { _type: "reference", _ref: id, _key: key };
}

/** 공간 섹션에 포함 가능한 Routine slug (home.ts 와 동일) */
const SPACE_ROUTINE_SLUGS = new Set([
  "minimal-desk-design",
  "kitchen-dish-minimal",
  "home-workout-session",
  "afternoon-focus-reset",
  "phone-outside-bedroom",
  "evening-phone-basket",
  "desk-stretch-5min",
]);

/** 섹션 주제 = article.category 와 일치해야 함 */
const HOME_PAGE_BY_SLUG = {
  featuredArticle: { slug: "screen-free-sunday-morning", category: "Affairs" },
  leadStories: [
    { slug: "weekly-review-ten-minutes", category: "Affairs" },
    { slug: "monday-morning-no-meetings", category: "Affairs" },
    { slug: "friday-evening-shutdown", category: "Affairs" },
    { slug: "deep-work-morning-block", category: "Affairs" },
    { slug: "sunday-night-weekly-plan", category: "Affairs" },
    { slug: "friday-three-wins", category: "Affairs" },
    { slug: "weekly-focus-one-word", category: "Affairs" },
    { slug: "calendar-tomorrow-tonight", category: "Affairs" },
    { slug: "thursday-three-priorities", category: "Affairs" },
    { slug: "morning-inbox-fifteen", category: "Affairs" },
  ],
  spotlightRow: [
    { slug: "10", category: "Routine" },
    { slug: "25-5", category: "Routine" },
    { slug: "balanced-eating-out", category: "Routine" },
    { slug: "morning-seven-stretch", category: "Routine" },
    { slug: "lunch-walk-fifteen-min", category: "Routine" },
    { slug: "morning-window-light-five", category: "Routine" },
    { slug: "five-minute-room-reset", category: "Routine" },
    { slug: "protein-first-breakfast", category: "Routine" },
    { slug: "digital-sunset-nine-pm", category: "Routine" },
    { slug: "evening-herbal-tea", category: "Routine" },
    { slug: "midday-posture-check", category: "Routine" },
    { slug: "afternoon-no-caffeine", category: "Routine" },
  ],
  radioArticles: [
    { slug: "podcast-walking-commute", category: "Radio" },
    { slug: "silent-commute-challenge", category: "Radio" },
    { slug: "morning-playlist-one-song", category: "Radio" },
    { slug: "ambient-hour-deep-work", category: "Radio" },
    { slug: "one-album-weekend-listen", category: "Radio" },
    { slug: "ten-minute-silence-before-bed", category: "Radio" },
    { slug: "bus-window-ten-minutes", category: "Radio" },
    { slug: "commute-podcast-queue", category: "Radio" },
    { slug: "voice-memo-walk-home", category: "Radio" },
    { slug: "thursday-drive-no-audio", category: "Radio" },
    { slug: "weekly-news-digest-only", category: "Radio" },
    { slug: "platform-breath-three", category: "Radio" },
  ],
  designAwards: [
    { slug: "minimal-desk-design", category: "Routine" },
    { slug: "kitchen-dish-minimal", category: "Routine" },
    { slug: "one-object-desk-joy", category: "Design" },
    { slug: "mirror-catches-morning-light", category: "Design" },
    { slug: "kitchen-counter-nightly", category: "Design" },
    { slug: "bedside-table-two-items", category: "Design" },
    { slug: "one-plant-desk-corner", category: "Design" },
    { slug: "whiteboard-weekly-three", category: "Design" },
    { slug: "entryway-drop-zone", category: "Design" },
    { slug: "drawer-one-tray-system", category: "Design" },
    { slug: "shoe-rack-by-door", category: "Design" },
    { slug: "bookshelf-top-clear", category: "Design" },
  ],
  cityGuides: [
    { slug: "bedtime-stretch-five", category: "Wellness" },
    { slug: "after-dinner-walk-ten", category: "Wellness" },
    { slug: "park-bench-lunch-reset", category: "Wellness" },
    { slug: "stairs-one-floor-daily", category: "Wellness" },
    { slug: "morning-two-glasses-water", category: "Wellness" },
    { slug: "diaphragm-breath-five", category: "Wellness" },
    { slug: "twenty-twenty-eye-rule", category: "Wellness" },
    { slug: "warm-shower-wind-down", category: "Wellness" },
    { slug: "foot-soak-evenning", category: "Wellness" },
    { slug: "neck-roll-at-desk", category: "Wellness" },
    { slug: "calf-stretch-in-bed", category: "Wellness" },
    { slug: "chamomile-bedtime-cup", category: "Wellness" },
  ],
};

const SECTION_HEADINGS = {
  spotlightRowSection: {
    kicker: "루틴",
    title: "지금 시작하기 좋은 루틴",
  },
  radioLatestSection: {
    kicker: "이동·휴식",
    title: "이동과 쉬는 시간",
  },
  designAwardsSection: {
    kicker: "공간",
    title: "공간을 다시 짜는 이야기",
  },
  cityGuidesSection: {
    kicker: "웰니스",
    title: "바쁜 하루, 몸을 위한 10분",
  },
};

function collectEntries(layout) {
  const entries = [];
  if (layout.featuredArticle) entries.push(layout.featuredArticle);
  for (const key of [
    "leadStories",
    "spotlightRow",
    "radioArticles",
    "designAwards",
    "cityGuides",
  ]) {
    for (const entry of layout[key] ?? []) {
      entries.push(entry);
    }
  }
  return entries;
}

async function resolveLayout(layout) {
  const entries = collectEntries(layout);
  const slugs = [...new Set(entries.map((entry) => entry.slug))];

  const articles = await client.fetch(
    `*[_type == "article" && slug.current in $slugs]{
      _id,
      "slug": slug.current,
      title,
      category,
      "hasCover": defined(coverImage.asset)
    }`,
    { slugs },
  );
  const bySlug = new Map(articles.map((a) => [a.slug, a]));

  const missing = slugs.filter((slug) => !bySlug.has(slug));
  if (missing.length > 0) {
    throw new Error(`Missing articles for slugs: ${missing.join(", ")}`);
  }

  for (const entry of entries) {
    const article = bySlug.get(entry.slug);
    const isSpaceRoutine =
      article.category === "Routine" && SPACE_ROUTINE_SLUGS.has(entry.slug);

    if (layout.designAwards.some((d) => d.slug === entry.slug)) {
      if (article.category === "Design" || isSpaceRoutine) {
        continue;
      }
      throw new Error(
        `Space section: ${entry.slug} must be Design or a space Routine slug`,
      );
    }

    if (article.category !== entry.category) {
      throw new Error(
        `Category mismatch for ${entry.slug}: expected ${entry.category}, got ${article.category}`,
      );
    }
  }

  const withoutCover = articles.filter((a) => !a.hasCover).map((a) => a.slug);
  if (withoutCover.length > 0) {
    console.warn("No cover image (placeholder on site):", withoutCover.join(", "));
  }

  return {
    featuredArticle: ref(bySlug.get(layout.featuredArticle.slug)._id, "featured"),
    leadStories: layout.leadStories.map((entry, i) =>
      ref(bySlug.get(entry.slug)._id, `lead${i + 1}`),
    ),
    spotlightRow: layout.spotlightRow.map((entry, i) =>
      ref(bySlug.get(entry.slug)._id, `spot${i + 1}`),
    ),
    radioArticles: layout.radioArticles.map((entry, i) =>
      ref(bySlug.get(entry.slug)._id, `radio${i + 1}`),
    ),
    designAwards: layout.designAwards.map((entry, i) =>
      ref(bySlug.get(entry.slug)._id, `design${i + 1}`),
    ),
    cityGuides: layout.cityGuides.map((entry, i) =>
      ref(bySlug.get(entry.slug)._id, `city${i + 1}`),
    ),
  };
}

async function main() {
  const layout = await resolveLayout(HOME_PAGE_BY_SLUG);
  await client
    .patch("homePage")
    .set({ ...layout, ...SECTION_HEADINGS })
    .commit();

  const result = await client.fetch(`*[_id == "homePage"][0]{
    featuredArticle->{ "slug": slug.current, title, category },
    leadStories[]->{ "slug": slug.current, category },
    spotlightRow[]->{ "slug": slug.current, category },
    radioArticles[]->{ "slug": slug.current, category },
    designAwards[]->{ "slug": slug.current, category },
    cityGuides[]->{ "slug": slug.current, category }
  }`);

  console.log("Home Page updated by section:\n");
  console.log("Affairs (한 주를 여는 이야기):");
  console.log("  featured:", result.featuredArticle?.slug, result.featuredArticle?.category);
  result.leadStories?.forEach((a) => console.log("  lead:", a.slug, a.category));

  console.log("\nRoutine (지금 시작하기 좋은 루틴):");
  result.spotlightRow?.forEach((a) => console.log(" ", a.slug, a.category));

  console.log("\nRadio (이동과 쉬는 시간):");
  result.radioArticles?.forEach((a) => console.log(" ", a.slug, a.category));

  console.log("\n공간 (공간을 다시 짜는 이야기):");
  result.designAwards?.forEach((a) => console.log(" ", a.slug, a.category));

  console.log("\nWellness (바쁜 하루, 몸을 위한 10분):");
  result.cityGuides?.forEach((a) => console.log(" ", a.slug, a.category));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
