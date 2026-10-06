import type { Metadata } from "next";

import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=20261006", sizes: "any" },
      { url: "/favicon-16x16.png?v=20261006", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png?v=20261006", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png?v=20261006", type: "image/png", sizes: "48x48" },
      { url: "/icon.png?v=20261006", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png?v=20261006", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    google: "8seF3--uVP-BHV8H6FqZXTdkKXNxWqocHU5lou2eLUI",
  },
  other: {
    "apple-itunes-app": `app-id=${site.appStoreId}`,
  },
};

/** Pass-through: `<html>` / `<body>` live in `[locale]` and `studio` layouts for correct `lang`. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
