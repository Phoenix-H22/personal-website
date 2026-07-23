import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import type { Profile } from "@/content/profile";

export function SiteHeader({ profile }: { profile: Profile }) {
  return (
    <header className="site-header">
      <div className="page-shell site-header__inner">
        <Link
          aria-label={`${profile.shortName}, home`}
          className="brand-link"
          href="/"
        >
          <BrandMark />
          <span className="brand-name">{profile.shortName}</span>
        </Link>

        <nav aria-label="Primary navigation" className="site-nav">
          <a href="#selected-work">Selected work</a>
          <a href="#proof">Proof</a>
          <a className="nav-contact" href="#contact">
            Start a conversation
          </a>
        </nav>
      </div>
    </header>
  );
}
