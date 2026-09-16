import { SiteHeaderNav } from "@/components/site-header-nav";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function SiteHeader({ locale, dict }: Props) {
  return (
    <SiteHeaderNav
      locale={locale}
      tagline={dict.header.tagline}
      homeAria={dict.header.homeAria}
      allStories={dict.header.allStories}
      app={dict.header.app}
      contact={dict.header.contact}
      languageLabels={dict.languageSwitcher}
    />
  );
}
