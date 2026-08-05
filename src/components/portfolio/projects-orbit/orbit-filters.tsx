"use client";

import type {
  DomainFilter,
  FilterChip,
  OwnerFilter,
} from "@/components/portfolio/projects-orbit/use-projects-orbit";
import styles from "@/styles/portfolio/projects-orbit.module.scss";

interface OrbitFiltersProps {
  domainChips: FilterChip<DomainFilter>[];
  ownerChips: FilterChip<OwnerFilter>[];
  onDomainChange: (value: DomainFilter) => void;
  onOwnerChange: (value: OwnerFilter) => void;
}

function ChipButton<TValue extends string>({
  chip,
  onSelect,
}: {
  chip: FilterChip<TValue>;
  onSelect: (value: TValue) => void;
}) {
  return (
    <button
      type="button"
      className={styles.chip}
      data-active={chip.active}
      aria-pressed={chip.active}
      onClick={() => onSelect(chip.value)}
    >
      {chip.label}
      <span className={styles.chipCount}>{chip.count}</span>
    </button>
  );
}

export function OrbitFilters({
  domainChips,
  ownerChips,
  onDomainChange,
  onOwnerChange,
}: OrbitFiltersProps) {
  return (
    <section className={styles.filters} aria-label="Filters">
      <span className={styles.filterLabel}>Filter</span>
      <div className={styles.chipRow} role="group" aria-label="Filter by domain">
        {domainChips.map((chip) => (
          <ChipButton key={chip.value} chip={chip} onSelect={onDomainChange} />
        ))}
      </div>
      <div className={styles.ownerRow} role="group" aria-label="Filter by ownership">
        {ownerChips.map((chip) => (
          <ChipButton key={chip.value} chip={chip} onSelect={onOwnerChange} />
        ))}
      </div>
    </section>
  );
}
