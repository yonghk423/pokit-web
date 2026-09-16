"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "@/components/language-switcher";
import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { withLocale } from "@/lib/locale-path";
import { cn, monoContainer } from "@/lib/cn";

type Props = {
  locale: Locale;
  tagline: string;
  homeAria: string;
  allStories: string;
  app: string;
  contact: string;
  languageLabels: Dictionary["languageSwitcher"];
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
  languageLabels,
}: Props) {
  const pathname = usePathname();
  const articlesHref = withLocale(locale, "/articles");
  const appHref = withLocale(locale, "/app");
  const homeHref = withLocale(locale, "/");
  const articlesActive = pathMatches(pathname, articlesHref);
  const appActive = pathMatches(pathname, appHref);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-[color-mix(in_srgb,var(--color-paper)_88%,transparent)] backdrop-blur-md">
      <div className={cn(monoContainer, "flex items-center justify-between gap-3 py-3")}>
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={homeHref}
            className="flex shrink-0 items-center gap-2.5 no-underline"
            aria-label={homeAria}
          >
            <Image
              src="/pokit5.png"
              alt=""
              width={28}
              height={28}
              priority
              className="size-7 rounded-lg"
            />
            <span className="font-sans text-[1.15rem] font-extrabold tracking-[-0.04em]">
              {site.name}
            </span>
          </Link>
          <p className="m-0 hidden truncate font-sans text-[0.72rem] text-muted nav:block">
            {tagline}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href={articlesHref}
            className={cn(
              "hidden rounded-full px-3 py-1.5 font-sans text-[0.78rem] no-underline sm:inline-flex",
              articlesActive
                ? "bg-ink/8 font-semibold text-ink"
                : "font-medium text-muted hover:text-ink",
            )}
            aria-current={articlesActive ? "page" : undefined}
          >
            {allStories}
          </Link>
          <Link
            href={appHref}
            className={cn(
              "rounded-full px-3 py-1.5 font-sans text-[0.78rem] no-underline",
              appActive
                ? "bg-indigo font-semibold text-white"
                : "bg-ink font-semibold text-white hover:bg-indigo",
            )}
            aria-current={appActive ? "page" : undefined}
          >
            {app}
          </Link>
          <SupportEmailLink className="hidden rounded-full px-3 py-1.5 font-sans text-[0.78rem] font-medium text-muted no-underline hover:text-ink md:inline-flex">
            {contact}
          </SupportEmailLink>
          <LanguageSwitcher locale={locale} labels={languageLabels} />
        </div>
      </div>
    </header>
  );
}
