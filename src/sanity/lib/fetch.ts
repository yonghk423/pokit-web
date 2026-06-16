import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { HomePageContent, SectionHeading } from "@/sanity/types";

const fetchOptions = { next: { revalidate: 60 } };

const DEFAULT_RADIO_LATEST_SECTION: SectionHeading = {
  title: "Latest from POKIT radio",
};

const DEFAULT_SPOTLIGHT_ROW_SECTION: SectionHeading = {
  kicker: "Editor's Pick",
  title: "지금 주목할 이야기",
};

const DEFAULT_DESIGN_AWARDS_SECTION: SectionHeading = {
  kicker: "Design Awards",
  title: "더 나은 하루를 만드는 작은 디자인",
};

const DEFAULT_CITY_GUIDES_SECTION: SectionHeading = {
  kicker: "City Guides",
  title: "도시의 리듬으로 배우는 웰니스",
};

function withSectionDefaults(
  section: SectionHeading | null,
  defaults: SectionHeading,
): SectionHeading {
  return {
    kicker: section?.kicker ?? defaults.kicker,
    title: section?.title ?? defaults.title,
  };
}

const emptyHomeContent = (): HomePageContent => ({
  featuredArticle: null,
  leadStories: [],
  spotlightRow: [],
  spotlightRowSection: null,
  radioLatestSection: null,
  radioArticles: [],
  designAwardsSection: null,
  designAwards: [],
  cityGuidesSection: null,
  cityGuides: [],
});

export async function getHomePageContent(): Promise<HomePageContent> {
  if (!isSanityConfigured() || !client) {
    console.warn(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local.",
    );
    return emptyHomeContent();
  }

  try {
    const content = await client.fetch<HomePageContent | null>(
      HOME_PAGE_QUERY,
      {},
      fetchOptions,
    );

    if (!content) {
      return emptyHomeContent();
    }

    return {
      featuredArticle: content.featuredArticle ?? null,
      leadStories: content.leadStories?.filter(Boolean) ?? [],
      spotlightRow: content.spotlightRow?.filter(Boolean) ?? [],
      spotlightRowSection: withSectionDefaults(
        content.spotlightRowSection,
        DEFAULT_SPOTLIGHT_ROW_SECTION,
      ),
      radioLatestSection: withSectionDefaults(
        content.radioLatestSection,
        DEFAULT_RADIO_LATEST_SECTION,
      ),
      radioArticles: content.radioArticles?.filter(Boolean) ?? [],
      designAwardsSection: withSectionDefaults(
        content.designAwardsSection,
        DEFAULT_DESIGN_AWARDS_SECTION,
      ),
      designAwards: content.designAwards?.filter(Boolean) ?? [],
      cityGuidesSection: withSectionDefaults(
        content.cityGuidesSection,
        DEFAULT_CITY_GUIDES_SECTION,
      ),
      cityGuides: content.cityGuides?.filter(Boolean) ?? [],
    };
  } catch (error) {
    console.warn("Failed to fetch home page from Sanity:", error);
    return emptyHomeContent();
  }
}
