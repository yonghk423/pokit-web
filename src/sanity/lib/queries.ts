const localizedString = (field: string) =>
  `select($locale == "en" => coalesce(${field}En, ${field}), ${field})`;

const localizedTextSearch = (field: string) =>
  `($locale == "en"
    ? (coalesce(${field}En, ${field}) match $pattern)
    : (${field} match $pattern))`;

const articleCardFields = `
  "slug": slug.current,
  "title": ${localizedString("title")},
  "titleKo": title,
  "description": ${localizedString("description")},
  "kicker": ${localizedString("kicker")},
  category,
  "imageAlt": select(
    $locale == "en" => coalesce(coverImageAltEn, coverImageAlt, coverImage.alt, coalesce(titleEn, title)),
    coalesce(coverImageAlt, coverImage.alt, title)
  ),
  coverImage,
  "coverImageLqip": coverImage.asset->metadata.lqip,
  publishedAt,
  "hasEnglishTranslation": defined(titleEn) && length(titleEn) > 0
`;

const sectionHeadingProjection = `{
  "kicker": select($locale == "en" => coalesce(kickerEn, kicker), kicker),
  "title": select($locale == "en" => coalesce(titleEn, title), title)
}`;

const searchFilter = `(
  $q == "" ||
  ${localizedTextSearch("title")} ||
  ${localizedTextSearch("description")} ||
  ${localizedTextSearch("kicker")} ||
  category match $pattern
)`;

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  featuredArticle->{${articleCardFields}},
  leadStories[]->{${articleCardFields}},
  spotlightRow[]->{${articleCardFields}},
  spotlightRowSection${sectionHeadingProjection},
  radioLatestSection${sectionHeadingProjection},
  radioArticles[]->{${articleCardFields}},
  designAwardsSection${sectionHeadingProjection},
  designAwards[]->{${articleCardFields}},
  cityGuidesSection${sectionHeadingProjection},
  cityGuides[]->{${articleCardFields}}
}`;

export const ARTICLE_QUERY = `*[_type == "article" && slug.current == $slug][0]{
  ${articleCardFields},
  "body": select($locale == "en" => coalesce(bodyEn, body), body),
  publishedAt,
  durationMinutes,
  categoryKey
}`;

export const ARTICLE_SLUGS_QUERY = `*[_type == "article" && defined(slug.current)]{
  "slug": slug.current
}`;

export const SITEMAP_ARTICLES_QUERY = `*[_type == "article" && defined(slug.current)]{
  "slug": slug.current,
  publishedAt,
  "hasEnglishTranslation": defined(titleEn) && length(titleEn) > 0
}`;

export const ARTICLES_COUNT_QUERY = `count(*[_type == "article" && defined(slug.current) && ${searchFilter}])`;

export const ARTICLES_COUNT_BY_CATEGORY_QUERY = `count(*[_type == "article" && defined(slug.current) && category == $category && ${searchFilter}])`;

export const ARTICLES_RECENT_BY_CATEGORY_QUERY = `*[_type == "article" && defined(slug.current) && category == $category] | order(publishedAt desc)[0...$limit]{
  ${articleCardFields}
}`;

export const ARTICLES_DESIGN_SPACE_POOL_QUERY = `*[_type == "article" && defined(slug.current) && (
  category == "Design" ||
  (category == "Routine" && slug.current in $routineSlugs)
)] | order(publishedAt desc)[0...$limit]{
  ${articleCardFields}
}`;

const designSpaceFilter = `(
  category == "Design" ||
  (category == "Routine" && slug.current in $routineSlugs)
)`;

export const ARTICLES_DESIGN_SPACE_COUNT_QUERY = `count(*[_type == "article" && defined(slug.current) && ${designSpaceFilter} && ${searchFilter}])`;

export const ARTICLES_DESIGN_SPACE_PAGINATED_QUERY = `*[_type == "article" && defined(slug.current) && ${designSpaceFilter} && ${searchFilter}] | order(publishedAt desc) [$start...$end]{
  ${articleCardFields}
}`;

export const ARTICLES_PAGINATED_QUERY = `*[_type == "article" && defined(slug.current) && ${searchFilter}] | order(publishedAt desc) [$start...$end]{
  ${articleCardFields}
}`;

export const ARTICLES_PAGINATED_BY_CATEGORY_QUERY = `*[_type == "article" && defined(slug.current) && category == $category && ${searchFilter}] | order(publishedAt desc) [$start...$end]{
  ${articleCardFields}
}`;

export const RELATED_BY_CATEGORY_QUERY = `*[_type == "article" && defined(slug.current) && category == $category && slug.current != $slug] | order(publishedAt desc)[0...$limit]{
  ${articleCardFields}
}`;

export const RELATED_DESIGN_SPACE_QUERY = `*[_type == "article" && defined(slug.current) && slug.current != $slug && ${designSpaceFilter}] | order(publishedAt desc)[0...$limit]{
  ${articleCardFields}
}`;
