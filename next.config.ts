import type { NextConfig } from "next";

if (process.env.VERCEL && !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn(
    "[pokit-web] NEXT_PUBLIC_SANITY_PROJECT_ID is missing on Vercel. " +
      "Sanity articles and cover images will not load until it is set and redeployed.",
  );
}

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    /** Phone frames render ~160–256 CSS px; keep small widths in the candidate set. */
    imageSizes: [96, 128, 256, 384, 640],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
