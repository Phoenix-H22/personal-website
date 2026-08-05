import type { CareerEra, ExperienceEntry } from "@/content/experience";
import { PortfolioChapter } from "@/components/concept-v3-rebuild/chapters/portfolio-chapter";
import { ChapterMarker } from "@/components/concept-v3-rebuild/chapters/chapter-marker";
import { CareerReel } from "./career-reel";
import chapStyles from "@/styles/concept-v3-rebuild/chapters.module.scss";
import styles from "@/styles/concept-v3-rebuild/career-reel.module.scss";

interface CareerChapterProps {
  eras: CareerEra[];
  primary: ExperienceEntry[];
  independent: ExperienceEntry[];
}

export function CareerChapter({
  eras,
  primary,
  independent,
}: CareerChapterProps) {
  return (
    <PortfolioChapter
      id="experience"
      variant="career"
      aria-labelledby="career-heading"
    >
      <p className={styles.bridge} aria-hidden="true">
        Education → Professional path · 2023
      </p>
      <ChapterMarker index="03" label="Career" />
      <p className={chapStyles.eyebrow}>Professional experience</p>
      <h2 id="career-heading" className={chapStyles.visuallyHidden}>
        Career
      </h2>

      <CareerReel
        eras={eras}
        primary={primary}
        independent={independent}
      />
    </PortfolioChapter>
  );
}
