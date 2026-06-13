import type { Metadata } from "next";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — 일상 웰니스 가이드`,
    template: `%s | ${site.name}`,
  },
  description: "일상의 작은 루틴으로 웰니스를 만드는 가이드와 앱.",
  icons: {
    icon: "/pokitstory.png",
    apple: "/pokitstory.png",
  },
  openGraph: {
    title: site.name,
    description: "일상의 작은 루틴으로 웰니스를 만드는 가이드와 앱.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
