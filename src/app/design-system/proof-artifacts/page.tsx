import type { Metadata } from "next";

import {
  AKCore,
  CommerceScale,
  EducationJourney,
  ProductArtifacts,
  UpworkCredential,
} from "@/components/concept-v3-rebuild/artifacts/rebuild-artifacts";
import { ArtifactFrame } from "@/components/concept-v3/shared/artifact-frame";
import { MetricReadout } from "@/components/concept-v3/shared/metric-readout";
import { StatusSeal } from "@/components/concept-v3/shared/status-seal";
import { TemporaryMark } from "@/components/concept-v3/shared/temporary-mark";
import {
  getAkCore,
  getArtifactById,
  getUpworkCredential,
} from "@/lib/proof-engine/selectors";
import type { CommerceScaleArtifact, EducationJourneyArtifact, ProductArtifact } from "@/lib/proof-engine/types";

export const metadata: Metadata = {
  title: "Proof Artifacts — Design System",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProofArtifactsDesignSystemPage() {
  const upwork = getUpworkCredential();
  const akCore = getAkCore();
  const commerce = getArtifactById("commerce-scale") as CommerceScaleArtifact;
  const education = getArtifactById("education-journey") as EducationJourneyArtifact;
  const products = [
    getArtifactById("your-obour-guide"),
    getArtifactById("smart-vending"),
    getArtifactById("nabd"),
  ].filter((item): item is ProductArtifact => Boolean(item && item.kind === "product"));

  return (
    <div className="concept-v3 min-h-svh bg-canvas-void px-[var(--v3-page-gutter)] py-16 text-text-primary">
      <div className="mx-auto w-min max-w-[var(--v3-content-max)] min-w-full space-y-16">
        <header className="max-w-3xl space-y-4">
          <p className="font-mono text-xs tracking-[0.12em] text-signal-cyan uppercase">
            Design system · development only
          </p>
          <h1 className="text-4xl tracking-tight sm:text-5xl">Proof artifacts</h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Polished Concept V3 rebuild components. Not linked from production
            navigation. Review at 390 / 768 / 1440 and with{" "}
            <code>?motionDebug=1</code> on the rebuild route.
          </p>
        </header>

        <section className="space-y-6 border-t border-border-subtle pt-10">
          <h2 className="text-2xl">Primitives</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 rounded-[1.25rem] border border-border-subtle bg-surface-low p-6">
              <h3 className="font-mono text-xs tracking-wide text-text-muted uppercase">
                ArtifactFrame
              </h3>
              <ArtifactFrame accent="cyan" className="p-5">
                <p className="text-text-secondary text-sm">
                  Low-level frame primitive with accent variables.
                </p>
              </ArtifactFrame>
            </div>
            <div className="space-y-4 rounded-[1.25rem] border border-border-subtle bg-surface-low p-6">
              <h3 className="font-mono text-xs tracking-wide text-text-muted uppercase">
                MetricReadout / StatusSeal / TemporaryMark
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                <MetricReadout value="200+" label="merchants" accent="cyan" />
                <StatusSeal label="Top Rated" />
                <TemporaryMark label="Upwork" variant="upwork" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8 border-t border-border-subtle pt-10">
          <h2 className="text-2xl">Polished artifacts</h2>
          <div className="grid gap-10">
            <div className="max-w-md space-y-3 rounded-[1.5rem] border border-border-subtle bg-canvas-deep p-6">
              <h3 className="font-mono text-xs tracking-[0.1em] text-text-muted uppercase">
                Upwork Credential
              </h3>
              <UpworkCredential artifact={upwork} mode="narrative" />
            </div>
            <div className="max-w-lg space-y-3 rounded-[1.5rem] border border-border-subtle bg-canvas-deep p-6">
              <h3 className="font-mono text-xs tracking-[0.1em] text-text-muted uppercase">
                Commerce Scale
              </h3>
              <CommerceScale artifact={commerce} mode="layered" />
            </div>
            <div className="max-w-lg space-y-3 rounded-[1.5rem] border border-border-subtle bg-canvas-deep p-6">
              <h3 className="font-mono text-xs tracking-[0.1em] text-text-muted uppercase">
                Education Journey
              </h3>
              <EducationJourney artifact={education} mode="layered" />
            </div>
            <div className="max-w-md space-y-3 rounded-[1.5rem] border border-border-subtle bg-canvas-deep p-6">
              <h3 className="font-mono text-xs tracking-[0.1em] text-text-muted uppercase">
                Product orbit
              </h3>
              <ProductArtifacts products={products} mode="narrative" />
            </div>
            <div className="space-y-3 rounded-[1.5rem] border border-border-subtle bg-canvas-deep p-6">
              <h3 className="font-mono text-xs tracking-[0.1em] text-text-muted uppercase">
                AK Core
              </h3>
              <div className="flex items-end gap-8">
                <AKCore artifact={akCore} illuminated={false} />
                <AKCore artifact={akCore} illuminated />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
