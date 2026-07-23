import type { EducationEntry } from "@/content/education";
import { PortfolioChapter } from "@/components/concept-v3-rebuild/chapters/portfolio-chapter";
import { ChapterMarker } from "@/components/concept-v3-rebuild/chapters/chapter-marker";
import { EducationRoute } from "./education-route";
import chapStyles from "@/styles/concept-v3-rebuild/chapters.module.scss";
import styles from "@/styles/concept-v3-rebuild/origin.module.scss";

interface OriginChapterProps {
  education: EducationEntry[];
}

export function OriginChapter({ education }: OriginChapterProps) {
  return (
    <PortfolioChapter
      id="education"
      variant="origin"
      aria-labelledby="origin-heading"
      transitionFromHero
    >
      <div className={styles.originContent}>
        <div className={styles.originIntro}>
          <ChapterMarker index="02" label="Origin" />
          <p className={chapStyles.eyebrow}>Education</p>
          <h2 id="origin-heading" className={chapStyles.heading}>
            Where the engineering mindset started.
          </h2>
          <p className={chapStyles.subheading}>
            From STEM scientific thinking and problem-solving into a computer
            and AI foundation built for shipping real systems.
          </p>

          <div className={styles.originSummary} aria-label="University results">
            <p className={styles.originSummaryText}>
              <span className={styles.originHonors}>
                Cumulative A-grade with Honors
              </span>
              <span className={styles.originSummarySep} aria-hidden="true">
                ·
              </span>
              <span className={styles.originCapstone}>
                Capstone graded A+
              </span>
            </p>
            <p className={styles.originCapstoneDetail}>
              Graduation project: Virtual Clinic / Dr. Robot
            </p>
          </div>
        </div>

        <div className={styles.origin}>
          <EducationRoute entries={education} />
        </div>
      </div>
    </PortfolioChapter>
  );
}
