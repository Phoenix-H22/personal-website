import type { ExperienceEntry } from "@/content/experience";
import { CompanyLogoFrame } from "@/components/concept-v3-rebuild/shared/company-logo-frame";
import { formatDateRange, formatYear } from "./format";
import styles from "@/styles/concept-v3-rebuild/career-reel.module.scss";

interface CareerCompanyNodeProps {
  entry: ExperienceEntry;
  selected: boolean;
  variant?: "main" | "independent";
  onSelect: (id: string) => void;
  nodeRef?: (el: HTMLButtonElement | null) => void;
}

export function CareerCompanyNode({
  entry,
  selected,
  variant = "main",
  onSelect,
  nodeRef,
}: CareerCompanyNodeProps) {
  const period = formatDateRange(
    entry.startDate,
    entry.endDate,
    entry.isCurrent,
  );
  const year = formatYear(entry.startDate);

  return (
    <button
      ref={nodeRef}
      type="button"
      role="tab"
      id={`career-node-${entry.id}`}
      aria-selected={selected}
      aria-controls="career-story-panel"
      aria-label={`${entry.companyShortName ?? entry.company}, ${entry.role}, ${period}`}
      className={[
        styles.milestone,
        selected && variant === "main" ? styles.milestoneActive : "",
        selected && variant === "independent" ? styles.milestoneIndieActive : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-company-node={entry.id}
      data-track={variant}
      onClick={() => onSelect(entry.id)}
    >
      <span className={styles.pedestal}>
        <CompanyLogoFrame
          logo={entry.logo}
          company={entry.company}
          companyShortName={entry.companyShortName}
          size="pedestal"
        />
      </span>
      <span className={styles.milestoneName}>
        {entry.companyShortName ?? entry.company}
      </span>
      <span className={styles.milestoneYear}>
        {entry.isCurrent ? `${year} →` : year}
      </span>
      {entry.isCurrent && variant === "main" ? (
        <span className={styles.milestoneCurrent} aria-hidden="true">
          <span className={styles.milestoneCurrentDot} />
          Current
        </span>
      ) : null}
    </button>
  );
}
