import type { Metadata } from "next";

import { site } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} — 일상 웰니스 가이드`,
    template: `%s | ${site.name}`,
  },
  description: "일상의 작은 루틴으로 웰니스를 만드는 가이드와 앱.",
  verification: {
    google: "8seF3--uVP-BHV8H6FqZXTdkKXNxWqocHU5lou2eLUI",
  },
  openGraph: {
    title: site.name,
    description: "일상의 작은 루틴으로 웰니스를 만드는 가이드와 앱.",
    locale: "ko_KR",
    type: "website",
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
    <html lang="ko" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
