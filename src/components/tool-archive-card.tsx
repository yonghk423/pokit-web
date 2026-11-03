"use client";

import Image from "next/image";

import { useOptionalArticlePreview } from "@/components/article-preview-context";
import type { Locale } from "@/i18n/config";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import type { NewArrivalsItem } from "@/sanity/types";

type Props = {
  locale: Locale;
  item: NewArrivalsItem;
  kicker: string;
};

export function ToolArchiveCard({ item, kicker }: Props) {
  const preview = useOptionalArticlePreview();
  const imageUrl =
    isSanityConfigured() && item.image
      ? coverImageUrl(item.image, 640, 480)
      : null;

  return (
    <li className="border-b border-ink/10">
      <button
        type="button"
        className="group/list grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_minmax(7rem,11rem)] items-start gap-x-6 gap-y-3 border-0 bg-transparent py-7 text-left transition-colors max-archive:grid-cols-1"
        aria-label={item.name}
        onClick={(event) => {
          if (!preview) return;
          const rect = event.currentTarget.getBoundingClientRect();
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
        }}
      >
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="m-0 font-sans text-[0.72rem] leading-none tracking-[0.01em] text-muted">
              {kicker}
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
