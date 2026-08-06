import { AdaptiveStackLens } from "@/components/portfolio/hero/adaptive-stack-lens";
import { HeroPromoVideo } from "@/components/portfolio/hero/hero-promo-video";
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
            {/* Desktop/tablet: belief stack + support linked by a left rail.
                Mobile: one compact manifesto paragraph (CSS swaps visibility). */}
            <div className={styles.beliefRail}>
              <div className={styles.beliefRailTrack} aria-hidden="true">
                <span className={styles.beliefRailNode} data-node="start" />
                <span className={styles.beliefRailStem} />
                <span className={styles.beliefRailNode} data-node="join" />
                <span className={styles.beliefRailStem} data-fade="true" />
                <span className={styles.beliefRailNode} data-node="end" />
              </div>
              <div className={styles.beliefRailCopy}>
                <p className={styles.statement}>
                  <span>{ADAPTIVE_HERO_CONTENT.statement[0]}</span>
                  <span>{ADAPTIVE_HERO_CONTENT.statement[1]}</span>
                  <span>
                    and ship what <strong>survives production.</strong>
                  </span>
                </p>
                <p className={styles.support}>{ADAPTIVE_HERO_CONTENT.support}</p>
              </div>
            </div>
            <p className={styles.manifesto}>{ADAPTIVE_HERO_CONTENT.manifesto}</p>
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

          {/* Right column: promo video. The original Adaptive Stack Lens is
              kept mounted (styles + animation untouched) but hidden behind it. */}
          <HeroPromoVideo>
            <AdaptiveStackLens
              modes={lensModes}
              defaultSlug={DEFAULT_ADAPTIVE_STACK_LENS_SLUG}
            />
          </HeroPromoVideo>
        </div>
      </div>
    </section>
  );
}
