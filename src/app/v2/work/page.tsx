import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { CASE_STUDY_SLUGS } from "@/lib/portfolio/case-studies";
import { CANONICAL_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";
import { getWorkIndexProjects } from "@/lib/portfolio/projects";
import type {
  PublicOwnershipType,
  PublicProjectStatus,
} from "@/lib/portfolio/projects/types";
import { getSiteUrl } from "@/lib/metadata/site";
import styles from "@/styles/portfolio/systems-ledger.module.scss";

const description =
  "A recruiter-focused ledger of 13 production systems built, owned, integrated, deployed, or operated by Abdalrhman M. Alkady.";

export const metadata: Metadata = {
  title: "Systems Ledger | Backend Systems and Product Engineering",
  description,
  alternates: { canonical: "/v2/work" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Systems Ledger — Abdalrhman M. Alkady",
    description,
    url: "/v2/work",
    images: [{ url: "/opengraph-image", alt: "Abdalrhman M. Alkady Systems Ledger" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Systems Ledger — Abdalrhman M. Alkady",
    description,
    images: ["/opengraph-image"],
  },
};

const ownershipLabels: Record<PublicOwnershipType, string> = {
  "founder-built": "Founder-built",
  "built-entirely": "Built entirely",
  "backend-devops-owner": "Backend + DevOps owner",
  "technical-owner": "Technical owner",
  "lead-developer": "Lead developer",
  "major-contributor": "Major contributor",
};

const statusLabels: Record<PublicProjectStatus, string> = {
  live: "Live",
  "active-development": "Active development",
  completed: "Completed",
  "completed-before-launch": "Completed before launch",
  archived: "Archived",
};

function position(index: number) {
  return String(index + 1).padStart(2, "0");
}

export default async function SystemsLedgerPage() {
  const projects = await getWorkIndexProjects();
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const orderedProjects = CANONICAL_PROJECT_SLUGS.map((slug) => {
    const project = bySlug.get(slug);
    if (!project) throw new Error(`Systems Ledger missing ${slug}`);
    return project;
  });
  const caseStudySlugs = new Set<string>(CASE_STUDY_SLUGS);
  const siteUrl = getSiteUrl();

  return (
    <main id="main-content" className={styles.page}>
      <nav className={styles.topNav} aria-label="Systems Ledger navigation">
        <Link href="/v2" prefetch={false}>AK / Portfolio V2</Link>
        <a href="#systems-ledger">All systems</a>
        <a href="#case-study-spotlight">Case studies</a>
        <a href="#ledger-contact">Contact</a>
      </nav>

      <header className={styles.hero}>
        <p>SYSTEMS LEDGER / 13 CANONICAL BUILDS</p>
        <h1>Systems built to carry real operational weight.</h1>
        <div>
          <p>
            Production platforms, founder-built products, integrations, connected
            hardware, commerce, messaging, and backend-heavy delivery.
          </p>
          <dl>
            <div>
              <dt>13</dt>
              <dd>Canonical systems</dd>
            </div>
            <div>
              <dt>3</dt>
              <dd>Flagship case studies</dd>
            </div>
            <div>
              <dt>7</dt>
              <dd>Featured systems</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className={styles.scan} aria-labelledby="scan-title">
        <p>RECRUITER SCAN</p>
        <h2 id="scan-title">Look for ownership, not framework count.</h2>
        <p>
          Each ledger row identifies the system boundary, role, strongest responsibility,
          verified proof, and whether a deeper case study is available.
        </p>
      </section>

      <section id="systems-ledger" className={styles.ledger} aria-labelledby="ledger-title">
        <header>
          <p>INDEX / EXACT CANONICAL ORDER</p>
          <h2 id="ledger-title">The full system record.</h2>
        </header>
        <div className={styles.entries}>
          {orderedProjects.map((project, index) => {
            const caseStudyAvailable = caseStudySlugs.has(project.slug);
            return (
          <article
            key={project.slug}
            id={project.slug}
            className={styles.entry}
            data-project-slug={project.slug}
          >
                <div className={styles.entryIdentity}>
                  <span>{position(index)}</span>
                  <div>
                    <p>{project.systemType}</p>
                    <h3>{project.title}</h3>
                  </div>
                </div>
                <div className={styles.entryMedia}>
                  <Image
                    src={project.coverCard.src}
                    alt={project.coverCard.alt}
                    width={project.coverCard.width}
                    height={project.coverCard.height}
                    sizes="(max-width: 700px) calc(100vw - 2rem), 22vw"
                    loading="lazy"
                  />
                </div>
                <div className={styles.entryEvaluation}>
                  <dl>
                    <div>
                      <dt>Role</dt>
                      <dd>{project.role}</dd>
                    </div>
                    <div>
                      <dt>Ownership</dt>
                      <dd>{ownershipLabels[project.ownershipType]}</dd>
                    </div>
                    <div>
                      <dt>Strongest responsibility</dt>
                      <dd>{project.strongestCapability}</dd>
                    </div>
                  </dl>
                  {project.strongestMetric ? (
                    <div className={styles.entryProof}>
                      <strong>{project.strongestMetric.value}</strong>
                      <span>{project.strongestMetric.label}</span>
                    </div>
                  ) : null}
                  <ul aria-label={`${project.title} primary technologies`}>
                    {project.technologies.slice(0, 3).map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                  <p className={styles.entryStatus}>{statusLabels[project.status]}</p>
                  <div className={styles.entryActions}>
                    {caseStudyAvailable ? (
                      <Link href={`/v2/work/${project.slug}`} prefetch={false}>
                        Read case study
                      </Link>
                    ) : null}
                    {project.links.website ? (
                      <a href={project.links.website} target="_blank" rel="noreferrer">
                        Visit live product
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.legend} aria-labelledby="legend-title">
        <p>OWNERSHIP LEGEND</p>
        <h2 id="legend-title">Different projects. Explicit responsibility boundaries.</h2>
        <dl>
          <div>
            <dt>Founder-built</dt>
            <dd>Product, architecture, implementation, launch, and operation originated here.</dd>
          </div>
          <div>
            <dt>Built entirely</dt>
            <dd>Complete technical delivery without claiming ownership of the client product.</dd>
          </div>
          <div>
            <dt>Technical ownership</dt>
            <dd>Backend, infrastructure, integrations, or delivery owned within a client system.</dd>
          </div>
        </dl>
      </section>

      <section
        id="case-study-spotlight"
        className={styles.spotlight}
        aria-labelledby="spotlight-title"
      >
        <p>FLAGSHIP CASE STUDIES</p>
        <h2 id="spotlight-title">Three systems. Three senior-level dimensions.</h2>
        <div>
          {CASE_STUDY_SLUGS.map((slug, index) => {
            const project = bySlug.get(slug);
            if (!project) return null;
            return (
              <Link key={slug} href={`/v2/work/${slug}`} prefetch={false}>
                <span>{position(index)}</span>
                <strong>{project.title}</strong>
                <span>{project.strongestCapability}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <footer id="ledger-contact" className={styles.contact}>
        <p>NEED THE ENGINEER BEHIND THE SYSTEM?</p>
        <h2>Let&apos;s talk about the complicated part.</h2>
        <div>
          <a href="mailto:alkady2019@gmail.com">Contact Abdalrhman</a>
          <Link href="/v2" prefetch={false}>Back to Portfolio V2</Link>
        </div>
      </footer>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Systems Ledger",
          description,
          url: new URL("/v2/work", siteUrl).toString(),
          author: { "@type": "Person", name: "Abdalrhman M. Alkady" },
          hasPart: orderedProjects.map((project) => ({
            "@type": "CreativeWork",
            name: project.title,
            url: caseStudySlugs.has(project.slug)
              ? new URL(`/v2/work/${project.slug}`, siteUrl).toString()
              : new URL(`/v2/work#${project.slug}`, siteUrl).toString(),
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Portfolio V2",
              item: new URL("/v2", siteUrl).toString(),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Systems Ledger",
              item: new URL("/v2/work", siteUrl).toString(),
            },
          ],
        }}
      />
    </main>
  );
}
