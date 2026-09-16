import {
  Hanken_Grotesk,
  Instrument_Serif,
  Noto_Serif_JP,
  Noto_Serif_KR,
} from "next/font/google";

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700", "800"],
});

/** Editorial italic accent (Oimachi Feature Deck stand-in for Latin). */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
  weight: "400",
  style: "italic",
});

/** Hangul serif fallback for italic display accents. */
export const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif-kr",
  weight: ["400", "600"],
});

/** Japanese serif fallback for italic display accents. */
export const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif-jp",
  weight: ["400", "600"],
});

export const fontVariables = [
  hankenGrotesk.variable,
  instrumentSerif.variable,
  notoSerifKr.variable,
  notoSerifJp.variable,
].join(" ");
