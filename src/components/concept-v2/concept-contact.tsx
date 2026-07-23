import { ArrowUpRight } from "lucide-react";

import type { Profile } from "@/content/profile";

export function ConceptContact({ profile }: { profile: Profile }) {
  return (
    <section className="c2-contact" id="contact">
      <div className="c2-shell c2-contact__inner">
        <div>
          <p className="c2-kicker" style={{ color: "rgba(255,255,255,0.85)" }}>
            Next conversation
          </p>
          <h2>Bring me the part everyone calls complicated.</h2>
        </div>
        <div>
          <p>
            Open to senior backend and product engineering roles, SaaS platforms,
            complex integrations, and selected collaborations.
          </p>
          {profile.availability.isAvailable ? (
            <p style={{ marginTop: "0.85rem" }}>{profile.availability.label}</p>
          ) : null}
          <div className="c2-actions">
            <a className="c2-button c2-button--secondary" href="mailto:alkady2019@gmail.com">
              Start a conversation
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            {profile.socialLinks
              .filter((link) => link.label !== "Email")
              .map((link) => (
                <a className="c2-button c2-button--secondary" href={link.href} key={link.label}>
                  {link.label}
                </a>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
