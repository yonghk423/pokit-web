"use client";

import Image, { type StaticImageData } from "next/image";

import { APP_SCREEN_SHELL } from "@/lib/app-screens";
import { cn } from "@/lib/cn";

type ScreenImageProps = {
  src: StaticImageData;
  alt: string;
  sizes: string;
  priority?: boolean;
  eager?: boolean;
  className?: string;
};

export function AppScreenImage({
  src,
  alt,
  sizes,
  priority = false,
  eager = false,
  className,
}: ScreenImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      // UI screenshots are already compressed WebP; re-encoding to AVIF/q75 softens text.
      unoptimized
      priority={priority}
      loading={eager || priority ? "eager" : undefined}
      fetchPriority={eager || priority ? "high" : undefined}
      className={cn("h-auto w-full", className)}
      style={{ backgroundColor: APP_SCREEN_SHELL }}
    />
  );
}

type Props = {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  eager?: boolean;
  elevated?: boolean;
  finish?: "brutal" | "soft";
  fit?: "auto" | "cover";
  sizes?: string;
  className?: string;
};

export function PhoneFrame({
  src,
  alt,
  priority = false,
  eager = false,
  elevated = false,
  finish = "brutal",
  fit = "auto",
  sizes = "(max-width: 640px) 45vw, 240px",
  className,
}: Props) {
  const cover = fit === "cover";
  return (
    <div
      className={cn(
        "overflow-hidden",
        finish === "soft"
          ? "rounded-[0.55rem] shadow-[0_20px_40px_-18px_rgba(24,26,46,0.32)] ring-1 ring-black/8 nav:rounded-[1.1rem]"
          : cn(
              "border-2 border-black",
              elevated ? "brutal-shadow-mint" : "brutal-shadow",
            ),
        cover && "h-full w-full",
        className,
      )}
      style={{ backgroundColor: APP_SCREEN_SHELL }}
    >
      <AppScreenImage
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        eager={eager}
        className={cover ? "h-full w-full object-cover" : undefined}
      />
    </div>
  );
}
