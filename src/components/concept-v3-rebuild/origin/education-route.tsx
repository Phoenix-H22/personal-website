import type { EducationEntry } from "@/content/education";
import { EducationMilestone } from "./education-milestone";
import styles from "@/styles/concept-v3-rebuild/origin.module.scss";

interface EducationRouteProps {
  entries: EducationEntry[];
}

export function EducationRoute({ entries }: EducationRouteProps) {
  const sortedEntries = [...entries].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className={styles.route}>
      <div className={styles.routeTrack}>
        <div className={styles.routeLine} aria-hidden="true" />
        {sortedEntries.map((entry) => (
          <EducationMilestone
            key={entry.id}
            entry={entry}
            variant={entry.id.includes("stem") ? "stem" : "university"}
          />
        ))}
      </div>
    </div>
  );
}
