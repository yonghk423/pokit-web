import Image from "next/image";

import { appStoreUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

type Props = {
  locale: Locale;
  label: string;
  className?: string;
  size?: "default" | "compact";
};

export function AppStoreBadge({
  locale,
  label,
  className,
  size = "default",
}: Props) {
  const compact = size === "compact";

  return (
    <a
      href={appStoreUrl(locale)}
      aria-label={label}
      className={cn(
        "inline-flex items-center bg-black text-white transition-transform duration-150 hover:-translate-y-0.5 hover:opacity-90",
        compact
          ? "h-9 gap-2 rounded-md px-2.5"
          : "h-13 gap-3 rounded-lg px-4",
        className,
      )}
    >
      <span
        className={cn(
          "relative shrink-0 overflow-hidden",
          compact ? "h-5 w-5" : "h-8 w-8",
        )}
      >
        <Image
          src="/apple.png"
          alt=""
          width={compact ? 20 : 32}
          height={compact ? 20 : 32}
          className={cn(
            "scale-[1.75] object-contain invert",
            compact ? "h-5 w-5" : "h-8 w-8",
          )}
          aria-hidden="true"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-normal tracking-[0.01em]",
            compact ? "text-[0.48rem]" : "text-[0.6rem]",
          )}
        >
          Download on the
        </span>
        <span
          className={cn(
            "font-semibold tracking-[-0.02em]",
            compact ? "mt-[0.1rem] text-[0.92rem]" : "mt-[0.15rem] text-[1.25rem]",
          )}
        >
          App Store
        </span>
      </span>
    </a>
  );
}
