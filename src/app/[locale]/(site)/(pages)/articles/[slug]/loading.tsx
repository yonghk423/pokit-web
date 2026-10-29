import { cn, monoContainer } from "@/lib/cn";

/** Match the reading page's header and cover footprint while Sanity data streams. */
export default function ArticleLoading() {
  return (
    <main className={cn(monoContainer, "py-12 pb-20")} aria-busy="true">
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="mb-10 h-10 w-48 rounded-full bg-ink/10" />
        <div className="mb-10">
          <div className="mb-4 h-3 w-24 rounded bg-ink/10" />
          <div className="h-12 w-[min(90%,58rem)] rounded bg-ink/10" />
          <div className="mt-5 h-5 w-[min(95%,42rem)] rounded bg-ink/10" />
          <div className="mt-3 h-5 w-[min(75%,32rem)] rounded bg-ink/10" />
          <div className="mt-5 h-3 w-48 rounded bg-ink/10" />
        </div>
        <div className="mb-12 rounded-[1.25rem] border border-ink/12 bg-[#f3f0e8]" style={{ aspectRatio: "16 / 9" }} />
        <div className="max-w-[42rem] space-y-3">
          <div className="h-4 rounded bg-ink/10" /><div className="h-4 rounded bg-ink/10" /><div className="h-4 w-4/5 rounded bg-ink/10" />
        </div>
      </div>
    </main>
  );
}
