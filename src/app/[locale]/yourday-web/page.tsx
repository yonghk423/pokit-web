import type { Metadata } from "next";
import localFont from "next/font/local";
const journalFont = localFont({src: "../../../fonts/OwnglyphCorncorn.ttf", variable: "--font-yourday", display: "swap", weight: "400"});
import { notFound } from "next/navigation";
import { WebDiaryWorkspace } from "@/components/web-diary";
import { webDiaryCopy, isWebLocale, webAppLocale } from "@/content/web-diary-copy";
import { appName } from "@/config/site";

type Props = { params: Promise<{locale: string}> };
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  if (!isWebLocale(locale)) return {};
  return {title: {absolute: `${appName(webAppLocale(locale))} · ${webDiaryCopy[locale].web}`}, description:webDiaryCopy[locale].description, robots:{index:false,follow:true}};
}
export default async function WebDiaryPage({params}: Props) {
  const {locale} = await params;
  if (!isWebLocale(locale)) notFound();
  return <div className={journalFont.variable}><WebDiaryWorkspace locale={locale} copy={webDiaryCopy[locale]} /></div>;
}
