import Link from "next/link";
import { cookies } from "next/headers";

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { cn, monoContainer } from "@/lib/cn";
import { withLocale } from "@/lib/locale-path";

export default async function SiteNotFound() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale =
    cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <main className={cn(monoContainer, "py-16 pb-24 text-center")}>
      <p className="m-0 font-sans text-[0.72rem] font-extrabold tracking-[0.1em] text-green uppercase">
        404
      </p>
      <h1 className="mt-3 mb-0 text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-[-0.04em]">
        {dict.notFound.title}
      </h1>
      <p className="mx-auto mt-4 mb-0 max-w-md font-sans text-[0.95rem] text-muted">
        {dict.notFound.description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 font-sans text-[0.9rem]">
        <Link href={withLocale(locale, "/")} className="text-green hover:underline">
          {dict.notFound.home}
        </Link>
        <Link href={withLocale(locale, "/articles")} className="text-green hover:underline">
          {dict.notFound.allStories}
        </Link>
      </div>
    </main>
  );
}
