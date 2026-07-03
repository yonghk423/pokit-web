"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { switchLocalePath } from "@/lib/locale-path";
import { cn } from "@/lib/cn";

type Props = {
  locale: Locale;
  labels: Dictionary["languageSwitcher"];
  className?: string;
};

export function LanguageSwitcher({ locale, labels, className }: Props) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 border-2 border-black bg-panel px-2 py-1 font-sans text-[0.72rem] font-bold tracking-[0.06em] uppercase",
        className,
      )}
      aria-label={labels.label}
    >
      <Link
        href={switchLocalePath(pathname, "ko")}
        className={cn(
          "px-1 py-0.5",
          locale === "ko" ? "bg-wash text-ink" : "text-muted hover:bg-beige hover:text-ink",
        )}
        aria-current={locale === "ko" ? "true" : undefined}
      >
        {labels.ko}
      </Link>
      <span className="text-muted" aria-hidden="true">
        /
      </span>
      <Link
        href={switchLocalePath(pathname, "en")}
        className={cn(
          "px-1 py-0.5",
          locale === "en" ? "bg-wash text-ink" : "text-muted hover:bg-beige hover:text-ink",
        )}
        aria-current={locale === "en" ? "true" : undefined}
      >
        {labels.en}
      </Link>
    </div>
  );
}
