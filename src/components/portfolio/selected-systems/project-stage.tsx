"use client";

import { ProjectCover } from "@/components/portfolio/selected-systems/project-cover";
import type { FeaturedSystemCardProps } from "@/components/portfolio/selected-systems/selected-system-types";
import styles from "@/styles/portfolio/selected-systems.module.scss";

interface ProjectStageProps {
  project: FeaturedSystemCardProps;
  layout: "flagship" | "nabd" | "vending" | "clinic" | "solo";
}

function TechLine({ technologies }: { technologies: string[] }) {
  if (!technologies.length) return null;
  return <p className={styles.tech}>{technologies.join(" · ")}</p>;
}

export function ProjectStage({ project, layout }: ProjectStageProps) {
  return (
    <article
      className={[
        styles.project,
        layout === "flagship" ? styles.flagship : "",
        layout === "nabd" ? styles.nabd : "",
        layout === "vending" ? styles.vending : "",
        layout === "clinic" ? styles.clinic : "",
        layout === "solo" ? styles.solo : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-system-scene={layout}
      data-project-id={project.id}
      data-category={project.homepageCategory}
    >
      <div className={styles.coverSlot}>
        <ProjectCover type={project.coverType} logoSrc={project.logoSrc} />
      </div>
      <div className={styles.copy}>
        <div className={styles.metaRow}>
          <p className={styles.category}>{project.categoryLabel}</p>
          {project.isFlagship ? (
            <span className={styles.flag}>Flagship</span>
          ) : null}
        </div>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        {project.companyName ? (
          <p className={styles.company}>{project.companyName}</p>
        ) : null}
        <p className={styles.proposition}>{project.summary}</p>
        <p className={styles.ownership}>
          <span className={styles.ownershipLabel}>Owned</span>
          {project.ownershipSummary}
        </p>
        {project.strongestProof ? (
          <p className={styles.proof}>
            <span className={styles.proofValue}>
              {project.strongestProof.value}
            </span>
            <span className={styles.proofLabel}>
              {project.strongestProof.label}
            </span>
          </p>
        ) : null}
        <TechLine technologies={project.technologies} />
        {project.confidentialityLabel ? (
          <p className={styles.safeNote}>{project.confidentialityLabel}</p>
        ) : null}
      </div>
    </article>
  );
}
