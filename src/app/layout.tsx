import type { Metadata } from "next";

import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
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
