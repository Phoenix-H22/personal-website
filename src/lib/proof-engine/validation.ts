import type { ProofEngineHeroContent } from "@/lib/proof-engine/types";

export function validateProofEngineHero(content: ProofEngineHeroContent): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  if (!content.name.trim()) {
    errors.push("Hero name is required");
  }

  if (!content.headline.trim()) {
    errors.push("Hero headline is required");
  }

  if (!content.primaryAction.href || !content.primaryAction.label) {
    errors.push("Primary action requires label and href");
  }

  for (const artifact of content.artifacts) {
    if (ids.has(artifact.id)) {
      errors.push(`Duplicate artifact id: ${artifact.id}`);
    }
    ids.add(artifact.id);

    if (artifact.visibleIn.length === 0) {
      errors.push(`Artifact ${artifact.id} has empty visibleIn`);
    }

    if (artifact.kind === "credential") {
      if (artifact.score.value < 0 || artifact.score.value > 100) {
        errors.push(`Credential score out of range: ${artifact.id}`);
      }
      if (!artifact.credential.trim()) {
        errors.push(`Credential label missing: ${artifact.id}`);
      }
      if (artifact.status === "verified" && !artifact.credential) {
        errors.push(`Verified credential missing label: ${artifact.id}`);
      }
    }

    if (artifact.kind === "commerce-scale" && artifact.metrics.length === 0) {
      errors.push(`Commerce scale missing metrics: ${artifact.id}`);
    }

    if (artifact.kind === "education-journey" && artifact.milestones.length === 0) {
      errors.push(`Education journey missing milestones: ${artifact.id}`);
    }

    if (artifact.asset && !artifact.asset.alt.trim()) {
      errors.push(`Asset missing alt text: ${artifact.id}`);
    }
  }

  return errors;
}
