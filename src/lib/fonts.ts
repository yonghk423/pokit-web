import { Hanken_Grotesk } from "next/font/google";

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700", "800"],
});

export const fontVariables = hankenGrotesk.variable;
