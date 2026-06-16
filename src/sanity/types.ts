import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";

export type ArticleCardData = {
  slug: string;
  title: string;
  description?: string;
  kicker?: string;
  category: string;
  imageAlt: string;
  coverImage?: SanityImageSource | null;
};

export type ArticleDocument = ArticleCardData & {
  body?: PortableTextBlock[];
  publishedAt?: string;
};

export type SectionHeading = {
  kicker?: string;
  title: string;
};

export type HomePageContent = {
  featuredArticle: ArticleCardData | null;
  leadStories: ArticleCardData[];
  spotlightRow: ArticleCardData[];
  spotlightRowSection: SectionHeading | null;
  radioLatestSection: SectionHeading | null;
  radioArticles: ArticleCardData[];
  designAwardsSection: SectionHeading | null;
  designAwards: ArticleCardData[];
  cityGuidesSection: SectionHeading | null;
  cityGuides: ArticleCardData[];
};
