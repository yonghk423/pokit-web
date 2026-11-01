import localFont from "next/font/local";

/** Same regular font file as the native app's default corncorn face. */
export const yourdayFont = localFont({
  src: "../fonts/OwnglyphCorncorn.ttf",
  variable: "--font-yourday",
  display: "swap",
  weight: "400",
});
