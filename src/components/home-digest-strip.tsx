import Link from "next/link";

import {
  digestKickerClass,
  digestTitleClass,
  digestTitleClampClass,
} from "@/components/home-digest-strip-styles";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn, monoContainer } from "@/lib/cn";
import { withLocale } from "@/lib/locale-path";
import type { WellnessDigestData } from "@/sanity/types";

type Props = {
  dict: Dictionary;
  locale: Locale;
  digest: WellnessDigestData | null;
};

export function HomeDigestStrip({ dict, locale, digest }: Props) {
  const homeDigest = dict.home.digest;
  const briefing = dict.home.wellnessBriefing;
  const briefingHref = withLocale(locale, "/briefing");
  const items = digest?.items.slice(0, 3) ?? [];
  const title = digest?.title ?? dict.briefing.hubTitle;

  const cellClass =
    "block min-w-0 p-4 transition-colors hover:bg-white/10 max-nav:hover:bg-transparent";

  return (
    <div className={cn(monoContainer, "mt-6")}>
      <header className="mb-0 border-t-4 border-black pt-5">
        <p className="m-0 label-caps text-green">{briefing.kicker}</p>
        <h2 className="m-0 mt-1 text-[clamp(1.65rem,3vw,2.35rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
          {title}
        </h2>
      </header>

      <section
        className="mt-5 grid grid-cols-4 gap-0 border-2 border-black bg-indigo font-sans text-panel max-nav:grid-cols-1"
        aria-label={homeDigest.ariaLabel}
      >
        <div className="min-w-0 border-r-2 border-black p-4 max-nav:border-r-0 max-nav:border-b-2">
          <p className={digestKickerClass}>{homeDigest.brandKicker}</p>
          <h1 className={digestTitleClampClass} title={homeDigest.brandTagline}>
            {homeDigest.brandTagline}
          </h1>
        </div>

        {items.length === 0 ? (
          <Link
            href={briefingHref}
            className={cn(cellClass, "col-span-3 max-nav:col-span-1")}
          >
            <p className={digestKickerClass}>{briefing.kicker}</p>
            <p className={digestTitleClass}>{dict.briefing.hubTitle}</p>
            <p className="m-0 mt-2 line-clamp-2 font-sans text-[0.8rem] leading-snug text-panel/85">
              {dict.briefing.empty}
            </p>
          </Link>
        ) : (
          [0, 1, 2].map((slot) => {
            const item = items[slot];
            const isLast = slot === 2;
            const borderClass = !isLast
              ? "border-r-2 border-black max-nav:border-r-0 max-nav:border-b-2"
              : "max-nav:border-b-0";

            if (item) {
              return (
                <Link
                  key={`${item.sourceUrl}-${slot}`}
                  href={briefingHref}
                  className={cn(cellClass, borderClass)}
                  title={item.headline}
                >
                  <p className={digestKickerClass}>
                    {String(slot + 1).padStart(2, "0")}
                  </p>
                  <p className={digestTitleClampClass}>{item.headline}</p>
                  <p className="m-0 mt-2 truncate label-caps text-brand/90">
                    {item.sourceName}
                  </p>
                </Link>
              );
            }

            return (
              <Link
                key={`briefing-more-${slot}`}
                href={briefingHref}
                className={cn(cellClass, borderClass)}
              >
                <p className={digestKickerClass}>{briefing.viewAll}</p>
                <p className={digestTitleClampClass}>{dict.briefing.viewFull}</p>
              </Link>
            );
          })
        )}
      </section>
    </div>
  );
}
