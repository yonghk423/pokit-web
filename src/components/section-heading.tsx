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
    <header className="mb-8 flex flex-wrap items-end justify-between gap-6 border-t-4 border-black pt-5 max-[640px]:items-start">
      <div className="min-w-0">
        {kicker && (
          <p className="m-0 label-caps text-green">
            {kicker}
          </p>
        )}
        <h2 className="m-0 mt-1 text-[clamp(1.65rem,3vw,2.35rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
          {title}
        </h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className={cn(
            "shrink-0 border-2 border-black bg-panel px-4 py-2 font-sans text-[0.78rem] font-bold tracking-[0.04em] whitespace-nowrap hover:bg-wash",
            "max-[640px]:text-[0.75rem]",
          )}
        >
          {viewAllLabel} →
        </Link>
      )}
    </header>
  );
}
