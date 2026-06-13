import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { categories } from "@/content/home";

export function SiteHeader() {
  return (
    <header className="masthead">
      <div className="masthead__utility mono-container">
        <nav className="masthead__utility-left" aria-label="서비스 메뉴">
          <a href={site.appStoreUrl}>Subscribe</a>
          <span aria-hidden="true">|</span>
          <Link href="/support">Log in</Link>
        </nav>
        <p>Daily pocket intelligence for better routines</p>
      </div>

      <div className="masthead__brand mono-container">
        <button className="masthead__menu" type="button" aria-label="메뉴 열기">
          Menu
        </button>
        <Link href="/" className="masthead__logo" aria-label="POKIT 홈">
          <Image src="/pokitstory.png" alt="" width={34} height={34} priority />
          <span>{site.name}</span>
        </Link>
        <div className="masthead__actions">
          <a href="#app">App</a>
          <a href={`mailto:${site.supportEmail}`}>Contact</a>
        </div>
      </div>

      <nav className="section-nav" aria-label="카테고리">
        <ul className="section-nav__list mono-container">
          {categories.map((category) => (
            <li key={category.id}>
              <a href={`#${category.id}`}>{category.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
