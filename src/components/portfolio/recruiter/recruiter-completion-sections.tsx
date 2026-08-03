import Link from "next/link";

import { RECRUITER_PROFILE } from "@/lib/portfolio/recruiter-profile";
import styles from "@/styles/portfolio/recruiter-experience.module.scss";

const principles = [
  {
    index: "01",
    title: "Design the failure path first",
    body: "Retries, duplicates, unavailable services, and partial success belong in the architecture before launch.",
    projects: [
      { label: "Autopay EG", href: "/v2/work/autopay-eg" },
      { label: "Warqah Store", href: "/v2/work/warqah-store" },
    ],
  },
  {
    index: "02",
    title: "Keep uncertainty at the boundary",
    body: "External payments, devices, APIs, and webhooks should never be allowed to corrupt deterministic product state.",
    projects: [
      { label: "Smart Lockers", href: "/v2/work/smart-lockers-platform" },
      { label: "Autopay EG", href: "/v2/work/autopay-eg" },
    ],
  },
  {
    index: "03",
    title: "Build the reusable system, not the one-off integration",
    body: "When the next client, device, or channel arrives, the architecture should already have a place for it.",
    projects: [
      { label: "Smart Lockers", href: "/v2/work/smart-lockers-platform" },
      { label: "NABD", href: "/v2/work#nabd" },
    ],
  },
] as const;

export function RecruiterCompletionSections() {
  return (
    <>
      <section
        id="principles"
        className={styles.principles}
        aria-labelledby="principles-title"
      >
        <header>
          <p>ENGINEERING PRINCIPLES / PRODUCTION</p>
          <h2 id="principles-title">How I engineer systems that survive production.</h2>
        </header>
        <div className={styles.principleList}>
          {principles.map((principle) => (
            <article key={principle.index}>
              <span>{principle.index}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
                <nav aria-label={`${principle.title} evidence`}>
                  {principle.projects.map((project) => (
                    <Link key={project.href} href={project.href} prefetch={false}>
                      {project.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.socialProof} aria-labelledby="social-proof-title">
        <div>
          <p>VERIFIED INDEPENDENT DELIVERY</p>
          <h2 id="social-proof-title">Top Rated. 100% Job Success Score.</h2>
          <p>
            Verified Upwork credential paired with production systems spanning commerce,
            messaging, connected hardware, payments, and founder-built products.
          </p>
          <a href={RECRUITER_PROFILE.upwork} target="_blank" rel="noreferrer">
            View verified Upwork profile
          </a>
        </div>
        <dl>
          <div>
            <dt>EGP 21M+</dt>
            <dd>Verified Warqah Store sales</dd>
          </div>
          <div>
            <dt>100K+</dt>
            <dd>Verified Warqah Store orders</dd>
          </div>
          <div>
            <dt>5,000+</dt>
            <dd>NABD messages processed weekly</dd>
          </div>
        </dl>
      </section>

      <section id="contact" className={styles.contact} aria-labelledby="contact-title">
        <div>
          <p>RECRUITER / ENGINEERING LEAD / FOUNDER</p>
          <h2 id="contact-title">Need someone who can own the system, not just the ticket?</h2>
          <p>
            I am targeting senior backend and backend-focused full-stack roles where
            architecture, integrations, deployment, and production ownership matter.
          </p>
        </div>
        <div className={styles.contactMeta}>
          <p>{RECRUITER_PROFILE.location}</p>
          <p>{RECRUITER_PROFILE.availability}</p>
          <p>{RECRUITER_PROFILE.relocation}</p>
        </div>
        <nav className={styles.contactActions} aria-label="Contact and profile actions">
          <a className={styles.contactPrimary} href={`mailto:${RECRUITER_PROFILE.email}`}>
            Let&apos;s Talk
          </a>
          <a href={RECRUITER_PROFILE.resume} download>
            Download Resume
          </a>
          <a href={RECRUITER_PROFILE.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={RECRUITER_PROFILE.upwork} target="_blank" rel="noreferrer">
            Upwork
          </a>
        </nav>
      </section>
    </>
  );
}
