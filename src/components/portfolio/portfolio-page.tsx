import { RebuildHero } from "@/components/concept-v3-rebuild/hero/rebuild-hero";
import { RebuildNav } from "@/components/concept-v3-rebuild/navigation/rebuild-nav";
import { OriginChapter } from "@/components/concept-v3-rebuild/origin/origin-chapter";
import { CareerChapter } from "@/components/concept-v3-rebuild/career/career-chapter";
import { LayoutModeProvider } from "@/components/concept-v3-rebuild/shared/layout-mode-provider";
import { LayoutDebugPanel } from "@/components/concept-v3-rebuild/shared/layout-debug-panel";
import { PortfolioVersionSwitchGate } from "@/components/portfolio/portfolio-version-switch-gate";
import { RecruiterBriefSection } from "@/components/portfolio/recruiter/recruiter-brief-section";
import { RecruiterCompletionSections } from "@/components/portfolio/recruiter/recruiter-completion-sections";
import { SelectedSystemsSection } from "@/components/portfolio/selected-systems/selected-systems-section";
import { SystemsObservatorySection } from "@/components/portfolio/systems-observatory/systems-observatory-section";
import { JsonLd } from "@/components/seo/json-ld";
import { MotionPreferenceProvider } from "@/lib/motion-preference-context";
import { getSiteUrl } from "@/lib/metadata/site";
import { getProofEngineHero } from "@/lib/proof-engine/selectors";
import { RECRUITER_PROFILE } from "@/lib/portfolio/recruiter-profile";
import {
  getEducation,
  getCareerTrajectoryEras,
  getCareerTrajectoryPrimary,
  getCareerTrajectoryIndependent,
} from "@/lib/content";
import type { PortfolioVariantConfig } from "@/lib/portfolio/portfolio-variant";
import styles from "@/styles/concept-v3-rebuild/hero.module.scss";
import "@/styles/concept-v3-rebuild/responsive-tokens.scss";

interface PortfolioPageProps {
  config: PortfolioVariantConfig;
}

const v2NavigationLinks = [
  { href: "#recruiter-brief", label: "Recruiter Brief" },
  { href: "/projects", label: "Systems Ledger" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact Us" },
] as const;

/**
 * Shared portfolio shell for `/` (current) and `/v2`.
 * Variant differences are driven only by the typed `config` — never by pathname checks.
 */
export function PortfolioPage({ config }: PortfolioPageProps) {
  const content = getProofEngineHero();
  const education = getEducation();
  const eras = getCareerTrajectoryEras();
  const primary = getCareerTrajectoryPrimary();
  const independent = getCareerTrajectoryIndependent();

  return (
    <MotionPreferenceProvider>
      {/* Pre-hydration layout-mode resolver: sets data-layout-mode synchronously
          so token-driven sections (Origin/Career) never flash. Hero structure
          itself is media-query driven and needs no JS to be correct on first
          paint. Mirrors resolveLayoutMode() in layout-mode.ts. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var w=window.innerWidth,h=window.innerHeight,vv=window.visualViewport;if(vv){w=Math.round(vv.width);h=Math.round(vv.height);}var m;if(w<768)m='mobile';else if(w>=1050&&h<680)m='short-landscape';else if(w>=1400&&h>=760)m='spacious-desktop';else if(w>=1080&&h>=680)m='standard-desktop';else if(w>=768&&h>=w)m='portrait-tablet';else m='medium-landscape';document.documentElement.dataset.layoutMode=m;}catch(e){}})();",
        }}
      />
      <LayoutModeProvider>
        <div
          className={styles.rebuild}
          data-concept-rebuild
          data-portfolio-variant={config.id}
        >
          <RebuildNav
            homeHref="/"
            links={config.id === "v2" ? v2NavigationLinks : undefined}
          />
          <main id="main-content" className={styles.main}>
            <RebuildHero content={content} heroConfig={config.hero} />
            {config.sections.showOwnership ? <RecruiterBriefSection /> : null}
            {config.sections.showCareer ? (
              <CareerChapter
                eras={eras}
                primary={primary}
                independent={independent}
              />
            ) : null}
            {config.sections.showOrigin ? (
              <OriginChapter education={education} />
            ) : null}
            {config.sections.showSelectedSystems ? (
              <SelectedSystemsSection />
            ) : null}
            {config.sections.showSystemsExhibition ? (
              <SystemsObservatorySection />
            ) : null}
            {config.sections.showContact ? <RecruiterCompletionSections /> : null}
          </main>
          <LayoutDebugPanel />
          <PortfolioVersionSwitchGate active={config.id} />
          {config.id === "v2" ? (
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "Person",
                name: RECRUITER_PROFILE.name,
                url: new URL("/", getSiteUrl()).toString(),
                email: `mailto:${RECRUITER_PROFILE.email}`,
                jobTitle: RECRUITER_PROFILE.targetRoles[0],
                sameAs: [
                  RECRUITER_PROFILE.linkedin,
                  RECRUITER_PROFILE.github,
                  RECRUITER_PROFILE.upwork,
                ],
                knowsAbout: [
                  "Backend systems",
                  "APIs and integrations",
                  "Commerce platforms",
                  "Connected hardware",
                  "Production operations",
                ],
              }}
            />
          ) : null}
        </div>
      </LayoutModeProvider>
    </MotionPreferenceProvider>
  );
}
