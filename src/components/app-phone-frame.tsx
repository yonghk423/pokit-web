"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

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
  const [ready, setReady] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      quality={75}
      priority={priority}
      loading={eager || priority ? "eager" : undefined}
      fetchPriority={eager || priority ? "high" : undefined}
      placeholder="blur"
      onLoad={() => setReady(true)}
      className={cn(
        "h-auto w-full origin-center transition-[filter,transform] duration-500 ease-out",
        ready ? "scale-100 blur-0" : "scale-[1.14] blur-2xl",
        className,
      )}
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
  className?: string;
};

export function PhoneFrame({
  src,
  alt,
  priority = false,
  eager = false,
  elevated = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden border-2 border-black",
        elevated ? "brutal-shadow-mint" : "brutal-shadow",
        className,
      )}
      style={{ backgroundColor: APP_SCREEN_SHELL }}
    >
      <AppScreenImage
        src={src}
        alt={alt}
        sizes="(max-width: 640px) 45vw, 240px"
        priority={priority}
        eager={eager}
      />
    </div>
  );
}
