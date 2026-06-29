"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type Props = {
  title: string;
  className?: string;
};

export function CopyTitleButton({ title, className }: Props) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(title);
      setCopied(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [title]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "제목이 복사됨" : "제목 복사"}
      className={cn(
        "mt-[0.35rem] inline-flex shrink-0 items-center gap-[0.35rem] rounded-sm border border-fine-line bg-panel px-[0.55rem] py-[0.4rem] font-sans text-[0.72rem] font-bold tracking-[0.04em] text-muted uppercase transition-colors hover:border-green hover:text-green",
        copied && "border-green text-green",
        className,
      )}
    >
      {copied ? (
        <>
          <CheckIcon />
          복사됨
        </>
      ) : (
        <>
          <CopyIcon />
          복사
        </>
      )}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
