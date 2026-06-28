import { Noto_Serif_KR } from "next/font/google";
import localFont from "next/font/local";

export const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

export const notoSerifKr = Noto_Serif_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif-kr",
});

export const fontVariables = `${pretendard.variable} ${notoSerifKr.variable}`;
