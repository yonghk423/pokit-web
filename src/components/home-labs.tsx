"use client";

import Image from "next/image";
import Link from "next/link";

import { useOptionalArticlePreview } from "@/components/article-preview-context";
import { DisplayHeading } from "@/components/display-heading";
import { cn, monoContainer } from "@/lib/cn";
import type { Locale } from "@/i18n/config";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import type { NewArrivalsData, NewArrivalsItem } from "@/sanity/types";

type Props = {
  roundup: NewArrivalsData;
  pastTools: NewArrivalsItem[];
  locale: Locale;
  line1: string;
  accent: string;
  rest: string;
  viewAllHref: string;
  viewAllLabel: string;
  pastLabel: string;
  kicker: string;
};

function toolImageUrl(item: NewArrivalsItem) {
  if (!isSanityConfigured() || !item.image) return null;
  return coverImageUrl(item.image, 900, 1100);
}

function openToolPreview(
  preview: ReturnType<typeof useOptionalArticlePreview>,
  item: NewArrivalsItem,
  el: HTMLElement,
  imageUrl: string | null,
  kicker: string,
) {
  if (!preview) return;
  const rect = el.getBoundingClientRect();
  preview.openTool({
    tool: {
      slug: item.slug,
      name: item.name,
      summary: item.summary,
      imageAlt: item.imageAlt,
    },
    origin: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      imageUrl,
      blurDataURL: item.imageLqip ?? null,
    },
    kicker,
  });
}

export function HomeLabs({
  roundup,
  pastTools,
  line1,
  accent,
  rest,
  viewAllHref,
  viewAllLabel,
  pastLabel,
  kicker,
}: Props) {
  const preview = useOptionalArticlePreview();
  const items = roundup.items.slice(0, 2);
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

        <div className="grid items-stretch gap-3 nav:grid-cols-[minmax(0,2fr)_minmax(16rem,0.86fr)]">
          <div className="grid grid-cols-1 items-start gap-3 min-[640px]:grid-cols-2">
          {items.map((item, index) => {
            const imageUrl = toolImageUrl(item);
            const tall = index % 3 === 1;
            return (
              <button
                key={item.slug}
                type="button"
                className={cn(
                  "group/lab block w-full cursor-pointer overflow-hidden rounded-[1.15rem] border-0 bg-[#ebe7df] p-0 text-left",
                  tall ? "aspect-3/4" : "aspect-4/3",
                )}
                onClick={(event) =>
                  openToolPreview(
                    preview,
                    item,
                    event.currentTarget,
                    imageUrl,
                    kicker,
                  )
                }
              >
                <div className="relative h-full w-full">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.imageAlt || item.name}
                      fill
                      sizes="(max-width: 900px) 100vw, 34vw"
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
              </button>
            );
          })}
          </div>

          {pastTools.length > 0 && (
            <aside
              className="scrollbar-hide overflow-y-auto rounded-[1.15rem] bg-[#ebe7df] px-3 py-4 nav:h-0 nav:min-h-full"
              aria-label={pastLabel}
            >
              <p className="m-0 px-2 font-sans text-[0.72rem] font-extrabold tracking-[0.08em] text-indigo uppercase">
                {pastLabel}
              </p>
              <ul className="m-0 mt-2 list-none p-0">
                {pastTools.map((item) => {
                  const imageUrl = toolImageUrl(item);
                  return (
                    <li key={item.slug}>
                      <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-transparent px-2 py-2 text-left hover:bg-white/70"
                        onClick={(event) =>
                          openToolPreview(
                            preview,
                            item,
                            event.currentTarget,
                            imageUrl,
                            kicker,
                          )
                        }
                      >
                        <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-white font-sans text-[0.65rem] font-extrabold tracking-[0.08em] text-indigo">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt=""
                              fill
                              sizes="44px"
                              className="object-cover"
                              {...imageBlurProps(item.imageLqip)}
                            />
                          ) : (
                            item.name.slice(0, 1)
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-sans text-[0.95rem] font-extrabold tracking-[-0.02em] text-ink">
                            {item.name}
                          </span>
                          {item.summary ? (
                            <span className="mt-0.5 line-clamp-1 block font-sans text-[0.75rem] leading-snug text-muted">
                              {item.summary}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
