import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import type { Locale } from "@/i18n/config";
import { articlePath } from "@/lib/article-path";
import { cn, monoContainer, sectionSpacing } from "@/lib/cn";
import type { WellnessDigestData } from "@/sanity/types";

type Props = {
  digest: WellnessDigestData;
  locale: Locale;
  kicker: string;
  sourceLabel: string;
  readSourceLabel: string;
  /** Home teaser: limit items and optionally link to full briefing. */
  maxItems?: number;
  viewAllHref?: string;
  viewAllLabel?: string;
  /** Show editor note + related articles (full briefing pages). */
  showExtras?: boolean;
  editorNoteLabel?: string;
  relatedLabel?: string;
  /** Use h1 for page title on dedicated briefing routes. */
  titleAs?: "h1" | "h2";
};

function formatWeekLabel(weekOf: string | undefined, locale: Locale) {
  if (!weekOf) return undefined;
  const date = new Date(`${weekOf}T12:00:00`);
  if (Number.isNaN(date.getTime())) return weekOf;
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function WellnessNewsDigest({
  digest,
  locale,
  kicker,
  sourceLabel,
  readSourceLabel,
  maxItems,
  viewAllHref,
  viewAllLabel,
  showExtras = false,
  editorNoteLabel,
  relatedLabel,
  titleAs = "h2",
}: Props) {
  if (!digest.items.length) return null;

  const weekLabel = formatWeekLabel(digest.weekOf, locale);
  const items =
    typeof maxItems === "number" ? digest.items.slice(0, maxItems) : digest.items;
  const related = digest.relatedArticles?.filter((a) => a?.slug) ?? [];

  return (
    <section
      id="wellness-briefing"
      className={cn(monoContainer, sectionSpacing)}
      aria-label={digest.title}
    >
      {titleAs === "h1" ? (
        <header className="mb-8 border-t-4 border-black pt-5">
          <p className="m-0 label-caps text-green">{kicker}</p>
          <h1 className="m-0 mt-1 text-[clamp(1.85rem,3.5vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
            {digest.title}
          </h1>
        </header>
      ) : (
        <SectionHeading
          kicker={kicker}
          title={digest.title}
          viewAllHref={viewAllHref}
          viewAllLabel={viewAllLabel}
        />
      )}
      {(digest.intro || weekLabel) && (
        <p className="m-0 mb-6 max-w-2xl font-sans text-[0.95rem] leading-relaxed text-muted">
          {digest.intro}
          {digest.intro && weekLabel ? " · " : null}
          {weekLabel ? (
            <time dateTime={digest.weekOf}>{weekLabel}</time>
          ) : null}
        </p>
      )}
      {showExtras && digest.editorNote && (
        <aside className="mb-8 border-2 border-black bg-wash px-5 py-4">
          {editorNoteLabel && (
            <p className="m-0 label-caps text-green">{editorNoteLabel}</p>
          )}
          <p className="m-0 mt-2 font-sans text-[0.95rem] leading-relaxed">
            {digest.editorNote}
          </p>
        </aside>
      )}
      <ol className="m-0 list-none border-t-2 border-black p-0">
        {items.map((item, index) => (
          <li
            key={`${item.sourceUrl}-${index}`}
            className="border-b-2 border-black py-5 first:pt-5"
          >
            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 max-[640px]:grid-cols-1 max-[640px]:gap-2">
              <span className="label-caps pt-1 text-green">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="m-0 text-[clamp(1.05rem,2vw,1.25rem)] font-extrabold leading-snug tracking-[-0.02em]">
                  {item.headline}
                </h3>
                <p className="m-0 mt-2 font-sans text-[0.92rem] leading-relaxed text-muted">
                  {item.summary}
                </p>
                <p className="m-0 mt-3 font-sans text-[0.82rem]">
                  <span className="label-caps text-green">{sourceLabel}</span>
                  <span className="ml-2 font-bold">{item.sourceName}</span>
                  <span className="mx-2 text-muted">·</span>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
                  >
                    {readSourceLabel}
                  </a>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      {showExtras && related.length > 0 && (
        <div className="mt-10 border-t-2 border-black pt-6">
          {relatedLabel && (
            <h2 className="m-0 mb-4 text-[1.15rem] font-extrabold tracking-[-0.02em]">
              {relatedLabel}
            </h2>
          )}
          <ul className="m-0 grid list-none gap-2 p-0">
            {related.map((article) => (
              <li key={article.slug}>
                <Link
                  href={articlePath(locale, article.slug)}
                  className="font-sans text-[0.95rem] font-bold underline decoration-2 underline-offset-2 hover:bg-wash"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
