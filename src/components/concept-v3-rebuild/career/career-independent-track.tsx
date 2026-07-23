import type { ExperienceEntry } from "@/content/experience";
import { CompanyLogoFrame } from "@/components/concept-v3-rebuild/shared/company-logo-frame";
import { formatDateRange } from "./format";
import styles from "@/styles/concept-v3-rebuild/career-reel.module.scss";

interface CareerIndependentTrackProps {
  entries: ExperienceEntry[];
  selectedId: string;
  path: "main" | "independent";
  onSelect: (id: string) => void;
}

export function CareerIndependentTrack({
  entries,
  selectedId,
  path,
  onSelect,
}: CareerIndependentTrackProps) {
  return (
    <div
      className={[
        styles.indieCompact,
        path === "independent" ? styles.indieCompactActive : "",
        path === "main" ? styles.indieCompactQuiet : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-independent-reel
    >
      <p className={styles.indieHeading}>Independent track</p>
      <div
        className={styles.indieLinks}
        role="tablist"
        aria-label="Independent work"
      >
        {entries.map((entry) => {
          const selected = path === "independent" && entry.id === selectedId;
          const period = formatDateRange(
            entry.startDate,
            entry.endDate,
            entry.isCurrent,
          );
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              id={`career-node-${entry.id}`}
              aria-selected={selected}
              aria-controls="career-story-panel"
              aria-label={`${entry.companyShortName ?? entry.company}, ${entry.role}, ${period}`}
              className={[
                styles.indieChip,
                selected ? styles.indieChipActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              data-company-node={entry.id}
              data-track="independent"
              onClick={() => onSelect(entry.id)}
            >
              <CompanyLogoFrame
                logo={entry.logo}
                company={entry.company}
                companyShortName={entry.companyShortName}
                size="sm"
              />
              <span className={styles.indieChipName}>
                {entry.companyShortName ?? entry.company}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
