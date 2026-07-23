import styles from "@/styles/concept-v3-rebuild/chapters.module.scss";

interface ChapterMarkerProps {
  label: string;
  index?: string;
}

export function ChapterMarker({ label, index }: ChapterMarkerProps) {
  return (
    <div className={styles.marker}>
      <span className={styles.markerPulse} aria-hidden="true" />
      {index ? (
        <span className={styles.markerIndex} aria-hidden="true">
          {index}
        </span>
      ) : null}
      <span className={styles.markerLabel}>{label}</span>
    </div>
  );
}
