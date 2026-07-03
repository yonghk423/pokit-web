import { DigestFeaturedStory } from "@/components/digest-featured-story";
import {
  digestKickerClass,
  digestTitleClass,
} from "@/components/home-digest-strip-styles";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn, monoContainer } from "@/lib/cn";
import type { ArticleCardData } from "@/sanity/types";

type Props = {
  dict: Dictionary;
  locale: Locale;
  articles: ArticleCardData[];
  categoryLabels: Dictionary["categories"];
};

export function HomeDigestStrip({ dict, locale, articles, categoryLabels }: Props) {
  const digest = dict.home.digest;
  const sections = dict.home.sections;

  const linkClass =
    "block transition-colors hover:bg-white/10 max-nav:hover:bg-transparent";

  return (
    <section
      className={cn(
        monoContainer,
        "mt-6 grid grid-cols-[0.9fr_1.8fr_1.5fr] gap-0 border-2 border-black bg-indigo font-sans text-panel max-nav:grid-cols-1",
      )}
      aria-label={digest.ariaLabel}
      aria-live="polite"
    >
      <div className="border-r-2 border-black p-5 max-nav:border-r-0 max-nav:border-b-2">
        <p className={digestKickerClass}>{digest.brandKicker}</p>
        <p className={digestTitleClass}>{digest.brandTagline}</p>
      </div>

      <DigestFeaturedStory
        articles={articles}
        locale={locale}
        categoryLabels={categoryLabels}
        linkClass={linkClass}
        featuredKicker={digest.featuredKicker}
        featuredTitle={digest.featuredTitle}
      />

      <div className="grid grid-cols-2 max-[640px]:grid-cols-1">
        <a
          href="#spotlight"
          className={cn(
            linkClass,
            "border-r-2 border-black p-5 max-[640px]:border-r-0 max-[640px]:border-b-2",
          )}
        >
          <p className={digestKickerClass}>{sections.spotlight.nav}</p>
          <p className={digestTitleClass}>{digest.routineDesc}</p>
        </a>
        <a href="#radio" className={cn(linkClass, "p-5")}>
          <p className={digestKickerClass}>{sections.radio.nav}</p>
          <p className={digestTitleClass}>{digest.commuteDesc}</p>
        </a>
      </div>
    </section>
  );
}
