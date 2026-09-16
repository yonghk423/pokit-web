import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Wide magazine layout — home, archive grids, carousels. Near edge-to-edge. */
export const monoContainer =
  "mx-auto w-full px-[clamp(1rem,1.8vw,1.5rem)]";

/** Narrow reading column — article body, support. */
export const narrowContainer =
  "mx-auto w-full max-w-[42rem] px-[clamp(1rem,1.8vw,1.5rem)]";

/** Vertical section rhythm between home blocks. */
export const sectionSpacing = "mt-12 max-nav:mt-10";
