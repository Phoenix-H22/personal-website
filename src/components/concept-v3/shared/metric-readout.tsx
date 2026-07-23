import type { ArtifactAccent } from "@/lib/proof-engine/types";
import styles from "@/styles/concept-v3/artifacts.module.scss";

const accentClass: Record<ArtifactAccent, string> = {
  cyan: styles.metricAccentCyan,
  blue: styles.metricAccentBlue,
  amber: styles.metricAccentAmber,
  violet: styles.metricAccentViolet,
  "upwork-green": styles.metricAccentUpwork,
  "communication-green": styles.metricAccentComm,
};

interface MetricReadoutProps {
  value: string;
  label: string;
  context?: string;
  accent?: ArtifactAccent;
  className?: string;
}

export function MetricReadout({
  value,
  label,
  context,
  accent,
  className,
}: MetricReadoutProps) {
  return (
    <div
      className={[styles.metric, accent ? accentClass[accent] : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <p className={styles.metricValue}>{value}</p>
      <p className={styles.metricLabel}>{label}</p>
      {context ? <p className={styles.metricContext}>{context}</p> : null}
    </div>
  );
}
