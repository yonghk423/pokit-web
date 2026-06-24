import Image from "next/image";
import Link from "next/link";

import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";
import { categories } from "@/content/home";
import { cn, monoContainer } from "@/lib/cn";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t-2 border-line bg-panel py-8 font-sans">
      <div
        className={cn(
          monoContainer,
          "grid grid-cols-[2fr_1fr_1fr] gap-8 max-nav:grid-cols-1",
        )}
      >
        <div className="flex items-start gap-[0.85rem]">
          <Image
            src="/pokitstory.png"
            alt=""
            width={44}
            height={44}
            className="rounded-full"
          />
          <div>
            <p className="m-0 font-black tracking-[0.1em] text-ink!">
              {site.name}
            </p>
            <p className="m-0 text-[0.82rem] text-muted">
              Global affairs for your body, desk and day.
            </p>
          </div>
        </div>
        <div>
          <h2 className="m-0 mb-[0.7rem] text-[0.76rem] font-black tracking-[0.1em] text-ink uppercase">
            섹션
          </h2>
          <ul className="m-0 grid list-none gap-[0.35rem] p-0">
            {categories.map((category) => (
              <li key={category.id}>
                <a href={`#${category.id}`} className="text-[0.82rem] text-muted">
                  {category.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="m-0 mb-[0.7rem] text-[0.76rem] font-black tracking-[0.1em] text-ink uppercase">
            Information
          </h2>
          <ul className="m-0 grid list-none gap-[0.35rem] p-0">
            <li>
              <Link href="/articles" className="text-[0.82rem] text-muted">
                모든 이야기
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-[0.82rem] text-muted">
                개인정보 처리방침
              </Link>
            </li>
            <li>
              <Link href="/support" className="text-[0.82rem] text-muted">
                지원
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
          "mt-6 border-t border-fine-line pt-4 text-[0.82rem] text-muted",
        )}
      >
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
