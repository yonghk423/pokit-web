"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { digestKickerClass, digestTitleClass } from "@/components/home-digest-strip-styles";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { articlePath } from "@/lib/article-path";
import { CAROUSEL_AUTOPLAY_MS } from "@/lib/use-carousel-autoplay";
import type { ArticleCardData } from "@/sanity/types";

const ROTATE_MS = CAROUSEL_AUTOPLAY_MS;

type Props = {
  articles: ArticleCardData[];
  locale: Locale;
  categoryLabels: Dictionary["categories"];
  linkClass: string;
  featuredKicker: string;
  featuredTitle: string;
  fallbackHref?: string;
  fixedKicker?: string;
};

function pickNextIndex(length: number, current: number) {
  if (length <= 1) return current;
  let next = Math.floor(Math.random() * length);
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

export function DigestFeaturedStory({
  articles,
  locale,
  categoryLabels,
  linkClass,
  featuredKicker,
  featuredTitle,
  fallbackHref = "#weekly",
  fixedKicker,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (articles.length === 0) return;

    setIndex(Math.floor(Math.random() * articles.length));

    if (articles.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => pickNextIndex(articles.length, current));
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [articles]);

  if (articles.length === 0) {
    return (
      <a href={fallbackHref} className={linkClass}>
        <p className={digestKickerClass}>{fixedKicker ?? featuredKicker}</p>
        <p className={digestTitleClass}>{featuredTitle}</p>
      </a>
    );
  }

  const article = articles[index] ?? articles[0];
  const kicker =
    fixedKicker ??
    article.kicker ??
    categoryLabels[article.category as keyof Dictionary["categories"]] ??
    featuredKicker;

  return (
    <Link href={articlePath(locale, article.slug)} className={linkClass}>
      <p className={digestKickerClass}>{kicker}</p>
      <p key={article.slug} className={digestTitleClass}>
        {article.title}
      </p>
    </Link>
  );
}
