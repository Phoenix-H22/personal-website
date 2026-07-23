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
