import type { Metadata } from "next";

import { site } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
