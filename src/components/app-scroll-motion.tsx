"use client";

import { useEffect } from "react";

/** Progressive enhancement: content stays visible if scripting or motion is unavailable. */
export function AppScrollMotion() {
  useEffect(() => {
    const root = document.getElementById("app-intro-page");
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    let dispose = () => {};

    function setup() {
      dispose();
      if (preference.matches) return;
      const animations = new Set<Animation>();
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          const type = element.dataset.reveal;
          const image = type === "screen-left" || type === "screen-right";
          const mobile = window.matchMedia("(max-width: 760px)").matches;
          const x = image ? (type === "screen-left" ? -24 : 24) : 0;
          const angle = image ? (type === "screen-left" ? -3 : 3) : 0;
          const animation = element.animate([
            { opacity: 0, transform: `translate3d(${x}px, ${image ? 90 : 36}px, 0) scale(${image ? .94 : 1}) rotate(${angle}deg)` },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)" },
          ], { duration: mobile ? 800 : image ? 1250 : 950, delay: Number(element.dataset.revealDelay ?? 0), easing: "cubic-bezier(.16, 1, .3, 1)", fill: "both" });
          animations.add(animation);
          animation.onfinish = () => { element.dataset.scrollMotion = "shown"; animations.delete(animation); animation.cancel(); };
        }
      }, { threshold: .08, rootMargin: "0px 0px -24px 0px" });

      for (const element of elements) {
        if (element.dataset.scrollMotion === "shown" || element.getBoundingClientRect().bottom < 0) continue;
        element.dataset.scrollMotion = "pending";
        observer.observe(element);
      }
      const onFocus = (event: FocusEvent) => {
        if (!(event.target instanceof Element)) return;
        const element = event.target.closest<HTMLElement>('[data-scroll-motion="pending"]');
        if (element) { element.dataset.scrollMotion = "shown"; observer.unobserve(element); }
      };
      root!.addEventListener("focusin", onFocus);
      dispose = () => {
        observer.disconnect();
        animations.forEach(animation => animation.cancel());
        elements.forEach(element => { delete element.dataset.scrollMotion; });
        root!.removeEventListener("focusin", onFocus);
      };
    }
    setup();
    preference.addEventListener("change", setup);
    return () => { dispose(); preference.removeEventListener("change", setup); };
  }, []);
  return null;
}
