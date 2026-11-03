"use client";

import { siteName } from "@/config/site";

import Image from "next/image";
import type { Locale } from "@/i18n/config";

import { useOptionalArticlePreview } from "@/components/article-preview-context";
import { cn } from "@/lib/cn";
import { isSanityConfigured } from "@/sanity/env";
import { coverImageUrl, imageBlurProps } from "@/sanity/image";
import type { NewArrivalsItem } from "@/sanity/types";

type Props = {
  locale: Locale;
  item: NewArrivalsItem;
  kicker: string;
};

export function ToolArchiveCard({ item, kicker, locale }: Props) {
  const preview = useOptionalArticlePreview();
  const imageUrl =
    isSanityConfigured() && item.image
      ? coverImageUrl(item.image, 900, 1125)
      : null;

  return (
    <article className="min-w-0">
      <button
        type="button"
        className="group/card block w-full cursor-pointer border-0 bg-transparent p-0 text-left transition-colors hover:text-ink"
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
        <figure className="m-0">
          <div
            className={cn(
              "aspect-4/5 overflow-hidden rounded-[1.1rem] bg-[#ebe7df]",
              !imageUrl &&
                "grid place-items-center font-sans text-[0.72rem] font-extrabold tracking-[0.1em] text-indigo uppercase",
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.imageAlt || item.name}
                width={900}
                height={1125}
                className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
                sizes="(min-width: 900px) 25vw, 50vw"
                {...imageBlurProps(item.imageLqip)}
              />
            ) : (
              <span>{siteName()}</span>
            )}
          </div>
        </figure>
        <h3 className="m-0 mt-3 text-[1.05rem] font-extrabold leading-[1.22] tracking-[-0.025em] group-hover/card:text-indigo">
          {item.name}
        </h3>
      </button>
    </article>
  );
}
