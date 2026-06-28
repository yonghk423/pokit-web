const articleCardFields = `
  "slug": slug.current,
  title,
  description,
  kicker,
  category,
  "imageAlt": coalesce(coverImageAlt, coverImage.alt, title),
  coverImage,
  "coverImageLqip": coverImage.asset->metadata.lqip,
  publishedAt
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

export const ARTICLES_COUNT_QUERY = `count(*[_type == "article" && defined(slug.current) && ($q == "" || title match $pattern || coalesce(description, "") match $pattern || coalesce(kicker, "") match $pattern || category match $pattern)])`;

export const ARTICLES_COUNT_BY_CATEGORY_QUERY = `count(*[_type == "article" && defined(slug.current) && category == $category && ($q == "" || title match $pattern || coalesce(description, "") match $pattern || coalesce(kicker, "") match $pattern || category match $pattern)])`;

export const ARTICLES_RECENT_BY_CATEGORY_QUERY = `*[_type == "article" && defined(slug.current) && category == $category] | order(publishedAt desc)[0...$limit]{
  ${articleCardFields}
}`;

export const ARTICLES_DESIGN_SPACE_POOL_QUERY = `*[_type == "article" && defined(slug.current) && (
  category == "Design" ||
  (category == "Routine" && slug.current in $routineSlugs)
)] | order(publishedAt desc)[0...$limit]{
  ${articleCardFields}
}`;

export const ARTICLES_PAGINATED_QUERY = `*[_type == "article" && defined(slug.current) && ($q == "" || title match $pattern || coalesce(description, "") match $pattern || coalesce(kicker, "") match $pattern || category match $pattern)] | order(publishedAt desc) [$start...$end]{
  ${articleCardFields}
}`;

export const ARTICLES_PAGINATED_BY_CATEGORY_QUERY = `*[_type == "article" && defined(slug.current) && category == $category && ($q == "" || title match $pattern || coalesce(description, "") match $pattern || coalesce(kicker, "") match $pattern || category match $pattern)] | order(publishedAt desc) [$start...$end]{
  ${articleCardFields}
}`;
