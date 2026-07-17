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
  routineArticles: ArticleCardData[];
  commuteArticles: ArticleCardData[];
  categoryLabels: Dictionary["categories"];
};

export function HomeDigestStrip({
  dict,
  locale,
  articles,
  routineArticles,
  commuteArticles,
  categoryLabels,
}: Props) {
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
        <h1 className={digestTitleClass}>{digest.brandTagline}</h1>
      </div>

      <DigestFeaturedStory
        articles={articles}
        locale={locale}
        categoryLabels={categoryLabels}
        linkClass={cn(
          linkClass,
          "border-r-2 border-black p-5 max-nav:border-r-0 max-nav:border-b-2",
        )}
        featuredKicker={digest.featuredKicker}
        featuredTitle={digest.featuredTitle}
      />

      <div className="grid grid-cols-2 max-[640px]:grid-cols-1">
        <DigestFeaturedStory
          articles={routineArticles}
          locale={locale}
          categoryLabels={categoryLabels}
          linkClass={cn(
            linkClass,
            "border-r-2 border-black p-5 max-[640px]:border-r-0 max-[640px]:border-b-2",
          )}
          fixedKicker={sections.routine.nav}
          featuredKicker={sections.routine.nav}
          featuredTitle={digest.routineDesc}
          fallbackHref="#routine"
        />
        <DigestFeaturedStory
          articles={commuteArticles}
          locale={locale}
          categoryLabels={categoryLabels}
          linkClass={cn(linkClass, "p-5")}
          fixedKicker={sections.commute.nav}
          featuredKicker={sections.commute.nav}
          featuredTitle={digest.commuteDesc}
          fallbackHref="#commute"
        />
      </div>
    </section>
  );
}
