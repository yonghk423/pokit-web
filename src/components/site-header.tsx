import Image from "next/image";
import Link from "next/link";

import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";
import { categories } from "@/content/home";
import { cn, monoContainer } from "@/lib/cn";

const navLinkClass =
  "border-0 bg-transparent p-0 font-sans text-[0.75rem] font-bold tracking-[0.08em] text-muted uppercase";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-panel">
      <div
        className={cn(
          monoContainer,
          "flex min-h-[2.15rem] items-center justify-center border-b border-fine-line font-sans text-[0.74rem] text-muted max-[640px]:[&_p]:px-2 max-[640px]:[&_p]:text-center max-[640px]:[&_p]:text-[0.68rem]",
        )}
      >
        <p className="m-0 tracking-[0.01em]">
          Daily pocket intelligence for better routines
        </p>
      </div>

      <div
        className={cn(
          monoContainer,
          "grid min-h-[5.9rem] grid-cols-[1fr_auto_1fr] items-center max-nav:min-h-0 max-nav:grid-cols-1 max-nav:gap-[0.55rem] max-nav:py-[0.85rem]",
        )}
      >
        <button
          className={cn(navLinkClass, "max-nav:hidden")}
          type="button"
          aria-label="메뉴 열기"
        >
          Menu
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-[0.8rem]"
          aria-label="POKIT 홈"
        >
          <Image
            src="/pokitstory.png"
            alt=""
            width={34}
            height={34}
            priority
            className="size-[2.35rem] rounded-full"
          />
          <span className="font-sans text-[clamp(2.6rem,7vw,5.7rem)] leading-[0.9] font-extrabold tracking-[-0.055em] max-nav:text-[clamp(2rem,12vw,2.75rem)]">
            {site.name}
          </span>
        </Link>
        <div className="flex justify-self-end gap-4 max-nav:justify-self-center max-nav:flex-wrap max-nav:justify-center max-nav:gap-x-4 max-nav:gap-y-[0.65rem]">
          <Link href="/articles" className={navLinkClass}>
            모든 이야기
          </Link>
          <a href="#app" className={navLinkClass}>
            App
          </a>
          <SupportEmailLink className={navLinkClass}>Contact</SupportEmailLink>
        </div>
      </div>

      <nav
        className="overflow-x-auto border-t border-line bg-panel"
        aria-label="카테고리"
      >
        <ul
          className={cn(
            monoContainer,
            "m-0 flex min-h-10 list-none items-center gap-[2.1rem] font-sans text-[0.76rem] font-extrabold tracking-[0.02em] max-[640px]:gap-4 max-[640px]:px-1 max-[640px]:whitespace-nowrap",
          )}
        >
          {categories.map((category) => (
            <li key={category.id}>
              <a href={`#${category.id}`} className="text-ink">
                {category.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
