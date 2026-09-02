import Image from "next/image";

import { appStoreUrl } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

type Props = {
  locale: Locale;
  label: string;
  className?: string;
};

export function AppStoreBadge({ locale, label, className }: Props) {
  return (
    <a
      href={appStoreUrl(locale)}
      aria-label={label}
      className={cn(
        "inline-flex h-13 items-center gap-3 rounded-lg bg-black px-4 text-white transition-transform duration-150 hover:-translate-y-0.5 hover:opacity-90",
        className,
      )}
    >
      <span className="relative h-8 w-8 shrink-0 overflow-hidden">
        <Image
          src="/apple.png"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 scale-[1.75] object-contain invert"
          aria-hidden="true"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[0.6rem] font-normal tracking-[0.01em]">
          Download on the
        </span>
        <span className="mt-[0.15rem] text-[1.25rem] font-semibold tracking-[-0.02em]">
          App Store
        </span>
      </span>
    </a>
  );
}
