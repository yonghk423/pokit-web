const articleCardFields = `
  "slug": slug.current,
  title,
  description,
  kicker,
  category,
  "imageAlt": coalesce(coverImageAlt, coverImage.alt, title),
  coverImage
`;

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  featuredArticle->{${articleCardFields}},
  leadStories[]->{${articleCardFields}},
  spotlightRow[]->{${articleCardFields}},
  spotlightRowSection,
  radioLatestSection,
  radioArticles[]->{${articleCardFields}},
  designAwardsSection,
  designAwards[]->{${articleCardFields}},
  cityGuidesSection,
  cityGuides[]->{${articleCardFields}}
}`;

export const ARTICLE_QUERY = `*[_type == "article" && slug.current == $slug][0]{
  ${articleCardFields},
  body,
  publishedAt
}`;

export const ARTICLE_SLUGS_QUERY = `*[_type == "article" && defined(slug.current)]{
  "slug": slug.current
}`;

export const SITEMAP_ARTICLES_QUERY = `*[_type == "article" && defined(slug.current)]{
  "slug": slug.current,
  publishedAt
}`;
