import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

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
          <h2>Sections</h2>
          <ul>
            <li><a href="#affairs">Affairs</a></li>
            <li><a href="#wellness">Wellness</a></li>
            <li><a href="#design">Design</a></li>
            <li><a href="#shop">Shop</a></li>
          </ul>
        </div>
        <div>
          <h2>Information</h2>
          <ul>
            <li><Link href="/privacy">개인정보 처리방침</Link></li>
            <li><Link href="/support">지원</Link></li>
            <li><a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a></li>
          </ul>
        </div>
      </div>
      <p className="site-footer__copy mono-container">
        © {new Date().getFullYear()} {site.name}. Unsplash photography used for editorial mockups.
      </p>
    </footer>
  );
}
