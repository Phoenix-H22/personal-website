import { ProofArtifact } from "@/components/concept-v3/artifacts/proof-artifact";
import { HeroActions, HeroCopy } from "@/components/concept-v3/hero/hero-copy";
import type {
  CompositionMode,
  ProofEngineHeroContent,
} from "@/lib/proof-engine/types";
import styles from "@/styles/concept-v3/proof-engine.module.scss";

interface HeroCompositionProps {
  content: ProofEngineHeroContent;
  reducedMotion: boolean;
  mode: CompositionMode;
}

export function HeroComposition({
  content,
  reducedMotion,
  mode,
}: HeroCompositionProps) {
  const upwork = content.artifacts.find(
    (artifact) => artifact.id === "upwork-credential",
  );
  const akCore = content.artifacts.find((artifact) => artifact.id === "ak-core");

  return (
    <div
      className={styles.composition}
      data-composition-mode={mode}
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <div className={styles.identity} data-slot="identity">
        <HeroCopy content={content} />
        <HeroActions
          primaryAction={content.primaryAction}
          secondaryAction={content.secondaryAction}
          socialActions={content.socialActions}
        />
      </div>

      {upwork ? (
        <div className={`${styles.slot} ${styles.slotUpwork}`} data-slot="upwork">
          <ProofArtifact
            artifact={upwork}
            mode={mode}
            reducedMotion={reducedMotion}
          />
        </div>
      ) : null}

      <div className={styles.slotReserved} data-slot="commerce" hidden />
      <div className={styles.slotReserved} data-slot="education" hidden />
      <div className={styles.slotReserved} data-slot="products" hidden />

      {akCore ? (
        <div className={`${styles.slot} ${styles.slotAk}`} data-slot="ak-core">
          <ProofArtifact
            artifact={akCore}
            mode={mode}
            reducedMotion={reducedMotion}
          />
        </div>
      ) : null}
    </div>
  );
}
