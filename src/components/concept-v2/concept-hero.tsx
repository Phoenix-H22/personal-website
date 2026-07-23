import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { Profile } from "@/content/profile";

function ProjectPoster({
  domain,
  eyebrow,
  title,
  metric,
  variant,
}: {
  domain: string;
  eyebrow: string;
  title: string;
  metric: string;
  variant: "commerce" | "city" | "vending";
}) {
  return (
    <article className={`c2-poster c2-poster--${variant}`} data-domain={domain}>
      <p className="c2-poster__eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <p className="c2-poster__metric">{metric}</p>
      <div aria-hidden="true" className="c2-poster__art">
        <span className="c2-poster__shape c2-poster__shape--a" />
        <span className="c2-poster__shape c2-poster__shape--b" />
        <span className="c2-poster__shape c2-poster__shape--c" />
        <span className="c2-poster__pin" style={{ top: "1.4rem", left: "58%" }} />
        <span className="c2-poster__pin" style={{ top: "4.2rem", left: "42%" }} />
      </div>
    </article>
  );
}

export function ConceptHero({ profile }: { profile: Profile }) {
  return (
    <section className="c2-hero">
      <div className="c2-shell c2-hero__grid">
        <div>
          <p className="c2-kicker">Software Engineer · Backend & Product Systems</p>
          <p className="c2-hero__name">{profile.shortName}</p>
          <h1>I build the systems businesses end up depending on.</h1>
          <p className="c2-hero__summary">
            A backend-focused product engineer turning complex operations into
            reliable SaaS, commerce, ERP, IoT, and AI-enabled products.
          </p>
          <div className="c2-actions">
            <a className="c2-button c2-button--primary" href="#work">
              Explore my work
              <ArrowDownRight aria-hidden="true" size={16} />
            </a>
            <a
              className="c2-button c2-button--secondary"
              href="/documents/Abdalrhman_Alkady_Resume.pdf"
              rel="noopener noreferrer"
              target="_blank"
            >
              Download résumé
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </div>
          <div aria-label="Professional links" className="c2-social">
            {profile.socialLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div aria-label="Featured project reel" className="c2-reel">
          <ProjectPoster
            domain="commerce"
            eyebrow="Commerce operations"
            metric="200+ merchants · 20K+ monthly orders"
            title="Merchant Operations / Mohssilh"
            variant="commerce"
          />
          <ProjectPoster
            domain="city-guide"
            eyebrow="Mobile-backed product"
            metric="Multi-platform city guide"
            title="Your Obour Guide"
            variant="city"
          />
          <ProjectPoster
            domain="iot"
            eyebrow="Physical product systems"
            metric="QR → payment → dispense"
            title="Smart Vending"
            variant="vending"
          />
        </div>
      </div>
    </section>
  );
}
