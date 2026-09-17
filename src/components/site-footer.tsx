import Image from "next/image";
import Link from "next/link";

import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { withLocale } from "@/lib/locale-path";
import { monoContainer } from "@/lib/cn";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function SiteFooter({ locale, dict }: Props) {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-paper pt-14 pb-10 font-sans max-nav:mt-16">
      <div className={monoContainer}>
        <div className="ml-auto flex w-fit items-start gap-4">
          <Image
            src="/pokit5.png"
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-xl"
          />
          <div>
            <p className="m-0 text-[1.35rem] font-extrabold tracking-[-0.03em]">
              {site.name}
            </p>
            <p className="m-0 mt-2 max-w-sm text-[0.92rem] leading-relaxed text-muted">
              {dict.footer.tagline}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={withLocale(locale, "/app")}
                className="inline-flex rounded-full bg-ink px-4 py-2 text-[0.8rem] font-semibold text-white no-underline hover:bg-indigo"
              >
                {dict.footer.app}
              </Link>
              <Link
                href={withLocale(locale, "/support")}
                className="inline-flex rounded-full border border-ink/15 bg-white px-4 py-2 text-[0.8rem] font-semibold text-ink no-underline hover:border-ink/35"
              >
                {dict.footer.support}
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-ink/10 pt-6 text-right text-[0.8rem] text-muted">
          © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
