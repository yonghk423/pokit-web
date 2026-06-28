import { site } from "@/config/site";
import { articlePath } from "@/lib/article-path";

const publisher = {
  "@type": "Organization" as const,
  name: site.name,
  url: site.siteUrl,
  logo: {
    "@type": "ImageObject" as const,
    url: `${site.siteUrl}/pokitstory.png`,
  },
};

export function websiteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.siteUrl,
    description,
    inLanguage: "ko-KR",
    publisher,
  };
}

export function articleJsonLd(params: {
  slug: string;
  title: string;
  description?: string;
  publishedAt?: string;
  imageUrl?: string;
}) {
  const url = `${site.siteUrl}${articlePath(params.slug)}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    datePublished: params.publishedAt,
    inLanguage: "ko-KR",
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
