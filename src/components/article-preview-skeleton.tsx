import { cn } from "@/lib/cn";

function Bone({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "block animate-pulse rounded-md bg-ink/[0.07]",
        className,
      )}
      aria-hidden
    />
  );
}

/** Body / PortableText column while detail fetch is in flight. */
export function ArticlePreviewBodySkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("pt-1", className)} aria-busy="true" aria-live="polite">
      <Bone className="h-3.5 w-full" />
      <Bone className="mt-2.5 h-3.5 w-[97%]" />
      <Bone className="mt-2.5 h-3.5 w-[88%]" />
      <Bone className="mt-2.5 h-3.5 w-[94%]" />
      <Bone className="mt-6 h-5 w-40" />
      <Bone className="mt-3 h-3.5 w-full" />
      <Bone className="mt-2.5 h-3.5 w-[92%]" />
      <Bone className="mt-2.5 h-3.5 w-[85%]" />
      <Bone className="mt-2.5 h-3.5 w-[70%]" />
    </div>
  );
}

/** Full text column (header + body) when card metadata is not yet shown. */
export function ArticlePreviewSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("flex min-h-0 min-w-0 flex-col", className)}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="shrink-0 border-b border-ink/8 pb-4">
        <Bone className="h-3 w-14" />
        <Bone className="mt-3 h-3 w-20" />
        <Bone className="mt-3 h-7 w-[92%]" />
        <Bone className="mt-2 h-7 w-[72%]" />
        <div className="mt-3 flex gap-1.5">
          <Bone className="h-5 w-12 rounded-full" />
          <Bone className="h-5 w-12 rounded-full" />
        </div>
        <Bone className="mt-4 h-3.5 w-full" />
        <Bone className="mt-2 h-3.5 w-[96%]" />
        <Bone className="mt-2 h-3.5 w-[78%]" />
        <Bone className="mt-3 h-3 w-36" />
      </div>

      <div className="min-h-0 flex-1 pt-5">
        <ArticlePreviewBodySkeleton />
      </div>
    </div>
  );
}
