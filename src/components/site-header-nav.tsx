"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";
import { homeSections } from "@/content/home";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { withLocale } from "@/lib/locale-path";
import { cn, monoContainer } from "@/lib/cn";

const navLinkClass =
  "bg-transparent p-1 font-sans text-[0.75rem] tracking-[0.08em] uppercase no-underline";
const navLinkActiveClass = "font-extrabold text-[#163a7a]";
const navLinkIdleClass = "font-semibold text-muted hover:text-ink";

type Props = {
  locale: Locale;
  tagline: string;
  homeAria: string;
  allStories: string;
  app: string;
  contact: string;
  categoriesAria: string;
  languageLabels: Dictionary["languageSwitcher"];
  categories: { id: string; label: string }[];
};

function pathMatches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeaderNav({
  locale,
  tagline,
  homeAria,
  allStories,
  app,
  contact,
  categoriesAria,
  languageLabels,
  categories,
}: Props) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    function sync() {
      setHash(window.location.hash.replace(/^#/, ""));
      setSearch(window.location.search);
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  const articlesHref = withLocale(locale, "/articles");
  const appHref = withLocale(locale, "/app");
  const homeHref = withLocale(locale, "/");
  const articlesActive = pathMatches(pathname, articlesHref);
  const appActive = pathMatches(pathname, appHref);
  const params = new URLSearchParams(search);
  const archiveCategory = params.get("category");
  const archiveSection = params.get("section");

  return (
    <header className="border-b border-ink/10 bg-white">
      <div
        className={cn(
          monoContainer,
          "flex min-h-[2.5rem] items-center justify-between gap-4 border-b border-ink/10 py-2 font-sans text-[0.74rem] text-muted max-[640px]:[&_p]:text-[0.68rem]",
        )}
      >
        <p className="m-0 flex-1 text-center tracking-[0.02em] max-[640px]:px-2">
          {tagline}
        </p>
        <LanguageSwitcher locale={locale} labels={languageLabels} />
      </div>

      <div
        className={cn(
          monoContainer,
          "grid min-h-[6.5rem] grid-cols-[1fr_auto_1fr] items-center py-6 max-nav:min-h-0 max-nav:grid-cols-1 max-nav:gap-4 max-nav:py-6",
        )}
      >
        <div className="max-nav:hidden" aria-hidden="true" />
        <Link
          href={homeHref}
          className="flex items-center justify-center gap-3"
          aria-label={homeAria}
        >
          <Image
            src="/pokit5.png"
            alt=""
            width={34}
            height={34}
            priority
            className="size-10 rounded-xl"
          />
          <span className="font-sans text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.04em] max-nav:text-[clamp(2rem,12vw,2.75rem)]">
            {site.name}
          </span>
        </Link>
        <div className="flex justify-self-end gap-3 max-nav:justify-self-center max-nav:flex-wrap max-nav:justify-center max-nav:gap-x-3 max-nav:gap-y-2">
          <Link
            href={articlesHref}
            className={cn(
              navLinkClass,
              articlesActive ? navLinkActiveClass : navLinkIdleClass,
            )}
            aria-current={articlesActive ? "page" : undefined}
          >
            {allStories}
          </Link>
          <Link
            href={appHref}
            className={cn(
              navLinkClass,
              appActive ? navLinkActiveClass : navLinkIdleClass,
            )}
            aria-current={appActive ? "page" : undefined}
          >
            {app}
          </Link>
          <SupportEmailLink
            className={cn(navLinkClass, navLinkIdleClass, "active:font-extrabold active:text-[#163a7a]")}
          >
            {contact}
          </SupportEmailLink>
        </div>
      </div>

      <nav className="overflow-x-auto bg-wash" aria-label={categoriesAria}>
        <ul
          className={cn(
            monoContainer,
            "m-0 flex min-h-14 list-none items-center gap-1 py-2 font-sans max-[640px]:justify-center max-[640px]:gap-0.5 max-[640px]:px-1 max-[640px]:whitespace-nowrap",
          )}
        >
          {categories.map((category) => {
            const section = Object.values(homeSections).find(
              (item) => item.id === category.id,
            );
            const onHome = pathname === homeHref;
            const hashActive = onHome && hash === category.id;
            const archiveActive =
              pathMatches(pathname, articlesHref) &&
              Boolean(
                (section &&
                  "archiveCategory" in section &&
                  section.archiveCategory === archiveCategory) ||
                  (section &&
                    "archiveSection" in section &&
                    section.archiveSection === archiveSection),
              );
            const newArrivalsActive =
              category.id === "new-arrivals" &&
              (pathMatches(pathname, withLocale(locale, "/new-arrivals")) ||
                pathMatches(pathname, withLocale(locale, "/tools")));
            const active = hashActive || archiveActive || newArrivalsActive;

            return (
              <li key={category.id}>
                <Link
                  href={`${homeHref}#${category.id}`}
                  className={cn(
                    "inline-flex items-center px-3.5 py-2 text-[0.92rem] font-semibold tracking-[0.01em]",
                    active
                      ? "font-extrabold text-[#163a7a]"
                      : "font-semibold text-muted hover:text-ink",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {category.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
