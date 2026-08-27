import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrbitNav } from "@/components/portfolio/projects-orbit/orbit-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { getProjectJsonLd } from "@/lib/metadata/projects";
import { getSiteUrl } from "@/lib/metadata/site";
import { getProjectBySlug } from "@/lib/portfolio/projects";
import type { CanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";
import { resolveDossier } from "@/lib/portfolio/projects/orbit-dossiers";
import {
  getOrbitSystemBySlug,
  ORBIT_SYSTEMS,
  statusTone,
  systemArchitecture,
} from "@/lib/portfolio/projects/orbit-systems";
import { projectPath } from "@/lib/portfolio/projects/project-routes";
import styles from "@/styles/portfolio/project-page.module.scss";

function adjacentSlugs(slug: CanonicalProjectSlug) {
  const index = ORBIT_SYSTEMS.findIndex((system) => system.slug === slug);
  const previous = ORBIT_SYSTEMS[(index - 1 + ORBIT_SYSTEMS.length) % ORBIT_SYSTEMS.length];
  const next = ORBIT_SYSTEMS[(index + 1) % ORBIT_SYSTEMS.length];
  return { previous, next };
}

export async function ProjectDossierPage({ slug }: { slug: CanonicalProjectSlug }) {
  const project = await getProjectBySlug(slug);
  const system = getOrbitSystemBySlug(slug);
  if (!project || !system) notFound();

  const dossier = resolveDossier(system);
  const tone = statusTone(system.status);
  const { previous, next } = adjacentSlugs(slug);
  const siteUrl = getSiteUrl();
  const summaryParagraphs = project.publicSummary.split("\n").map((part) => part.trim()).filter(Boolean);

  return (
    <main id="main-content" className={styles.page}>
      <OrbitNav />

      <div className={styles.shell}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/" prefetch={false}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/projects" prefetch={false}>
                Projects
              </Link>
            </li>
            <li aria-current="page">{project.title}</li>
          </ol>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>
              <span>{system.systemType}</span>
              <span
                className={styles.statusDot}
                data-tone={tone}
                data-founder={system.ownership === "Founder-built"}
                aria-hidden="true"
              />
              <span>{system.status}</span>
            </p>
            <h1>
              {project.title}
              <span className={styles.titleDot} aria-hidden="true">
                .
              </span>
            </h1>
            {dossier.tagline ? <p className={styles.tagline}>{dossier.tagline}</p> : null}
            <dl className={styles.meta}>
              <div>
                <dt>Role</dt>
                <dd>{dossier.role}</dd>
              </div>
              {dossier.shipped ? (
                <div>
                  <dt>Shipped</dt>
                  <dd>{dossier.shipped}</dd>
                </div>
              ) : null}
              <div>
                <dt>Stack</dt>
                <dd>{dossier.stackLine}</dd>
              </div>
            </dl>
          </div>

          <figure className={styles.heroMedia}>
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              sizes="(max-width: 64rem) calc(100vw - 2rem), 36rem"
              priority
            />
            {project.shortTagline ? <figcaption>{project.shortTagline}</figcaption> : null}
          </figure>
        </header>

        {summaryParagraphs.length > 0 ? (
          <section className={styles.prose} aria-labelledby="summary-title">
            <p className={styles.sectionLabel}>Overview</p>
            <h2 id="summary-title">What this system is.</h2>
            {summaryParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ) : null}

        {dossier.challenge ? (
          <section className={styles.prose} aria-labelledby="challenge-title">
            <p className={styles.sectionLabel}>The challenge</p>
            <h2 id="challenge-title">The problem the system had to hold.</h2>
            <p>{dossier.challenge}</p>
          </section>
        ) : null}

        <section className={styles.split} aria-labelledby="built-title">
          <div className={styles.prose}>
            <p className={styles.sectionLabel}>What I built</p>
            <h2 id="built-title">The production shape of the work.</h2>
            <p>{dossier.whatIBuilt}</p>
          </div>
          {dossier.numbers.length > 0 ? (
            <aside className={styles.numbers} aria-label="By the numbers">
              <p className={styles.sectionLabel}>By the numbers</p>
              <ul>
                {dossier.numbers.slice(0, 3).map((number) => (
                  <li key={`${number.label}-${number.value}`}>
                    <span>{number.value}</span>
                    <span>{number.label}</span>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </section>

        {dossier.mechanics.length > 0 ? (
          <section className={styles.mechanics} aria-labelledby="mechanics-title">
            <p className={styles.sectionLabel}>How it works</p>
            <h2 id="mechanics-title">What actually makes the system hold.</h2>
            <ol>
              {dossier.mechanics.map((mechanic) => (
                <li key={mechanic.code}>
                  <p className={styles.mechanicCode}>{mechanic.code}</p>
                  <h3>{mechanic.title}</h3>
                  <p>{mechanic.front}</p>
                  <p>{mechanic.how}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {project.architectureDiagram ? (
          <section className={styles.architecture} aria-labelledby="architecture-title">
            <p className={styles.sectionLabel}>Architecture</p>
            <h2 id="architecture-title">Public system anatomy.</h2>
            <figure>
              <Image
                src={project.architectureDiagram.src}
                alt={project.architectureDiagram.alt}
                width={project.architectureDiagram.width}
                height={project.architectureDiagram.height}
                sizes="(max-width: 64rem) calc(100vw - 2rem), 70rem"
                loading="lazy"
              />
            </figure>
          </section>
        ) : system.hasArchitecture ? (
          <section className={styles.architecture} aria-labelledby="architecture-title">
            <p className={styles.sectionLabel}>Architecture</p>
            <h2 id="architecture-title">Public system anatomy.</h2>
            <figure>
              <Image
                src={systemArchitecture(system.slug)}
                alt={`${system.name} architecture diagram`}
                width={1600}
                height={900}
                sizes="(max-width: 64rem) calc(100vw - 2rem), 70rem"
                loading="lazy"
              />
            </figure>
          </section>
        ) : null}

        {project.verifiedMetrics.length > 0 ? (
          <section className={styles.metrics} aria-labelledby="proof-title">
            <p className={styles.sectionLabel}>Production proof</p>
            <h2 id="proof-title">Only the numbers the public record supports.</h2>
            <dl>
              {project.verifiedMetrics.map((metric) => (
                <div key={`${metric.value}-${metric.label}`}>
                  <dt>{metric.value}</dt>
                  <dd>{metric.label}</dd>
                  {metric.context ? <dd>{metric.context}</dd> : null}
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section className={styles.stack} aria-labelledby="stack-title">
          <p className={styles.sectionLabel}>Stack</p>
          <h2 id="stack-title">Technology with a job to do.</h2>
          <ul>
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </section>

        <div className={styles.actions}>
          {system.website ? (
            <a
              className={styles.live}
              href={`https://${system.website}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open live ↗
            </a>
          ) : null}
          <Link className={styles.mapLink} href="/projects" prefetch={false}>
            View on the systems map
          </Link>
        </div>

        <nav className={styles.sequence} aria-label="Project sequence">
          <Link href={projectPath(previous.slug)} prefetch={false}>
            <span>Previous</span>
            <strong>{previous.name}</strong>
          </Link>
          <Link href="/projects" prefetch={false}>
            All projects
          </Link>
          <Link href={projectPath(next.slug)} prefetch={false}>
            <span>Next</span>
            <strong>{next.name}</strong>
          </Link>
        </nav>
      </div>

      <JsonLd data={getProjectJsonLd(project, siteUrl)} />
    </main>
  );
}
