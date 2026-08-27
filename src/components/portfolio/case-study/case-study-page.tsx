import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyArchitectureDialog } from "@/components/portfolio/case-study/case-study-architecture-dialog";
import { JsonLd } from "@/components/seo/json-ld";
import {
  CASE_STUDY_PRESENTATION,
  CASE_STUDY_SLUGS,
  type CaseStudySlug,
} from "@/lib/portfolio/case-studies";
import { buildProjectPageMetadata, getProjectJsonLd } from "@/lib/metadata/projects";
import { getProjectBySlug } from "@/lib/portfolio/projects";
import { getSiteUrl } from "@/lib/metadata/site";
import styles from "@/styles/portfolio/case-study.module.scss";

function caseStudyPosition(slug: CaseStudySlug) {
  return CASE_STUDY_SLUGS.indexOf(slug) + 1;
}

export async function getCaseStudyMetadata(slug: CaseStudySlug): Promise<Metadata> {
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildProjectPageMetadata(project);
}

export async function CaseStudyPage({ slug }: { slug: CaseStudySlug }) {
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const presentation = CASE_STUDY_PRESENTATION[slug];
  const evidenceGallery = project.gallery.filter(
    ({ role }) => role !== "cover" && role !== "architecture",
  );
  const index = caseStudyPosition(slug);
  const previousSlug = CASE_STUDY_SLUGS[(index - 2 + CASE_STUDY_SLUGS.length) % CASE_STUDY_SLUGS.length];
  const nextSlug = CASE_STUDY_SLUGS[index % CASE_STUDY_SLUGS.length];
  const [previousProject, nextProject] = await Promise.all([
    getProjectBySlug(previousSlug),
    getProjectBySlug(nextSlug),
  ]);
  if (!previousProject || !nextProject) {
    throw new Error("Case-study navigation requires all approved projects");
  }
  const siteUrl = getSiteUrl();

  return (
    <main
      id="main-content"
      className={styles.page}
      data-case-study={slug}
      data-accent={presentation.accent}
    >
      <nav className={styles.topNav} aria-label="Case study navigation">
        <Link href="/" prefetch={false}>AK / Home</Link>
        <Link href="/projects" prefetch={false}>Projects</Link>
        <a href="#architecture">Architecture</a>
        <a href="#evidence">Evidence</a>
      </nav>

      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <ol>
          <li><Link href="/" prefetch={false}>Home</Link></li>
          <li><Link href="/projects" prefetch={false}>Projects</Link></li>
          <li aria-current="page">{project.title}</li>
        </ol>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p>
            CASE STUDY {String(index).padStart(2, "0")} / {String(CASE_STUDY_SLUGS.length).padStart(2, "0")}
          </p>
          <h1>{project.title}</h1>
          <p className={styles.heroSummary}>{presentation.recruiterSummary}</p>
          <dl className={styles.recruiterSummary} aria-label="Recruiter summary">
            <div>
              <dt>System</dt>
              <dd>{project.systemType}</dd>
            </div>
            <div>
              <dt>Ownership</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Technical difficulty</dt>
              <dd>{project.strongestCapability}</dd>
            </div>
            <div>
              <dt>Production proof</dt>
              <dd>
                {project.verifiedMetrics.map((metric) => `${metric.value} ${metric.label}`).join(" · ")}
              </dd>
            </div>
          </dl>
        </div>
        <figure className={styles.heroMedia}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes="(max-width: 900px) calc(100vw - 2rem), 50vw"
            priority
          />
          <figcaption>{project.shortTagline}</figcaption>
        </figure>
      </header>

      <section className={styles.narrativeSection} aria-labelledby="situation-title">
        <div className={styles.sectionLabel}>01 / SITUATION</div>
        <div>
          <h2 id="situation-title">The operating context.</h2>
          <p>{presentation.situation}</p>
          {project.publicSummary.split("\n").filter(Boolean).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className={styles.narrativeSection} aria-labelledby="ownership-title">
        <div className={styles.sectionLabel}>02 / OWNERSHIP BOUNDARY</div>
        <div>
          <h2 id="ownership-title">What I owned, explicitly.</h2>
          <dl className={styles.ownershipGrid}>
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Ownership model</dt><dd>{project.ownershipType.replaceAll("-", " ")}</dd></div>
            <div><dt>Responsibility boundary</dt><dd>{project.strongestCapability}</dd></div>
            <div><dt>Project status</dt><dd>{project.status.replaceAll("-", " ")}</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.narrativeSection} aria-labelledby="constraints-title">
        <div className={styles.sectionLabel}>03 / CONSTRAINTS</div>
        <div>
          <h2 id="constraints-title">What made the system difficult.</h2>
          <ul className={styles.constraintList}>
            {presentation.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}
          </ul>
        </div>
      </section>

      <section className={styles.decisions} aria-labelledby="decisions-title">
        <header>
          <p>04 / SYSTEM DECISIONS</p>
          <h2 id="decisions-title">Boundaries chosen for a reason.</h2>
        </header>
        <div>
          {presentation.decisions.map((decision, decisionIndex) => (
            <article key={decision.heading}>
              <span>{String(decisionIndex + 1).padStart(2, "0")}</span>
              <h3>{decision.heading}</h3>
              <dl>
                <div><dt>Problem</dt><dd>{decision.problem}</dd></div>
                <div><dt>Boundary</dt><dd>{decision.boundary}</dd></div>
                <div><dt>Why it mattered</dt><dd>{decision.effect}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.failurePaths} aria-labelledby="failure-title">
        <div className={styles.sectionLabel}>05 / FAILURE PATHS</div>
        <div>
          <h2 id="failure-title">Failure belongs in the architecture.</h2>
          <ol>
            {presentation.failurePaths.map((failure) => <li key={failure}>{failure}</li>)}
          </ol>
        </div>
      </section>

      {project.architectureDiagram ? (
        <section id="architecture" className={styles.architecture} aria-labelledby="architecture-title">
          <header>
            <p>06 / SYSTEM ANATOMY</p>
            <h2 id="architecture-title">Read the boundaries before the components.</h2>
          </header>
          <figure>
            <Image
              src={project.architectureDiagram.src}
              alt={project.architectureDiagram.alt}
              width={project.architectureDiagram.width}
              height={project.architectureDiagram.height}
              sizes="(max-width: 900px) calc(100vw - 2rem), 88vw"
              loading="lazy"
            />
            <figcaption>{presentation.architectureCaption}</figcaption>
          </figure>
          <CaseStudyArchitectureDialog
            asset={project.architectureDiagram}
            projectTitle={project.title}
          />
        </section>
      ) : null}

      <section id="evidence" className={styles.evidence} aria-labelledby="evidence-title">
        <header>
          <p>07 / PRODUCTION EVIDENCE</p>
          <h2 id="evidence-title">Only the proof the public record supports.</h2>
        </header>
        <dl className={styles.metrics}>
          {project.verifiedMetrics.map((metric) => (
            <div key={`${metric.value}-${metric.label}`}>
              <dt>{metric.value}</dt>
              <dd>{metric.label}</dd>
              {metric.context ? <dd>{metric.context}</dd> : null}
            </div>
          ))}
        </dl>
        {evidenceGallery.length > 0 ? (
          <div className={styles.gallery}>
            {evidenceGallery.map((asset) => (
              <figure key={asset.src}>
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  width={asset.width}
                  height={asset.height}
                  sizes="(max-width: 700px) calc(100vw - 2rem), 45vw"
                  loading="lazy"
                />
                <figcaption>{asset.caption ?? asset.alt}</figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </section>

      <section className={styles.outcome} aria-labelledby="outcome-title">
        <div className={styles.sectionLabel}>08 / WHAT CHANGED</div>
        <div>
          <h2 id="outcome-title">The capability left behind.</h2>
          <p>{presentation.outcome}</p>
        </div>
      </section>

      <section className={styles.stack} aria-labelledby="stack-title">
        <header>
          <p>09 / TECHNICAL STACK</p>
          <h2 id="stack-title">Technology with a job to do.</h2>
        </header>
        <dl>
          {project.technologies.map((technology) => (
            <div key={technology}>
              <dt>{technology}</dt>
              <dd>{presentation.technologyRoles[technology] ?? "Supporting production technology."}</dd>
            </div>
          ))}
        </dl>
      </section>

      <nav className={styles.projectNavigation} aria-label="Case study sequence">
        <Link href={`/projects/${previousSlug}`} prefetch={false}>
          <span>Previous case study</span>
          <strong>{previousProject.title}</strong>
        </Link>
        <Link href="/projects" prefetch={false}>Back to Systems Ledger</Link>
        <Link href={`/projects/${nextSlug}`} prefetch={false}>
          <span>Next case study</span>
          <strong>{nextProject.title}</strong>
        </Link>
      </nav>

      <JsonLd data={getProjectJsonLd(project, siteUrl)} />
    </main>
  );
}
