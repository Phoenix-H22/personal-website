import type { Metadata } from "next";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { SystemMap } from "@/components/home/system-map";

export const metadata: Metadata = {
  title: "Design System",
  robots: {
    follow: false,
    index: false,
  },
};

const swatches: Array<{ name: string; value: string; paper?: boolean }> = [
  { name: "Ink", value: "var(--background-primary)" },
  { name: "Graphite", value: "var(--background-secondary)" },
  { name: "Surface", value: "var(--surface-primary)" },
  { name: "Signal teal", value: "var(--signal-primary)" },
  { name: "Route blue", value: "var(--signal-secondary)" },
  { name: "Outcome gold", value: "var(--signal-premium)" },
  {
    name: "Editorial paper",
    value: "var(--editorial-surface)",
    paper: true,
  },
];

export default function DesignSystemPage() {
  return (
    <main className="design-system" id="main-content">
      <div className="page-shell">
        <p className="technical-label">Internal visual QA / v0.1</p>
        <h1>Systems Under the Surface.</h1>

        <section className="ds-section">
          <h2>Brand mark</h2>
          <div className="ds-row">
            <BrandMark size={48} />
            <BrandMark size={32} />
            <BrandMark size={24} />
            <span className="technical-label">AK / connected route</span>
          </div>
        </section>

        <section className="ds-section">
          <h2>Semantic color</h2>
          <div className="swatches">
            {swatches.map((swatch) => (
              <div
                className={`swatch${swatch.paper ? " swatch--paper" : ""}`}
                key={swatch.name}
                style={{ background: swatch.value }}
              >
                {swatch.name}
              </div>
            ))}
          </div>
        </section>

        <section className="ds-section">
          <h2>Typography</h2>
          <p className="type-sample-display">
            The system is the product beneath the product.
          </p>
          <p className="hero__summary">
            Precise interface typography carries the narrative. Monospace is
            reserved for evidence, routes, and operational state.
          </p>
          <p className="technical-label">
            Queue / attempt 02 / healthy / 184ms
          </p>
        </section>

        <section className="ds-section">
          <h2>Actions and labels</h2>
          <div className="ds-row">
            <span className="button button--primary">
              Explore the systems
              <ArrowDownRight aria-hidden="true" size={16} />
            </span>
            <span className="button button--secondary">
              Start a conversation
              <ArrowUpRight aria-hidden="true" size={16} />
            </span>
            <span className="availability">Available for selected work</span>
          </div>
        </section>

        <section className="ds-section">
          <h2>Architecture visual and motion</h2>
          <SystemMap />
        </section>

        <section className="ds-section">
          <h2>Scoped evidence</h2>
          <div className="proof__rail">
            <article className="proof__item">
              <p className="proof__scope">Commerce operations systems</p>
              <strong className="proof__value">200+ · 20K+ · 12M+ SAR</strong>
              <p className="proof__label">
                Merchants · monthly orders · handled order value
              </p>
            </article>
            <article className="proof__item">
              <p className="proof__scope">Release quality gate</p>
              <strong className="proof__value">406 + 138</strong>
              <p className="proof__label">Laravel and Flutter tests passing</p>
            </article>
            <article className="proof__item">
              <p className="proof__scope">Visibility</p>
              <strong className="proof__value">Private product</strong>
              <p className="proof__label">
                Architecture and impact available
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
