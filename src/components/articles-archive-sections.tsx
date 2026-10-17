import Link from "next/link";

import { articleCategoryIds, normalizeArticleCategory } from "@/content/categories";
import { homeSections } from "@/content/home";
import { createTranslator } from "@/i18n/create-translator";
import type { ArchiveMessages } from "@/i18n/get-archive-messages";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
import { articlesArchiveHref, type ArchiveSort } from "@/sanity/lib/articles";

type Props = {
  locale: Locale;
  categoryLabels: Dictionary["categories"];
  categoriesAria: string;
  messages: ArchiveMessages;
  category?: string;
  section?: string;
  q?: string;
  sort: ArchiveSort;
};

export function ArticlesArchiveSections({ locale, categoryLabels, categoriesAria, messages, category, section, q, sort }: Props) {
  const t = createTranslator(messages);
  const selected = section === homeSections.space.archiveSection
    ? "Space" : category ? normalizeArticleCategory(category) : undefined;
  const options = [
    { id: "all", label: t("모든 이야기"), category: undefined, section: undefined },
    ...articleCategoryIds.map(id => ({
      id,
      label: categoryLabels[id],
      category: id === "Space" ? undefined : id,
      section: id === "Space" ? homeSections.space.archiveSection : undefined,
    })),
  ];

  return (
    <nav aria-label={categoriesAria} className="mt-7 border-b border-ink/12">
      <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1 p-0 max-nav:gap-x-5">
        {options.map(option => {
          const active = option.id === "all" ? !selected : selected === option.id;
          return (
            <li key={option.id}>
              <Link href={articlesArchiveHref(locale, 1, option.category, q, option.section, sort)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "-mb-px inline-flex min-h-11 items-center border-b-2 px-0 py-2 font-sans text-[0.88rem] no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-4",
                  active ? "border-ink font-semibold text-ink" : "border-transparent font-normal text-muted hover:border-ink/30 hover:text-ink",
                )}>
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
