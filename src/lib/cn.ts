import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared page width constraint used across sections. */
export const monoContainer =
  "mx-auto w-full max-w-[min(82rem,calc(100vw-2rem))] px-4";
