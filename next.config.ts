import type { NextConfig } from "next";

if (process.env.VERCEL && !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn(
    "[pokit-web] NEXT_PUBLIC_SANITY_PROJECT_ID is missing on Vercel. " +
      "Sanity articles and cover images will not load until it is set and redeployed.",
  );
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.29.75.150"],
  // Hide the floating Next.js "N" badge in local development.
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: "/:locale(ko|en|ja|zh-TW)/web", destination: "/:locale/yourday-web", permanent: true },
      { source: "/web", destination: "/yourday-web", permanent: true },
      // Stable destination for the pre-localization privacy URL.
      { source: "/privacy", destination: "/en/privacy", permanent: true },
    ];
  },
  images: {
    // Vercel's Image Optimization endpoint is currently returning 402 for this
    // project. Sanity URLs are pre-sized by coverImageUrl, so serve image URLs
    // directly until the optimizer billing issue is resolved.
    unoptimized: true,
    /** Include retina widths so phone frames stay sharp on mobile DPR. */
    imageSizes: [96, 128, 256, 384, 640, 750, 828],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
