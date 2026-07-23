import type { Metadata } from "next";

import { ConceptV3Nav } from "@/components/concept-v3/navigation/concept-v3-nav";
import { ProofEngineHero } from "@/components/concept-v3/hero/proof-engine-hero";
import { getProofEngineHero } from "@/lib/proof-engine/selectors";

export const metadata: Metadata = {
  title: "Concept V3 — The Proof Engine",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConceptV3Page() {
  const content = getProofEngineHero();

  return (
    <div className="concept-v3">
      <ConceptV3Nav />
      <main id="main-content">
        <ProofEngineHero content={content} mode="prototype" />
      </main>
    </div>
  );
}
