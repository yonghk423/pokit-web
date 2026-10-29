"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitcher, type LanguageLabels } from "@/components/language-switcher";
import { SupportEmailLink } from "@/components/support-email-link";
import { appName, siteName } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { withLocale } from "@/lib/locale-path";
import { cn, monoContainer } from "@/lib/cn";

type Props = {
  locale: Locale;
  tagline: string;
  homeAria: string;
  app: string;
  contact: string;
  languageLabels: LanguageLabels;
};

function pathMatches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeaderNav({
  locale,
  tagline,
  homeAria,
  app,
  contact,
  languageLabels,
}: Props) {
  const pathname = usePathname();
  const appHref = withLocale(locale, "/app");
  const homeHref = withLocale(locale, "/");
  const appActive = pathMatches(pathname, appHref);
  const brandName = appActive ? appName(locale) : siteName();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-[color-mix(in_srgb,var(--color-paper)_88%,transparent)] backdrop-blur-md">
      <div className={cn(monoContainer, "flex flex-nowrap items-center justify-between gap-3 py-3 max-[760px]:gap-2 max-[760px]:py-2")}>
        <div className="flex min-w-0 items-center gap-2 max-[760px]:gap-1.5">
          <Link
            href={homeHref}
            className="flex shrink-0 items-center gap-2.5 no-underline max-[760px]:gap-2"
            aria-label={appActive ? (locale === "ko" ? `${brandName} 홈` : locale === "ja" ? `${brandName} ホーム` : `${brandName} home`) : homeAria}
          >
            <Image
              src="/icon.png"
              alt=""
              width={32}
              height={32}
              priority
              className="size-8 rounded-lg object-cover max-[760px]:size-7"
            />
            <span className="font-sans text-[1.15rem] font-extrabold tracking-[-0.04em] max-[760px]:text-[0.98rem]">
              {brandName}
            </span>
          </Link>
          <p className="m-0 hidden truncate font-sans text-[0.72rem] text-muted nav:block">
            {tagline}
          </p>
        </div>

        <div className="flex shrink-0 flex-nowrap items-center gap-1.5 max-[760px]:gap-1">
          <Link
            href={appHref}
            className={cn(
              "header-app-cta rounded-full px-3.5 py-1.5 font-sans text-[0.78rem] font-semibold no-underline max-[760px]:px-2.5 max-[760px]:py-1.5 max-[760px]:text-[0.7rem]",
              appActive
                ? "border border-ink/15 bg-ink/8 text-ink"
                : "border border-ink/15 bg-white/80 text-ink hover:border-ink/30 hover:bg-white",
              appActive && "max-[760px]:hidden",
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
