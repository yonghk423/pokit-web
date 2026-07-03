import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Wide magazine layout — home, archive grids, carousels. */
export const monoContainer =
  "mx-auto w-full max-w-[min(82rem,calc(100vw-2rem))] px-4";

/** Narrow reading column — article body, support, privacy. */
export const narrowContainer =
  "mx-auto w-full max-w-[42rem] px-4";

/** Vertical section rhythm between home blocks. */
export const sectionSpacing = "mt-12 max-nav:mt-10";
