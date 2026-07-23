import { AKCore } from "@/components/concept-v3/artifacts/ak-core";
import { UpworkCredential } from "@/components/concept-v3/artifacts/upwork-credential";
import type {
  CompositionMode,
  ProofEngineHeroContent,
} from "@/lib/proof-engine/types";

interface ProofArtifactProps {
  artifact: ProofEngineHeroContent["artifacts"][number];
  mode: CompositionMode;
  interactive?: boolean;
  reducedMotion?: boolean;
}

export function ProofArtifact({
  artifact,
  mode,
  reducedMotion = false,
}: ProofArtifactProps) {
  switch (artifact.kind) {
    case "credential":
      return (
        <UpworkCredential
          artifact={artifact}
          mode={mode}
          reducedMotion={reducedMotion}
        />
      );
    case "brand-core":
      return <AKCore artifact={artifact} variant="mark" decorative={mode !== "narrative"} />;
    case "commerce-scale":
    case "education-journey":
    case "product":
      // Reserved for later stages — shells must not fabricate unfinished artifacts.
      return null;
    default: {
      const _exhaustive: never = artifact;
      return _exhaustive;
    }
  }
}
