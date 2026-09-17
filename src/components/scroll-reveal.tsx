"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms once the element enters view. */
  delay?: number;
  as?: ElementType;
  /** Fraction of the element that must be visible (0–1). */
  threshold?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  threshold = 0.18,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      {
        threshold,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style =
    delay > 0
      ? ({ "--scroll-reveal-delay": `${delay}ms` } as CSSProperties)
      : undefined;

  return (
    <Tag
      ref={ref}
      className={cn(
        "scroll-reveal",
        visible && "scroll-reveal-in",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
