import type { CareerEra, ExperienceEntry } from "@/content/experience";
import { PortfolioChapter } from "@/components/concept-v3-rebuild/chapters/portfolio-chapter";
import { ChapterMarker } from "@/components/concept-v3-rebuild/chapters/chapter-marker";
import { CareerReel } from "./career-reel";
import chapStyles from "@/styles/concept-v3-rebuild/chapters.module.scss";

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
      transitionFromHero
    >
      <ChapterMarker index="02" label="Career" />
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
