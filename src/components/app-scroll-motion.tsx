"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className: string;
  lang: string;
};

export function AppScrollMotion({ children, className, lang }: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | undefined;

    function setup() {
      observer?.disconnect();
      for (const element of elements) {
        element.removeAttribute("data-scroll-motion");
        element.style.removeProperty("transition-delay");
      }
      if (preference.matches) return;

      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            element.dataset.scrollMotion = "shown";
          } else {
            element.dataset.scrollMotion = "pending";
          }
        }
      }, { threshold: 0.12, rootMargin: "0px 0px -70px 0px" });

      for (const element of elements) {
        element.style.transitionDelay = `${Number(element.dataset.revealDelay || 0)}ms`;
        element.dataset.scrollMotion = "pending";
        observer.observe(element);
      }
    }

    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Element) {
        const element = event.target.closest<HTMLElement>("[data-reveal]");
        if (element) element.dataset.scrollMotion = "shown";
      }
    };
    setup();
    root.addEventListener("focusin", onFocus);
    preference.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      root.removeEventListener("focusin", onFocus);
      preference.removeEventListener("change", setup);
      elements.forEach(element => element.removeAttribute("data-scroll-motion"));
    };
  }, []);

  return <main ref={rootRef} id="app-intro-page" lang={lang} className={className}>{children}</main>;
}
