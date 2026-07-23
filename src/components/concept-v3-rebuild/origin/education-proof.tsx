import styles from "@/styles/concept-v3-rebuild/origin.module.scss";

interface EducationProofProps {
  label: string;
  value: string;
}

export function EducationProof({ label, value }: EducationProofProps) {
  return (
    <div className={styles.proof}>
      <span className={styles.proofBadge} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
      <div className={styles.proofText}>
        <span className={styles.proofLabel}>{label}</span>
        <span className={styles.proofValue}>{value}</span>
      </div>
    </div>
  );
}
