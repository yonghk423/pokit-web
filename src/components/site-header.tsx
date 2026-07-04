import Image from "next/image";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { SupportEmailLink } from "@/components/support-email-link";
import { appStoreUrl, site } from "@/config/site";
import { getCategories } from "@/lib/category-label";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { withLocale } from "@/lib/locale-path";
import { cn, monoContainer } from "@/lib/cn";

const navLinkClass =
  "border-2 border-transparent bg-transparent p-1 font-sans text-[0.75rem] font-bold tracking-[0.08em] text-muted uppercase hover:border-black hover:bg-wash hover:text-ink";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function SiteHeader({ locale, dict }: Props) {
  const categories = getCategories(dict);

  return (
    <header className="border-b-2 border-black bg-panel">
      <div
        className={cn(
          monoContainer,
          "flex min-h-[2.5rem] items-center justify-between gap-4 border-b-2 border-black py-2 font-sans text-[0.74rem] text-muted max-[640px]:[&_p]:text-[0.68rem]",
        )}
      >
        <p className="m-0 flex-1 text-center tracking-[0.02em] max-[640px]:px-2">
          {dict.header.tagline}
        </p>
        <LanguageSwitcher locale={locale} labels={dict.languageSwitcher} />
      </div>

      <div
        className={cn(
          monoContainer,
          "grid min-h-[6.5rem] grid-cols-[1fr_auto_1fr] items-center py-6 max-nav:min-h-0 max-nav:grid-cols-1 max-nav:gap-4 max-nav:py-6",
        )}
      >
        <div className="max-nav:hidden" aria-hidden="true" />
        <Link
          href={withLocale(locale, "/")}
          className="flex items-center justify-center gap-3"
          aria-label={dict.header.homeAria}
        >
          <Image
            src="/pokitstory.png"
            alt=""
            width={34}
            height={34}
            priority
            className="size-10 border-2 border-black"
          />
          <span className="font-sans text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.04em] max-nav:text-[clamp(2rem,12vw,2.75rem)]">
            {site.name}
          </span>
        </Link>
        <div className="flex justify-self-end gap-3 max-nav:justify-self-center max-nav:flex-wrap max-nav:justify-center max-nav:gap-x-3 max-nav:gap-y-2">
          <Link href={withLocale(locale, "/articles")} className={navLinkClass}>
            {dict.header.allStories}
          </Link>
          <a
            href={appStoreUrl(locale)}
            className={cn(navLinkClass, "hidden max-nav:inline")}
          >
            {dict.header.app}
          </a>
          <a href={`${withLocale(locale, "/")}#app`} className={cn(navLinkClass, "max-nav:hidden")}>
            {dict.header.app}
          </a>
          <SupportEmailLink className={navLinkClass}>{dict.header.contact}</SupportEmailLink>
        </div>
      </div>

      <nav
        className="overflow-x-auto border-t-2 border-black bg-beige"
        aria-label={dict.header.categoriesAria}
      >
        <ul
          className={cn(
            monoContainer,
            "m-0 flex min-h-12 list-none items-center gap-8 py-2 font-sans text-[0.76rem] font-extrabold tracking-[0.04em] max-[640px]:justify-center max-[640px]:gap-5 max-[640px]:px-1 max-[640px]:whitespace-nowrap",
          )}
        >
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`${withLocale(locale, "/")}#${category.id}`}
                className="border-2 border-transparent px-2 py-1 text-ink hover:border-black hover:bg-wash"
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
