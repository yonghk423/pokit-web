import Image from "next/image";
import Link from "next/link";

import { AppDownload } from "@/components/app-download";
import { appScreen } from "@/lib/app-screens";
import { monoContainer } from "@/lib/cn";
import { withLocale } from "@/lib/locale-path";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type Props = {
  locale: Locale;
  aboutTitle: string;
  aboutBody: string;
  aboutCta: string;
  dict: Dictionary;
};

export function HomeAbout({
  locale,
  aboutTitle,
  aboutBody,
  aboutCta,
  dict,
}: Props) {
  const screenPrimary = appScreen(locale, "routines.webp");
  const screenSecondary = appScreen(locale, "today-note.webp");

  return (
    <section className="mt-24 max-nav:mt-16" aria-labelledby="home-about-heading">
      <div className={monoContainer}>
        <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 max-nav:grid-cols-1 max-nav:gap-8">
          <div>
            <p
              id="home-about-heading"
              className="m-0 text-[clamp(1.55rem,3.4vw,2.35rem)] font-extrabold leading-[1.25] tracking-[-0.035em] text-ink"
            >
              {aboutTitle}
            </p>
            <p className="m-0 mt-6 max-w-[34rem] whitespace-pre-line font-sans text-[1.02rem] leading-[1.75] text-muted">
              {aboutBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={withLocale(locale, "/app")}
                className="inline-flex items-center rounded-full bg-indigo px-5 py-2.5 font-sans text-[0.85rem] font-semibold text-white no-underline hover:bg-ink"
              >
                {aboutCta}
              </Link>
              <Link
                href={withLocale(locale, "/articles")}
                className="inline-flex items-center rounded-full border border-ink/15 bg-white px-5 py-2.5 font-sans text-[0.85rem] font-semibold text-ink no-underline hover:border-ink/35"
              >
                {dict.home.viewAllStories.replace(/\s*→\s*$/, "")}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-[#ebe7df]">
              <Image
                src={screenPrimary}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                className="object-contain object-bottom p-6"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.15rem] bg-indigo/10">
              <Image
                src={screenSecondary}
                alt=""
                fill
                sizes="20vw"
                className="object-cover object-top"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.15rem] bg-[#eef3f1]">
              <Image
                src="/pokit5.png"
                alt=""
                width={120}
                height={120}
                className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl"
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <AppDownload
            locale={locale}
            copy={dict.appDownload}
            variant="editorial"
          />
        </div>
      </div>
    </section>
  );
}
