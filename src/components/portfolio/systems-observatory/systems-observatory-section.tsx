import Link from "next/link";

import { SystemsObservatoryExperience } from "@/components/portfolio/systems-observatory/systems-observatory-experience";
import { buildSystemsObservatoryLenses } from "@/components/portfolio/systems-observatory/systems-observatory.config";
import { getFeaturedProjects } from "@/lib/portfolio/projects";
import styles from "@/styles/portfolio/systems-observatory.module.scss";

export async function SystemsObservatorySection() {
  const featuredProjects = await getFeaturedProjects();
  const lenses = buildSystemsObservatoryLenses(featuredProjects);

  return (
    <>
      <SystemsObservatoryExperience lenses={lenses} />
      <aside className={styles.ledgerTransition} aria-label="Complete project inventory">
        <div>
          <p>SYSTEMS LEDGER / 13 PRODUCTION BUILDS</p>
          <span>Continue from the selected evidence into the complete engineering record.</span>
        </div>
        <Link href="/v2/work" prefetch={false}>
          Open Systems Ledger <span aria-hidden="true">-&gt;</span>
        </Link>
      </aside>
    </>
  );
}
