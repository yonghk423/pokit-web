import Link from "next/link";

import { ArticleSectionCarousel } from "@/components/article-section-carousel";
import { cn } from "@/lib/cn";
import type { RelatedArticlesResult } from "@/sanity/lib/related-articles";

type Props = {
  related: RelatedArticlesResult;
  className?: string;
};

export function RelatedArticles({ related, className }: Props) {
  const ariaLabel = `${related.label} 이야기`;

  return (
    <section
      className={cn("mt-12 border-t border-fine-line pt-8", className)}
      aria-label={ariaLabel}
    >
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 className="m-0 font-serif text-[clamp(1.35rem,3vw,1.75rem)] leading-[1.15] font-medium tracking-[-0.02em]">
          {related.label} 이야기
        </h2>
        <Link
          href={related.viewAllHref}
          className="shrink-0 font-sans text-[0.82rem] font-bold tracking-[0.02em] underline underline-offset-[0.14em] hover:text-green"
        >
          더보기 →
        </Link>
      </header>

      <ArticleSectionCarousel
        articles={related.articles}
        variant="vertical"
        layout="grid"
        columns={4}
        ariaLabel={ariaLabel}
      />
    </section>
  );
}
