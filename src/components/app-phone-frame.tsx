"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

import { useAppScreenReady } from "@/components/app-page-ready";
import { APP_SCREEN_SHELL } from "@/lib/app-screens";
import { cn } from "@/lib/cn";

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
  const markReady = useAppScreenReady();
  const done = useRef(false);

  const finish = () => {
    if (done.current || !markReady) return;
    done.current = true;
    markReady();
  };

  return (
    <div
      className={cn(
        "overflow-hidden border-2 border-black",
        elevated ? "brutal-shadow-mint" : "brutal-shadow",
        className,
      )}
      style={{ backgroundColor: APP_SCREEN_SHELL }}
    >
      <Image
        src={src}
        alt={alt}
        sizes="(max-width: 640px) 45vw, 240px"
        quality={75}
        priority={priority}
        loading={eager || priority ? "eager" : undefined}
        fetchPriority={eager || priority ? "high" : undefined}
        placeholder="blur"
        onLoad={finish}
        onError={finish}
        className="h-auto w-full"
        style={{ backgroundColor: APP_SCREEN_SHELL }}
      />
    </div>
  );
}
