const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidArticleSlug(slug: string) {
  return SLUG_PATTERN.test(slug);
}

/** Article 상세 페이지 경로 (slug URL 인코딩) */
export function articlePath(slug: string) {
  return `/articles/${encodeURIComponent(slug)}`;
}
