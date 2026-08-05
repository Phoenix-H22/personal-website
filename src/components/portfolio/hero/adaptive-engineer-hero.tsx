import { AdaptiveStackLens } from "@/components/portfolio/hero/adaptive-stack-lens";
import { LivingToolchain } from "@/components/portfolio/hero/living-toolchain";
import { RecruiterBriefSection } from "@/components/portfolio/recruiter/recruiter-brief-section";
import { ADAPTIVE_HERO_CONTENT } from "@/lib/portfolio/adaptive-hero";
import { DEFAULT_ADAPTIVE_STACK_LENS_SLUG } from "@/lib/portfolio/adaptive-stack-lens";
import {
  getAdaptiveStackLensProjects,
  getWorkIndexProjects,
} from "@/lib/portfolio/projects";
import { RECRUITER_PROFILE } from "@/lib/portfolio/recruiter-profile";
import styles from "@/styles/portfolio/adaptive-engineer-hero.module.scss";

export async function AdaptiveEngineerHero() {
  const [projects, lensModes] = await Promise.all([
    getWorkIndexProjects(),
    getAdaptiveStackLensProjects(),
  ]);
  const founderBuiltCount = projects.filter(
    ({ ownershipType }) => ownershipType === "founder-built",
  ).length;
  if (projects.length !== 13 || founderBuiltCount !== 3) {
    throw new Error("Adaptive hero requires verified production evidence");
  }

  return (
    <section
      id="proof-stage"
      className={styles.hero}
      aria-labelledby="adaptive-hero-name"
      data-adaptive-engineer-hero
    >
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.heroShell}>
        <div className={styles.composition}>
          <div className={styles.narrative} data-hero-narrative>
            <p className={styles.eyebrow}>
              <strong>{ADAPTIVE_HERO_CONTENT.identity}</strong>
            </p>
            <h1 id="adaptive-hero-name" className={styles.name}>
              {ADAPTIVE_HERO_CONTENT.name}
            </h1>
            {/* Single unified manifesto paragraph — identical copy on desktop
                and mobile: belief, scope, and AI approach as one flowing thought. */}
            <p className={styles.manifesto}>
              {ADAPTIVE_HERO_CONTENT.manifesto.lead}
              <strong>{ADAPTIVE_HERO_CONTENT.manifesto.accent}</strong>
              {ADAPTIVE_HERO_CONTENT.manifesto.tail}
            </p>
            <LivingToolchain />

            <p className={styles.proofRibbon} data-proof-ribbon>
              <strong>{projects.length} PRODUCTION SYSTEMS</strong>
              <span aria-hidden="true">·</span>
              <strong>{founderBuiltCount} FOUNDER-BUILT PRODUCTS</strong>
              <span aria-hidden="true">·</span>
              <strong>UPWORK TOP RATED — 100% JOB SUCCESS</strong>
            </p>

            <nav className={styles.actions} aria-label="Portfolio actions">
              <a className={styles.primaryAction} href="#work">
                EXPLORE THE SYSTEMS
              </a>
              <RecruiterBriefSection />
              <a className={styles.resumeAction} href={RECRUITER_PROFILE.resume} download>
                Resume <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>

          <AdaptiveStackLens
            modes={lensModes}
            defaultSlug={DEFAULT_ADAPTIVE_STACK_LENS_SLUG}
          />
        </div>
      </div>
    </section>
  );
}
