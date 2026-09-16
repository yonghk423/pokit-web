import Image from "next/image";
import Link from "next/link";

import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";
import { getCategories } from "@/lib/category-label";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { withLocale } from "@/lib/locale-path";
import { cn, monoContainer } from "@/lib/cn";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function SiteFooter({ locale, dict }: Props) {
  const categories = getCategories(dict);
  const homeHref = withLocale(locale, "/");

  return (
    <footer className="mt-24 border-t border-ink/10 bg-[#f3f0e8] pt-14 pb-10 font-sans max-nav:mt-16">
      <div className={monoContainer}>
        <div className="grid grid-cols-4 gap-10 max-nav:grid-cols-2 max-[520px]:grid-cols-1">
          <div>
            <h2 className="m-0 mb-5 text-[1.35rem] font-extrabold tracking-[-0.03em]">
              {dict.footer.sections}
            </h2>
            <ul className="m-0 grid list-none gap-2.5 p-0">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`${homeHref}#${category.id}`}
                    className="text-[0.88rem] text-muted no-underline hover:text-ink"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="m-0 mb-5 text-[1.35rem] font-extrabold tracking-[-0.03em]">
              {dict.footer.information}
            </h2>
            <ul className="m-0 grid list-none gap-2.5 p-0">
              <li>
                <Link
                  href={withLocale(locale, "/articles")}
                  className="text-[0.88rem] text-muted no-underline hover:text-ink"
                >
                  {dict.footer.allStories}
                </Link>
              </li>
              <li>
                <Link
                  href={withLocale(locale, "/briefing")}
                  className="text-[0.88rem] text-muted no-underline hover:text-ink"
                >
                  {dict.footer.briefing}
                </Link>
              </li>
              <li>
                <Link
                  href={withLocale(locale, "/new-arrivals")}
                  className="text-[0.88rem] text-muted no-underline hover:text-ink"
                >
                  {dict.footer.newArrivals}
                </Link>
              </li>
              <li>
                <Link
                  href={withLocale(locale, "/support")}
                  className="text-[0.88rem] text-muted no-underline hover:text-ink"
                >
                  {dict.footer.support}
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 max-nav:col-span-2 max-[520px]:col-span-1">
            <div className="flex items-start gap-4">
              <Image
                src="/pokit5.png"
                alt=""
                width={48}
                height={48}
                className="rounded-xl"
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
                  <SupportEmailLink className="inline-flex rounded-full border border-ink/15 bg-white px-4 py-2 text-[0.8rem] font-semibold text-ink no-underline hover:border-ink/35">
                    {site.supportEmail}
                  </SupportEmailLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-ink/10 pt-6 text-[0.8rem] text-muted">
          © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
