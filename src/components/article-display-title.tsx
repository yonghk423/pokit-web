import { cn } from "@/lib/cn";
import type { Locale } from "@/i18n/config";
import { brandTagsForArticle, splitDisplayTitle } from "@/lib/display-title";

type Props = {
  title: string;
  locale: Locale;
  category: string;
  description?: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  headlineClassName?: string;
  /** Digests sit on indigo — use lighter chips. */
  tone?: "default" | "onDark";
};

/**
 * Clean headline + 1–2 keyword chips matched to category/copy.
 */
export function ArticleDisplayTitle({
  title,
  locale,
  category,
  description,
  as: Tag = "h3",
  className,
  headlineClassName,
  tone = "default",
}: Props) {
  const { headline } = splitDisplayTitle(title);
  const tags = brandTagsForArticle(locale, category, title, description);

  return (
    <Tag className={className}>
      <span className={cn("block", headlineClassName)}>{headline}</span>
      {tags.length > 0 ? (
        <span
          className={cn(
            "mt-[0.45em] flex flex-wrap gap-1.5 font-sans font-normal tracking-normal",
            Tag === "p" ? "normal-case" : undefined,
          )}
          aria-hidden="true"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center border px-1.5 py-[0.12rem] text-[0.62rem] font-bold leading-none tracking-[0.02em]",
                tone === "onDark"
                  ? "border-panel/45 bg-panel/10 text-brand"
                  : "border-black bg-wash text-ink",
              )}
            >
              {tag}
            </span>
          ))}
        </span>
      ) : null}
    </Tag>
  );
}
