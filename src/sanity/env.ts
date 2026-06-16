export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-15";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p1a0jtm8";

export function isSanityConfigured() {
  return Boolean(projectId && dataset);
}
