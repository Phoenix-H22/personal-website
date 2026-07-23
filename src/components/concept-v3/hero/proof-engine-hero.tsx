import { HeroAtmosphere } from "@/components/concept-v3/hero/hero-atmosphere";
import { HeroComposition } from "@/components/concept-v3/hero/hero-composition";
import type { ProofEngineHeroContent } from "@/lib/proof-engine/types";
import styles from "@/styles/concept-v3/proof-engine.module.scss";

interface ProofEngineHeroProps {
  content: ProofEngineHeroContent;
  mode?: "prototype" | "production";
}

export function ProofEngineHero({
  content,
  mode = "prototype",
}: ProofEngineHeroProps) {
  // Static foundation: CSS media queries own cinematic/layered/narrative layout.
  // mode="narrative" documents semantic DOM order; visuals adapt via CSS breakpoints.
  const compositionMode = "narrative" as const;

  return (
    <section
      id="proof-stage"
      className={styles.stage}
      aria-labelledby="proof-engine-name"
      data-hero-mode={mode}
    >
      <HeroAtmosphere />
      <HeroComposition
        content={content}
        reducedMotion={false}
        mode={compositionMode}
      />
    </section>
  );
}
