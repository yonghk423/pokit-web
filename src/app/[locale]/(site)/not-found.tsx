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
    <main className={cn(monoContainer, "py-20 pb-28 text-center")}>
      <p className="m-0 label-caps text-pink">
        404
      </p>
      <h1 className="mt-4 mb-0 text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">
        {dict.notFound.title}
      </h1>
      <p className="mx-auto mt-6 mb-0 max-w-md font-sans text-[0.95rem] leading-relaxed text-muted">
        {dict.notFound.description}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 font-sans text-[0.9rem]">
        <Link
          href={withLocale(locale, "/")}
          className="border-2 border-black bg-green px-5 py-2 font-bold text-panel hover:brutal-shadow"
        >
          {dict.notFound.home}
        </Link>
        <Link
          href={withLocale(locale, "/articles")}
          className="border-2 border-black bg-panel px-5 py-2 font-bold text-ink hover:bg-wash"
        >
          {dict.notFound.allStories}
        </Link>
      </div>
    </main>
  );
}
