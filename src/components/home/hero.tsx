import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { SystemMap } from "@/components/home/system-map";
import type { Profile } from "@/content/profile";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section aria-labelledby="hero-title" className="hero">
      <div className="page-shell hero__layout">
        <div className="hero__copy">
          <p className="eyebrow">{profile.role}</p>
          <h1 id="hero-title">
            Most people see the product.{" "}
            <span>I build what makes it work.</span>
          </h1>
          <p className="hero__summary">{profile.summary}</p>

          <div className="hero__actions">
            <a className="button button--primary" href="#selected-work">
              Explore the systems
              <ArrowDownRight aria-hidden="true" size={16} />
            </a>
            <a className="button button--secondary" href="#contact">
              Start a conversation
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </div>

          <div className="hero__meta">
            {profile.availability.isAvailable && (
              <span className="availability">{profile.availability.label}</span>
            )}
            <span>{profile.location}</span>
            <span>{profile.mobility}</span>
          </div>
        </div>

        <SystemMap />
      </div>
    </section>
  );
}
