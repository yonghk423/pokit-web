"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";
import { imageBlurProps } from "@/sanity/image";

type Props = {
  src: string;
  alt: string;
  blurDataURL?: string | null;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Keep media invisible (e.g. during FLIP flight). */
  hidden?: boolean;
};

/**
 * Modal/detail cover with LQIP blur placeholder.
 * Avoids remount/opacity gates that flash a second load.
 */
export function PreviewCoverImage({
  src,
  alt,
  blurDataURL,
  sizes,
  className,
  priority = false,
  hidden = false,
}: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={72}
      priority={priority}
      className={cn(
        "object-cover transition-opacity duration-300",
        hidden ? "opacity-0" : "opacity-100",
        className,
      )}
      {...imageBlurProps(blurDataURL)}
    />
  );
}
