import Link from "next/link";

import { cn } from "@/lib/cn";

type Props = {
  kicker?: string;
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function SectionHeading({
  kicker,
  title,
  viewAllHref,
  viewAllLabel = "더보기",
}: Props) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-6 border-t-2 border-indigo pt-5 max-[640px]:items-start">
      <div className="min-w-0">
        {kicker && (
          <p className="m-0 label-caps text-green">
            {kicker}
          </p>
        )}
        <h2 className="m-0 mt-1 text-[clamp(1.65rem,3vw,2.35rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
          {title}
        </h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className={cn(
            "inline-flex shrink-0 items-center bg-indigo px-4 py-2 font-sans text-[0.8rem] font-semibold tracking-[0.02em] whitespace-nowrap text-white hover:bg-ink",
            "max-[640px]:text-[0.75rem]",
          )}
        >
          {viewAllLabel}
        </Link>
      )}
    </header>
  );
}
