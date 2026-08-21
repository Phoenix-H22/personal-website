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
      <aside className={styles.ledgerTransition} aria-label="View all projects">
        <div>
          <p>All projects / 13 production systems</p>
          <span>
            Open the full projects page for every build — ownership, stack, and
            complete details, not only the selected evidence above.
          </span>
        </div>
        <Link href="/projects" prefetch={false}>
          View all projects <span aria-hidden="true">-&gt;</span>
        </Link>
      </aside>
    </>
  );
}
