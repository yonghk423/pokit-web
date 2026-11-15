import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { AppDownloadMessages } from "@/i18n/get-app-download-messages";
import { withLocale } from "@/lib/locale-path";
type Props = { locale: Locale; messages: AppDownloadMessages; placement: string; variant?: "banner" | "inline" };


export function AppPromotion({locale}:Props){
return <aside className="bg-[#eeebe5] px-5 py-4 text-center"><Link href={withLocale(locale,"/app")}><strong>Daylight</strong>　{locale==="ko"?"다이어리 살펴보기":"Explore the diary"} ↗</Link></aside>;
}
