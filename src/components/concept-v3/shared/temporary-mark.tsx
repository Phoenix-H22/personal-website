import styles from "@/styles/concept-v3/artifacts.module.scss";

interface TemporaryMarkProps {
  label: string;
  /** Developer-only note — never render in production-facing UI. */
  note?: string;
  showNote?: boolean;
  variant?: "default" | "upwork";
  className?: string;
}

/**
 * Clean typographic fallback when an official mark asset is unavailable.
 * Do not surface asset-status copy to end users.
 */
export function TemporaryMark({
  label,
  note,
  showNote = false,
  variant = "default",
  className,
}: TemporaryMarkProps) {
  return (
    <div className={[styles.temporaryMark, className ?? ""].filter(Boolean).join(" ")}>
      <p
        className={[
          styles.temporaryMarkWord,
          variant === "upwork" ? styles.temporaryMarkWordUpwork : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </p>
      {showNote && note ? <p className={styles.temporaryMarkNote}>{note}</p> : null}
    </div>
  );
}
