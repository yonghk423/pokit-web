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

  return (
    <footer className="mt-16 border-t-2 border-black bg-beige py-12 font-sans">
      <div
        className={cn(
          monoContainer,
          "grid grid-cols-[2fr_1fr_1fr] gap-12 max-nav:grid-cols-1 max-nav:gap-10",
        )}
      >
        <div className="flex items-start gap-4">
          <Image
            src="/pokitstory.png"
            alt=""
            width={44}
            height={44}
            className="border-2 border-black"
          />
          <div>
            <p className="m-0 font-extrabold tracking-[0.1em] text-ink!">
              {site.name}
            </p>
            <p className="m-0 mt-1 text-[0.82rem] leading-relaxed text-muted">
              {dict.footer.tagline}
            </p>
          </div>
        </div>
        <div>
          <h2 className="m-0 mb-4 label-caps text-ink">
            {dict.footer.sections}
          </h2>
          <ul className="m-0 grid list-none gap-2 p-0">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`${withLocale(locale, "/")}#${category.id}`}
                  className="text-[0.82rem] text-muted hover:text-indigo"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="m-0 mb-4 label-caps text-ink">
            {dict.footer.information}
          </h2>
          <ul className="m-0 grid list-none gap-2 p-0">
            <li>
              <Link href={withLocale(locale, "/articles")} className="text-[0.82rem] text-muted hover:text-indigo">
                {dict.footer.allStories}
              </Link>
            </li>
            <li>
              <Link href={withLocale(locale, "/support")} className="text-[0.82rem] text-muted hover:text-indigo">
                {dict.footer.support}
              </Link>
            </li>
            <li>
              <SupportEmailLink className="cursor-pointer text-[0.82rem] text-muted underline underline-offset-[0.18em] hover:text-ink">
                {site.supportEmail}
              </SupportEmailLink>
            </li>
          </ul>
        </div>
      </div>
      <p
        className={cn(
          monoContainer,
          "mt-10 border-t-2 border-black pt-6 text-[0.82rem] text-muted",
        )}
      >
        © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
      </p>
    </footer>
  );
}
