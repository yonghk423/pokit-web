import Image from "next/image";
import Link from "next/link";
import { SupportEmailLink } from "@/components/support-email-link";
import { site } from "@/config/site";
import { categories } from "@/content/home";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="mono-container site-footer__grid">
        <div className="site-footer__brand">
          <Image src="/pokitstory.png" alt="" width={44} height={44} />
          <div>
            <p className="site-footer__logo">{site.name}</p>
            <p>Global affairs for your body, desk and day.</p>
          </div>
        </div>
        <div>
          <h2>섹션</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <a href={`#${category.id}`}>{category.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Information</h2>
          <ul>
            <li><Link href="/articles">모든 이야기</Link></li>
            <li><Link href="/privacy">개인정보 처리방침</Link></li>
            <li><Link href="/support">지원</Link></li>
            <li>
              <SupportEmailLink className="site-footer__email-link">
                {site.supportEmail}
              </SupportEmailLink>
            </li>
          </ul>
        </div>
      </div>
      <p className="site-footer__copy mono-container">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
