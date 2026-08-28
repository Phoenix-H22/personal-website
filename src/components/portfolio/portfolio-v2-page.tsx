import { CareerChapter } from "@/components/concept-v3-rebuild/career/career-chapter";
import { OriginChapter } from "@/components/concept-v3-rebuild/origin/origin-chapter";
import { LayoutModeProvider } from "@/components/concept-v3-rebuild/shared/layout-mode-provider";
import { ContactSignalHub } from "@/components/portfolio/contact/contact-signal-hub";
import { AdaptiveEngineerHero } from "@/components/portfolio/hero/adaptive-engineer-hero";
import { PortfolioNavigation } from "@/components/portfolio/navigation/portfolio-navigation";
import { RecruiterCompletionSections } from "@/components/portfolio/recruiter/recruiter-completion-sections";
import { SystemsObservatorySection } from "@/components/portfolio/systems-observatory/systems-observatory-section";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getCareerTrajectoryEras,
  getCareerTrajectoryIndependent,
  getCareerTrajectoryPrimary,
  getEducation,
} from "@/lib/content";
import { getSiteUrl } from "@/lib/metadata/site";
import { MotionPreferenceProvider } from "@/lib/motion-preference-context";
import { RECRUITER_PROFILE } from "@/lib/portfolio/recruiter-profile";
import styles from "@/styles/portfolio/adaptive-engineer-hero.module.scss";
import navigationStyles from "@/styles/portfolio/portfolio-navigation.module.scss";
import "@/styles/concept-v3-rebuild/responsive-tokens.scss";

export function PortfolioV2Page() {
  const education = getEducation();
  const eras = getCareerTrajectoryEras();
  const primary = getCareerTrajectoryPrimary();
  const independent = getCareerTrajectoryIndependent();

  return (
    <MotionPreferenceProvider>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var w=window.innerWidth,h=window.innerHeight,vv=window.visualViewport;if(vv){w=Math.round(vv.width);h=Math.round(vv.height);}var m;if(w<768)m='mobile';else if(w>=1050&&h<680)m='short-landscape';else if(w>=1400&&h>=760)m='spacious-desktop';else if(w>=1080&&h>=680)m='standard-desktop';else if(w>=768&&h>=w)m='portrait-tablet';else m='medium-landscape';document.documentElement.dataset.layoutMode=m;}catch(e){}})();",
        }}
      />
      <LayoutModeProvider>
        <div className={styles.page} data-portfolio-variant="v2">
          <PortfolioNavigation />
          <main id="main-content" className={navigationStyles.pageMain}>
            <AdaptiveEngineerHero />
            <CareerChapter
              eras={eras}
              primary={primary}
              independent={independent}
            />
            <OriginChapter education={education} />
            <SystemsObservatorySection />
            <RecruiterCompletionSections />
            <ContactSignalHub />
          </main>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Person",
              name: RECRUITER_PROFILE.name,
              url: new URL("/", getSiteUrl()).toString(),
              email: `mailto:${RECRUITER_PROFILE.email}`,
              jobTitle: "Software Engineer",
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
        </div>
      </LayoutModeProvider>
    </MotionPreferenceProvider>
  );
}
