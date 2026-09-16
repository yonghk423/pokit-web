import Image from "next/image";
import Link from "next/link";

import { DisplayHeading } from "@/components/display-heading";
import { cn, monoContainer } from "@/lib/cn";
import type { Locale } from "@/i18n/config";
import { routineToolPath } from "@/lib/routine-tool-path";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import type { NewArrivalsData } from "@/sanity/types";

type Props = {
  roundup: NewArrivalsData;
  locale: Locale;
  line1: string;
  accent: string;
  rest: string;
  viewAllHref: string;
  viewAllLabel: string;
};

export function HomeLabs({
  roundup,
  locale,
  line1,
  accent,
  rest,
  viewAllHref,
  viewAllLabel,
}: Props) {
  const items = roundup.items.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section
      id="new-arrivals"
      className="mt-24 scroll-mt-28 max-nav:mt-16"
      aria-labelledby="home-labs-heading"
    >
      <div className={monoContainer}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 max-nav:mb-7">
          <DisplayHeading
            id="home-labs-heading"
            line1={line1}
            accent={accent}
            rest={rest}
            as="h2"
            className="text-[clamp(1.75rem,4vw,2.85rem)]"
          />
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-sans text-[0.78rem] font-semibold text-white no-underline hover:bg-indigo"
          >
            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
            {viewAllLabel}
          </Link>
        </div>

        <div className="columns-2 gap-3 max-[640px]:columns-1 nav:columns-3">
          {items.map((item, index) => {
            const imageUrl =
              isSanityConfigured() && item.image
                ? coverImageUrl(item.image, 900, 1100)
                : null;
            const href = routineToolPath(locale, item.slug);
            const tall = index % 3 === 1;

            return (
              <Link
                key={item.slug}
                href={href}
                className={cn(
                  "group/lab mb-3 block break-inside-avoid overflow-hidden rounded-[1.15rem] bg-[#ebe7df] no-underline",
                  tall ? "aspect-[3/4]" : "aspect-[4/3]",
                )}
              >
                <div className="relative h-full w-full">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.imageAlt || item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/lab:scale-[1.05]"
                      {...imageBlurProps(item.imageLqip)}
                    />
                  ) : (
                    <span className="grid h-full place-items-center font-sans text-[0.7rem] font-extrabold tracking-[0.12em] text-indigo uppercase">
                      POKIT
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/65 to-transparent px-4 pb-4 pt-16">
                    <p className="m-0 font-sans text-[0.95rem] font-extrabold tracking-[-0.02em] text-white">
                      {item.name}
                    </p>
                    {item.summary ? (
                      <p className="m-0 mt-1 line-clamp-2 font-sans text-[0.75rem] leading-relaxed text-white/80">
                        {item.summary}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
