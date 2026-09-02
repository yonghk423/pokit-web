import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import type { Locale } from "@/i18n/config";
import { localeToIntl } from "@/i18n/config";
import { cn, monoContainer, sectionSpacing } from "@/lib/cn";
import { routineToolPath } from "@/lib/routine-tool-path";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import type { NewArrivalsData, NewArrivalsItem } from "@/sanity/types";

type Props = {
  roundup: NewArrivalsData;
  locale: Locale;
  kicker: string;
  /** Home: show 2 large cards. Hub: omit to show all in 2-col grid. */
  maxItems?: number;
  viewAllHref?: string;
  viewAllLabel?: string;
  titleAs?: "h1" | "h2";
  sectionId?: string;
  sectionTitle?: string;
};

function formatWeekLabel(weekOf: string | undefined, locale: Locale) {
  if (!weekOf) return undefined;
  const date = new Date(`${weekOf}T12:00:00`);
  if (Number.isNaN(date.getTime())) return weekOf;
  return new Intl.DateTimeFormat(localeToIntl(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function ToolCard({
  item,
  locale,
}: {
  item: NewArrivalsItem;
  locale: Locale;
}) {
  const imageUrl =
    isSanityConfigured() && item.image
      ? coverImageUrl(item.image, 1200, 900)
      : null;
  const href = routineToolPath(locale, item.slug);

  return (
    <article className="min-w-0">
      <Link
        href={href}
        className="group/card block transition-colors hover:text-ink"
        aria-label={item.name}
      >
        <figure
          className={cn(
            "relative aspect-[4/3] overflow-hidden border-2 border-black bg-beige",
            !imageUrl &&
              "grid place-items-center font-sans text-[0.72rem] font-extrabold tracking-[0.1em] text-indigo uppercase",
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.imageAlt || item.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover/card:scale-[1.02]"
              {...imageBlurProps(item.imageLqip)}
            />
          ) : (
            <span>POKIT</span>
          )}
        </figure>
        <div className="mt-3 min-w-0">
          <h3 className="m-0 text-[clamp(1.15rem,2.2vw,1.45rem)] font-extrabold leading-snug tracking-[-0.02em]">
            {item.name}
          </h3>
          <p className="m-0 mt-2 line-clamp-4 font-sans text-[0.95rem] leading-relaxed text-muted">
            {item.summary}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function NewArrivalsSection({
  roundup,
  locale,
  kicker,
  maxItems,
  viewAllHref,
  viewAllLabel,
  titleAs = "h2",
  sectionId = "new-arrivals",
  sectionTitle,
}: Props) {
  if (!roundup.items.length) return null;

  const weekLabel = formatWeekLabel(roundup.weekOf, locale);
  const items =
    typeof maxItems === "number"
      ? roundup.items.slice(0, maxItems)
      : roundup.items;
  const headingTitle = sectionTitle ?? roundup.title;

  return (
    <section
      id={sectionId}
      className={cn(monoContainer, sectionSpacing)}
      aria-label={headingTitle}
    >
      {titleAs === "h1" ? (
        <header className="mb-8 border-t-4 border-black pt-5">
          <p className="m-0 label-caps text-green">{kicker}</p>
          <h1 className="m-0 mt-1 text-[clamp(1.85rem,3.5vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
            {headingTitle}
          </h1>
        </header>
      ) : (
        <SectionHeading
          kicker={kicker}
          title={headingTitle}
          viewAllHref={viewAllHref}
          viewAllLabel={viewAllLabel}
        />
      )}
      {(roundup.intro || weekLabel) && (
        <p className="m-0 mb-6 max-w-2xl font-sans text-[0.95rem] leading-relaxed text-muted">
          {roundup.intro}
          {roundup.intro && weekLabel ? " · " : null}
          {weekLabel ? (
            <time dateTime={roundup.weekOf}>{weekLabel}</time>
          ) : null}
        </p>
      )}

      <div className="grid grid-cols-2 gap-x-[1.4rem] gap-y-10 max-[720px]:grid-cols-1">
        {items.map((item) => (
          <ToolCard key={item.slug} item={item} locale={locale} />
        ))}
      </div>
    </section>
  );
}
