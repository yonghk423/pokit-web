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
  viewAllHref = "/articles",
  viewAllLabel = "더보기",
}: Props) {
  return (
    <header className="mb-[1.2rem] flex flex-wrap items-end justify-between gap-4 border-t-4 border-line pt-3 max-[640px]:items-start">
      <div className="min-w-0">
        {kicker && (
          <p className="m-0 font-sans text-[0.72rem] font-extrabold tracking-[0.1em] text-green uppercase">
            {kicker}
          </p>
        )}
        <h2 className="m-0 text-[clamp(1.65rem,3vw,2.35rem)] leading-none tracking-[-0.035em]">
          {title}
        </h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className={cn(
            "shrink-0 font-sans text-[0.82rem] font-bold tracking-[0.02em] whitespace-nowrap underline underline-offset-[0.14em] hover:text-green",
            "max-[640px]:text-[0.78rem]",
          )}
        >
          {viewAllLabel} →
        </Link>
      )}
    </header>
  );
}
