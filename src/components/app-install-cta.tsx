import Image from "next/image";
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
return (
  <aside className="rounded-xl border border-[#e8dfe2] bg-[#f7f0f2] px-4 py-3 text-center sm:px-5 sm:py-4">
    <Link
      href={withLocale(locale,"/app")}
      className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm text-ink transition-colors hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <Image
        src="/daylight/promotion/daylight-photo-calendar-icon.jpg"
        alt=""
        aria-hidden="true"
        width={160}
        height={160}
        sizes="24px"
        className="size-6 shrink-0 rounded object-cover"
      />
      <span><strong>Daylight</strong>　{locale==="ko"?"다이어리 살펴보기":"Explore the diary"} ↗</span>
    </Link>
  </aside>
);
}
