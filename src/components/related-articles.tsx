import Link from "next/link";

import { ArticleSectionCarousel } from "@/components/article-section-carousel";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
import type { RelatedArticlesResult } from "@/sanity/lib/articles";

type Props = {
  related: RelatedArticlesResult;
  locale: Locale;
  categoryLabels: Dictionary["categories"];
  heading: string;
  viewMoreLabel: string;
  className?: string;
};

export function RelatedArticles({
  related,
  locale,
  categoryLabels,
  heading,
  viewMoreLabel,
  className,
}: Props) {
  return (
    <section
      className={cn("mt-16 border-t border-ink/10 pt-10", className)}
      aria-label={heading}
    >
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="m-0 font-sans text-[clamp(1.35rem,3vw,1.75rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
          {heading}
        </h2>
        <Link
          href={related.viewAllHref}
          className="shrink-0 bg-indigo px-4 py-2 font-sans text-[0.82rem] font-semibold tracking-[0.02em] text-white hover:bg-ink"
        >
          {viewMoreLabel}
        </Link>
      </header>

      <ArticleSectionCarousel
        articles={related.articles}
        locale={locale}
        categoryLabels={categoryLabels}
        variant="vertical"
        layout="grid"
        columns={4}
        ariaLabel={heading}
      />
    </section>
  );
}
