import type { Metadata } from "next";

import { RebuildHero } from "@/components/concept-v3-rebuild/hero/rebuild-hero";
import { RebuildNav } from "@/components/concept-v3-rebuild/navigation/rebuild-nav";
import { OriginChapter } from "@/components/concept-v3-rebuild/origin/origin-chapter";
import { CareerChapter } from "@/components/concept-v3-rebuild/career/career-chapter";
import { LayoutModeProvider } from "@/components/concept-v3-rebuild/shared/layout-mode-provider";
import { LayoutDebugPanel } from "@/components/concept-v3-rebuild/shared/layout-debug-panel";
import { MotionPreferenceProvider } from "@/lib/motion-preference-context";
import { getProofEngineHero } from "@/lib/proof-engine/selectors";
import {
  getEducation,
  getCareerTrajectoryEras,
  getCareerTrajectoryPrimary,
  getCareerTrajectoryIndependent,
} from "@/lib/content";
import styles from "@/styles/concept-v3-rebuild/hero.module.scss";
import "@/styles/concept-v3-rebuild/responsive-tokens.scss";

export const metadata: Metadata = {
  title: "Concept V3 Rebuild — The Proof Engine",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConceptV3RebuildPage() {
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
        <div className={styles.rebuild} data-concept-rebuild>
          <RebuildNav />
          <main id="main-content" className={styles.main}>
            <RebuildHero content={content} />
            <OriginChapter education={education} />
            <CareerChapter
              eras={eras}
              primary={primary}
              independent={independent}
            />
          </main>
          <LayoutDebugPanel />
        </div>
      </LayoutModeProvider>
    </MotionPreferenceProvider>
  );
}
