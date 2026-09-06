/**
 * Locale field resolution:
 * - en → En, then ko
 * - ja → Ja, then En, then ko (until full JP coverage)
 * - ko → ko
 */
const localizedString = (field: string) =>
  `select(
    $locale == "en" => coalesce(${field}En, ${field}),
    $locale == "ja" => coalesce(${field}Ja, ${field}En, ${field}),
    ${field}
  )`;

const localizedTextSearch = (field: string) =>
  `select(
    $locale == "en" => coalesce(${field}En, ${field}) match $pattern,
    $locale == "ja" => coalesce(${field}Ja, ${field}En, ${field}) match $pattern,
    ${field} match $pattern
  )`;

const localizedPortableText = (field: string) =>
  `select(
    $locale == "en" => coalesce(${field}En, ${field}),
    $locale == "ja" => coalesce(${field}Ja, ${field}En, ${field}),
    ${field}
  )`;

const articleCardFields = `
  "slug": slug.current,
  "title": ${localizedString("title")},
  "titleKo": title,
  "description": ${localizedString("description")},
  "kicker": ${localizedString("kicker")},
  category,
  "imageAlt": select(
    $locale == "en" => coalesce(coverImageAltEn, coverImageAlt, coverImage.alt, coalesce(titleEn, title)),
    $locale == "ja" => coalesce(coverImageAltJa, coverImageAltEn, coverImageAlt, coverImage.alt, coalesce(titleJa, titleEn, title)),
    coalesce(coverImageAlt, coverImage.alt, title)
  ),
  coverImage,
  "coverImageLqip": coverImage.asset->metadata.lqip,
  publishedAt,
  "_updatedAt": _updatedAt,
  "hasEnglishTranslation": defined(titleEn) && length(titleEn) > 0,
  "hasJapaneseTranslation": defined(titleJa) && length(titleJa) > 0
`;

const sectionHeadingProjection = `{
  "kicker": ${localizedString("kicker")},
  "title": ${localizedString("title")}
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
  sleepStoriesSection${sectionHeadingProjection},
  sleepStories[]->{${articleCardFields}},
  cityGuidesSection${sectionHeadingProjection},
  cityGuides[]->{${articleCardFields}}
}`;

const wellnessDigestFields = `
  weekOf,
  "title": ${localizedString("title")},
  "intro": ${localizedString("intro")},
  "editorNote": ${localizedString("editorNote")},
  "items": items[]{
    "headline": ${localizedString("headline")},
    "summary": ${localizedString("summary")},
    "sourceName": ${localizedString("sourceName")},
    sourceUrl
  },
  "relatedArticles": relatedArticles[]->{${articleCardFields}}
`;

export const LATEST_WELLNESS_DIGEST_QUERY = `*[_type == "wellnessDigest" && defined(weekOf)] | order(weekOf desc)[0]{
  ${wellnessDigestFields}
}`;

export const WELLNESS_DIGEST_BY_WEEK_QUERY = `*[_type == "wellnessDigest" && weekOf == $weekOf][0]{
  ${wellnessDigestFields}
}`;

export const WELLNESS_DIGEST_LIST_QUERY = `*[_type == "wellnessDigest" && defined(weekOf)] | order(weekOf desc){
  weekOf,
  "title": ${localizedString("title")}
}`;

export const SITEMAP_DIGESTS_QUERY = `*[_type == "wellnessDigest" && defined(weekOf)] | order(weekOf desc){
  weekOf,
  "_updatedAt": _updatedAt
}`;

const newArrivalsItemCardFields = `
  "name": ${localizedString("name")},
  "slug": slug.current,
  "summary": ${localizedString("summary")},
  image,
  "imageAlt": select(
    $locale == "en" => coalesce(imageAltEn, imageAlt, nameEn, name),
    $locale == "ja" => coalesce(imageAltJa, imageAltEn, imageAlt, nameJa, nameEn, name),
    coalesce(imageAlt, name)
  ),
  "imageLqip": image.asset->metadata.lqip,
  "hasEnglishTranslation": defined(nameEn) && length(nameEn) > 0,
  "hasJapaneseTranslation": defined(nameJa) && length(nameJa) > 0
`;

const newArrivalsFields = `
  weekOf,
  "title": ${localizedString("title")},
  "intro": ${localizedString("intro")},
  "items": items[]{
    ${newArrivalsItemCardFields}
  }
`;

export const LATEST_NEW_ARRIVALS_QUERY = `*[_type == "newArrivals" && defined(weekOf)] | order(weekOf desc)[0]{
  ${newArrivalsFields}
}`;

export const NEW_ARRIVALS_BY_WEEK_QUERY = `*[_type == "newArrivals" && weekOf == $weekOf][0]{
  ${newArrivalsFields}
}`;

export const NEW_ARRIVALS_LIST_QUERY = `*[_type == "newArrivals" && defined(weekOf)] | order(weekOf desc){
  weekOf,
  "title": ${localizedString("title")}
}`;

export const SITEMAP_NEW_ARRIVALS_QUERY = `*[_type == "newArrivals" && defined(weekOf)] | order(weekOf desc){
  weekOf,
  "_updatedAt": _updatedAt
}`;

export const ROUTINE_TOOL_BY_SLUG_QUERY = `*[_type == "newArrivals" && count(items[slug.current == $slug]) > 0] | order(weekOf desc)[0]{
  weekOf,
  "item": items[slug.current == $slug][0]{
    ${newArrivalsItemCardFields},
    "body": ${localizedPortableText("body")}
  }
}`;

export const ROUTINE_TOOL_SLUGS_QUERY = `array::unique(*[_type == "newArrivals"].items[defined(slug.current)].slug.current)`;

export const SITEMAP_ROUTINE_TOOLS_QUERY = `*[_type == "newArrivals" && defined(weekOf)]{
  "_updatedAt": _updatedAt,
  "slugs": items[defined(slug.current)].slug.current
}`;

export const ARTICLE_QUERY = `*[_type == "article" && slug.current == $slug][0]{
  ${articleCardFields},
  "body": ${localizedPortableText("body")},
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
  category == "Space" ||
  (category == "Routine" && slug.current in $routineSlugs)
)] | order(publishedAt desc)[0...$limit]{
  ${articleCardFields}
}`;

const designSpaceFilter = `(
  category == "Space" ||
  (category == "Routine" && slug.current in $routineSlugs)
)`;

export const ARTICLES_DESIGN_SPACE_COUNT_QUERY = `count(*[_type == "article" && defined(slug.current) && ${designSpaceFilter} && ${searchFilter}])`;

export function articlesDesignSpacePaginatedQuery(order: "asc" | "desc") {
  return `*[_type == "article" && defined(slug.current) && ${designSpaceFilter} && ${searchFilter}] | order(publishedAt ${order}) [$start...$end]{
  ${articleCardFields}
}`;
}

export function articlesPaginatedQuery(order: "asc" | "desc") {
  return `*[_type == "article" && defined(slug.current) && ${searchFilter}] | order(publishedAt ${order}) [$start...$end]{
  ${articleCardFields}
}`;
}

export function articlesPaginatedByCategoryQuery(order: "asc" | "desc") {
  return `*[_type == "article" && defined(slug.current) && category == $category && ${searchFilter}] | order(publishedAt ${order}) [$start...$end]{
  ${articleCardFields}
}`;
}

/** @deprecated Prefer articlesPaginatedQuery("desc") — kept for any leftover imports */
export const ARTICLES_DESIGN_SPACE_PAGINATED_QUERY = articlesDesignSpacePaginatedQuery("desc");
export const ARTICLES_PAGINATED_QUERY = articlesPaginatedQuery("desc");
export const ARTICLES_PAGINATED_BY_CATEGORY_QUERY = articlesPaginatedByCategoryQuery("desc");

export const RELATED_BY_CATEGORY_QUERY = `*[_type == "article" && defined(slug.current) && category == $category && slug.current != $slug] | order(publishedAt desc)[0...$limit]{
  ${articleCardFields}
}`;

export const RELATED_DESIGN_SPACE_QUERY = `*[_type == "article" && defined(slug.current) && slug.current != $slug && ${designSpaceFilter}] | order(publishedAt desc)[0...$limit]{
  ${articleCardFields}
}`;
