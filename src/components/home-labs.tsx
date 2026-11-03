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
  return coverImageUrl(item.image, 640, 480);
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

function ToolListRow({
  item,
  kicker,
  meta,
}: {
  item: NewArrivalsItem;
  kicker: string;
  meta: string;
}) {
  const preview = useOptionalArticlePreview();
  const imageUrl = toolImageUrl(item);

  return (
    <li className="border-b border-ink/10">
      <button
        type="button"
        className="group/list grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_minmax(7rem,11rem)] items-start gap-x-6 gap-y-3 border-0 bg-transparent py-7 text-left transition-colors max-archive:grid-cols-1"
        aria-label={item.name}
        onClick={(event) =>
          openToolPreview(preview, item, event.currentTarget, imageUrl, kicker)
        }
      >
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="m-0 font-sans text-[0.72rem] leading-none tracking-[0.01em] text-muted">
              {meta}
            </p>
            <span
              className="mt-[-0.15rem] flex size-6 shrink-0 items-center justify-center font-sans text-[1.15rem] font-light leading-none text-ink/40 transition-colors group-hover/list:text-ink"
              aria-hidden
            >
              +
            </span>
          </div>
          <h3 className="m-0 mt-3 font-sans text-[clamp(1.15rem,2.2vw,1.45rem)] font-extrabold leading-[1.22] tracking-[-0.025em] text-ink">
            {item.name}
          </h3>
          {item.summary ? (
            <p className="mt-3 mb-0 max-w-[42rem] line-clamp-2 font-sans text-[0.88rem] leading-[1.6] text-muted">
              {item.summary}
            </p>
          ) : null}
        </div>
        {imageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[0.85rem] bg-[#ebe7df] max-archive:max-w-[16rem]">
            <Image
              src={imageUrl}
              alt={item.imageAlt || item.name}
              fill
              sizes="(max-width: 560px) 100vw, 176px"
              className="object-cover transition-transform duration-500 group-hover/list:scale-[1.03]"
              {...imageBlurProps(item.imageLqip)}
            />
          </div>
        ) : null}
      </button>
    </li>
  );
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
  const featured = roundup.items.slice(0, 2);
  if (featured.length === 0) return null;

  const pastOnly = pastTools.filter(
    (item) => !featured.some((feature) => feature.slug === item.slug),
  );

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

        <ul className="m-0 list-none border-t border-ink/10 p-0">
          {featured.map((item) => (
            <ToolListRow
              key={item.slug}
              item={item}
              kicker={kicker}
              meta={kicker}
            />
          ))}
        </ul>

        {pastOnly.length > 0 ? (
          <div className="mt-10">
            <p
              className={cn(
                "m-0 mb-2 font-sans text-[0.72rem] font-semibold tracking-[0.08em] text-muted uppercase",
              )}
            >
              {pastLabel}
            </p>
            <ul className="m-0 list-none border-t border-ink/10 p-0" aria-label={pastLabel}>
              {pastOnly.map((item) => (
                <ToolListRow
                  key={item.slug}
                  item={item}
                  kicker={kicker}
                  meta={kicker}
                />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
