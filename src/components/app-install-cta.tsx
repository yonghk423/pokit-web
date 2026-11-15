import Link from "next/link";
import { withLocale } from "@/lib/locale-path";
import type { Locale } from "@/i18n/config";
import type { AppInstallMessages } from "@/i18n/get-app-install-messages";
type Props = {
  locale: Locale;
  messages: AppInstallMessages;
  className?: string;
};

/** Shared browser download panel for article and tool previews. */

export function AppInstallCta({locale}:Props){
return <aside className="bg-[#eeebe5] px-5 py-4 text-center"><Link href={withLocale(locale,"/app")}><strong>Daylight</strong>　{locale==="ko"?"다이어리 살펴보기":"Explore the diary"} ↗</Link></aside>;
}
