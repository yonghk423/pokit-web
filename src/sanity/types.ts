import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";

export type ArticleCardData = {
  slug: string;
  title: string;
  titleKo?: string;
  description?: string;
  kicker?: string;
  category: string;
  imageAlt: string;
  coverImage?: SanityImageSource | null;
  coverImageLqip?: string | null;
  publishedAt?: string;
  hasEnglishTranslation?: boolean;
};

export type ArticleDocument = ArticleCardData & {
  body?: PortableTextBlock[];
  publishedAt?: string;
  durationMinutes?: number;
  categoryKey?: string;
};

/** POKIT 앱 WebView 브릿지용 아티클 메타 */
export type PokitRoutineArticle = {
  slug: string;
  title: string;
  titleKo?: string;
  description?: string;
  category: string;
  categoryKey?: string;
  durationMinutes: number;
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
