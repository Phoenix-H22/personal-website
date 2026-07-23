import Image from "next/image";

import type { EducationEntry } from "@/content/education";
import { formatDateRange } from "@/components/concept-v3-rebuild/career/format";
import styles from "@/styles/concept-v3-rebuild/origin.module.scss";

interface EducationMilestoneProps {
  entry: EducationEntry;
  variant: "stem" | "university";
}

export function EducationMilestone({ entry, variant }: EducationMilestoneProps) {
  const nodeClass =
    variant === "stem" ? styles.milestoneNodeStem : styles.milestoneNodeUniversity;
  const articleClass =
    variant === "stem" ? styles.milestoneStem : styles.milestoneUniversity;

  const period = formatDateRange(entry.startDate, entry.endDate);

  return (
    <article className={`${styles.milestone} ${articleClass}`}>
      <span
        className={`${styles.milestoneNode} ${nodeClass}`}
        aria-hidden="true"
      />

      <div className={styles.milestoneHeader}>
        {entry.logo ? (
          <div className={styles.milestoneLogo}>
            <Image
              src={entry.logo.src}
              alt={entry.logo.alt}
              width={44}
              height={44}
              className={styles.milestoneLogoImg}
            />
          </div>
        ) : null}
        <div>
          <p className={styles.milestonePeriod}>{period}</p>
          <h3 className={styles.milestoneInstitution}>{entry.institution}</h3>
          {entry.location ? (
            <p className={styles.milestoneLocation}>{entry.location}</p>
          ) : null}
        </div>
      </div>

      <p className={styles.milestoneDegree}>
        {entry.degree}
        {entry.fieldOfStudy ? (
          <>
            <span className={styles.milestoneDegreeSep} aria-hidden="true">
              ·
            </span>
            {entry.fieldOfStudy}
          </>
        ) : null}
      </p>

      <p className={styles.milestoneNarrative}>{entry.summary}</p>

      {entry.highlights.length > 0 ? (
        <ul className={styles.milestoneHighlights}>
          {entry.highlights.slice(0, 3).map((highlight) => {
            const isCapstone =
              highlight.includes("A+") ||
              highlight.toLowerCase().includes("graduation project");
            const isHonors =
              highlight.toLowerCase().includes("honors") ||
              highlight.toLowerCase().includes("a-grade");
            return (
              <li
                key={highlight}
                className={[
                  styles.milestoneHighlight,
                  isHonors ? styles.milestoneHighlightHonors : "",
                  isCapstone ? styles.milestoneHighlightCapstone : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isCapstone ? (
                  <span className={styles.capstoneSeal} aria-hidden="true">
                    A+
                  </span>
                ) : null}
                {highlight}
              </li>
            );
          })}
        </ul>
      ) : null}
    </article>
  );
}
