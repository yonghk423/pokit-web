"use client";

import { PortableText, type PortableTextBlock } from "next-sanity";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  useArticlePreview,
  type ArticlePreviewOrigin,
} from "@/components/article-preview-context";
import { ArticlePreviewBodySkeleton } from "@/components/article-preview-skeleton";
import { PreviewCoverImage } from "@/components/preview-cover-image";
import { cn } from "@/lib/cn";

type PreviewTool = {
  slug: string;
  name: string;
  summary: string | null;
  imageAlt: string;
  body: PortableTextBlock[] | null;
  coverUrl: string | null;
  imageLqip: string | null;
};

type Props = {
  closeLabel: string;
};

function originStyle(origin: ArticlePreviewOrigin): CSSProperties {
  return {
    position: "fixed",
    top: origin.top,
    left: origin.left,
    width: origin.width,
    height: origin.height,
    borderRadius: "1.15rem",
  };
}

function rectStyle(rect: DOMRect): CSSProperties {
  return {
    position: "fixed",
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    borderRadius: "1.15rem",
  };
}

export function RoutineToolPreviewModal({ closeLabel }: Props) {
  const { locale, active, close } = useArticlePreview();
  const titleId = useId();
  const mediaRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"from" | "to" | "ready">("from");
  const [target, setTarget] = useState<CSSProperties | null>(null);
  const [detail, setDetail] = useState<PreviewTool | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const toolActive = active?.kind === "tool" ? active : null;

  useEffect(() => {
    if (!toolActive) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setPhase("from");
    setTarget(null);
    setLoading(true);
    setError(false);
    setDetail(null);

    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    let raf3 = 0;
    let settleTimer = 0;
    let retryTimer = 0;

    const readTarget = () => {
      const el = mediaRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) return null;
      return rectStyle(rect);
    };

    const startFlight = () => {
      if (cancelled) return;
      const next = readTarget();
      if (!next) {
        retryTimer = window.setTimeout(startFlight, 32);
        return;
      }

      setTarget(next);
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        void flyRef.current?.offsetWidth;
        raf3 = requestAnimationFrame(() => {
          if (cancelled) return;
          setPhase("to");
          settleTimer = window.setTimeout(() => {
            if (!cancelled) setPhase("ready");
          }, 520);
        });
      });
    };

    raf1 = requestAnimationFrame(startFlight);

    const controller = new AbortController();
    fetch(
      `/api/tools/${encodeURIComponent(toolActive.tool.slug)}?locale=${locale}`,
      { signal: controller.signal },
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        return res.json() as Promise<PreviewTool>;
      })
      .then((data) => {
        if (cancelled) return;
        setDetail(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    function onResize() {
      const next = readTarget();
      if (next) setTarget(next);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cancelAnimationFrame(raf3);
      window.clearTimeout(settleTimer);
      window.clearTimeout(retryTimer);
      controller.abort();
      window.removeEventListener("resize", onResize);
    };
  }, [toolActive, locale]);

  useEffect(() => {
    if (!toolActive) return;
    panelRef.current?.focus();
  }, [toolActive]);

  if (!toolActive) return null;

  const imageUrl = toolActive.origin.imageUrl;
  const blurDataURL =
    toolActive.origin.blurDataURL ?? detail?.imageLqip ?? null;
  const hasFlight = Boolean(imageUrl) && phase !== "ready";
  const contentReady = phase === "ready";
  const flyStyle =
    phase === "from" || !target
      ? originStyle(toolActive.origin)
      : target;
  const title = detail?.name ?? toolActive.tool.name;
  const summary = detail?.summary ?? toolActive.tool.summary;
  // Keep the already-warm list/card URL so detail fetch does not remount the image.
  const panelSrc = imageUrl ?? detail?.coverUrl;

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 border-0 bg-ink/45 backdrop-blur-[2px]"
        aria-label={closeLabel}
        onClick={close}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute inset-1.5 overflow-hidden rounded-[1.15rem] bg-paper shadow-[0_24px_80px_rgba(24,26,46,0.28)] outline-none",
          "nav:inset-2.5 nav:rounded-[1.35rem]",
          "flex flex-col",
          "max-nav:inset-x-1.5 max-nav:top-1.5 max-nav:bottom-[max(1.25rem,env(safe-area-inset-bottom))]",
        )}
        data-preview-modal-panel
      >
        <div className="flex shrink-0 items-center justify-between gap-3 px-5 py-2.5 max-nav:px-4">
          <button
            type="button"
            onClick={close}
            className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[0.82rem] font-medium tracking-[-0.01em] text-muted transition-colors hover:text-ink"
          >
            <span aria-hidden className="text-[0.95em]">
              ←
            </span>
            {closeLabel}
          </button>
          <button
            type="button"
            onClick={close}
            className="inline-flex size-8 items-center justify-center border-0 bg-transparent p-0 font-sans text-[1.35rem] font-light leading-none text-muted transition-colors hover:text-ink"
            aria-label={closeLabel}
          >
            ×
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(16rem,0.85fr)_minmax(0,1.25fr)] gap-7 px-5 pb-5 pt-1 max-nav:grid-cols-1 max-nav:gap-4 max-nav:overflow-y-auto max-nav:px-4 max-nav:pb-4">
          <div className="min-h-0 max-nav:mx-auto max-nav:w-full max-nav:max-w-[22rem]">
            <div
              ref={mediaRef}
              className="relative h-full min-h-[18rem] overflow-hidden rounded-[1.15rem] bg-[#ebe7df] max-nav:aspect-[4/5] max-nav:h-auto max-nav:max-h-[min(48vh,26rem)]"
            >
              {panelSrc ? (
                <PreviewCoverImage
                  src={panelSrc}
                  alt={detail?.imageAlt || toolActive.tool.imageAlt || title}
                  blurDataURL={blurDataURL}
                  sizes="(max-width: 900px) 90vw, 42vw"
                  priority
                  hidden={hasFlight}
                />
              ) : null}
            </div>
          </div>

          <div
            className={cn(
              "flex min-h-0 min-w-0 flex-col transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              contentReady
                ? "translate-x-0 opacity-100"
                : "translate-x-3 opacity-0",
            )}
          >
            {error ? (
              <p className="m-0 font-sans text-[0.9rem] text-muted">
                Failed to load.
              </p>
            ) : null}

            {!error ? (
              <>
                <div className="shrink-0 border-b border-ink/8 pb-4">
                  <p className="m-0 font-sans text-[0.72rem] font-semibold tracking-[0.06em] text-muted uppercase">
                    {toolActive.kicker}
                  </p>
                  <h2
                    id={titleId}
                    className="m-0 mt-2.5 font-sans text-[clamp(1.45rem,2.5vw,2.15rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-ink"
                  >
                    {title}
                  </h2>
                  {summary ? (
                    <p className="mt-3 mb-0 max-w-[40rem] font-sans text-[0.95rem] leading-[1.6] text-muted">
                      {summary}
                    </p>
                  ) : null}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-5 max-nav:overflow-visible">
                  {detail?.body && detail.body.length > 0 ? (
                    <div className="prose max-w-[44rem] pb-3 font-sans text-ink prose-p:text-[0.96rem] prose-p:leading-[1.75]">
                      <PortableText value={detail.body} />
                    </div>
                  ) : loading ? (
                    <ArticlePreviewBodySkeleton />
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {hasFlight && imageUrl ? (
        <div
          ref={flyRef}
          className={cn(
            "pointer-events-none fixed z-[90] overflow-hidden bg-[#ebe7df]",
            phase === "to" &&
              "transition-[top,left,width,height,border-radius] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          )}
          style={flyStyle}
        >
          <PreviewCoverImage
            src={imageUrl}
            alt=""
            blurDataURL={toolActive.origin.blurDataURL}
            sizes="50vw"
            priority
          />
        </div>
      ) : null}
    </div>
  );
}
