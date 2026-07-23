import type { EvidenceItem } from "@/content/profile";

export function ProofRail({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <section aria-labelledby="proof-title" className="page-shell proof" id="proof">
      <h2 className="sr-only" id="proof-title">
        Verified evidence
      </h2>
      <div className="proof__rail">
        {evidence.map((item) => (
          <article className="proof__item" key={item.scope}>
            <p className="proof__scope">{item.scope}</p>
            <strong className="proof__value">{item.value}</strong>
            <p className="proof__label">{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
