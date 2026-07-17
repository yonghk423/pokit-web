import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { localeToIntl } from "@/i18n/config";
import { articlePath } from "@/lib/article-path";
import { withLocale } from "@/lib/locale-path";

const publisher = {
  "@type": "Organization" as const,
  name: site.name,
  url: site.siteUrl,
  logo: {
    "@type": "ImageObject" as const,
    url: `${site.siteUrl}/pokitstory.png`,
  },
};

export function websiteJsonLd(description: string, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.siteUrl,
    description,
    inLanguage: localeToIntl(locale),
    publisher,
  };
}

export function articleJsonLd(params: {
  locale: Locale;
  slug: string;
  title: string;
  description?: string;
  publishedAt?: string;
  modifiedAt?: string;
  imageUrl?: string;
}) {
  const url = `${site.siteUrl}${articlePath(params.locale, params.slug)}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    datePublished: params.publishedAt,
    dateModified: params.modifiedAt ?? params.publishedAt,
    inLanguage: localeToIntl(params.locale),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    image: params.imageUrl,
    author: publisher,
    publisher,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.siteUrl}${withLocale(locale, item.path)}`,
    })),
  };
}
