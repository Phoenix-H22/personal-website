import { ArrowUpRight } from "lucide-react";

import type { Profile } from "@/content/profile";

export function ContactCta({ profile }: { profile: Profile }) {
  return (
    <section aria-labelledby="contact-title" className="contact-cta" id="contact">
      <div className="page-shell contact-cta__layout">
        <div>
          <p className="technical-label">The next system</p>
          <h2 id="contact-title">Bring me the part everyone calls complicated.</h2>
        </div>

        <div className="contact-cta__aside">
          <p>
            Open to senior backend and product engineering roles, SaaS work,
            complex integrations, and selected freelance collaborations.
          </p>
          <div aria-label="Contact options" className="contact-links">
            {profile.socialLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
                <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
