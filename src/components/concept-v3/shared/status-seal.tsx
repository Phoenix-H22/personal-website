import styles from "@/styles/concept-v3/artifacts.module.scss";

interface StatusSealProps {
  label: string;
  className?: string;
}

export function StatusSeal({ label, className }: StatusSealProps) {
  return (
    <span className={[styles.seal, className ?? ""].filter(Boolean).join(" ")}>
      <span className={styles.sealDot} aria-hidden="true" />
      {label}
    </span>
  );
}
