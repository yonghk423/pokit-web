import { homeSections } from "@/content/home";

const CATEGORY_LABELS: Record<string, string> = {
  Affairs: homeSections.affairs.nav,
  Routine: homeSections.spotlight.nav,
  Radio: homeSections.radio.nav,
  Design: homeSections.design.nav,
  Wellness: homeSections.wellness.nav,
};

const SECTION_LABELS: Record<string, string> = {
  design: homeSections.design.nav,
};

/** Sanity CMS category → 사용자-facing 한글 라벨 */
export function getCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category;
}

export function getArchiveSectionLabel(section: string) {
  return SECTION_LABELS[section] ?? section;
}

export function isArchiveSection(section: string) {
  return section in SECTION_LABELS;
}

export function getArchiveHeading(category?: string, section?: string) {
  if (section) {
    return `${getArchiveSectionLabel(section)} 이야기`;
  }
  if (category) {
    return `${getCategoryLabel(category)} 이야기`;
  }
  return "모든 이야기";
}
