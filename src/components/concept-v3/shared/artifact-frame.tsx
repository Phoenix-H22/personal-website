import type { ArtifactAccent } from "@/lib/proof-engine/types";
import styles from "@/styles/concept-v3/artifacts.module.scss";

const accentClass: Record<ArtifactAccent, string> = {
  cyan: styles.frameAccentCyan,
  blue: styles.frameAccentBlue,
  amber: styles.frameAccentAmber,
  violet: styles.frameAccentViolet,
  "upwork-green": styles.frameAccentUpwork,
  "communication-green": styles.frameAccentComm,
};

interface ArtifactFrameProps {
  accent?: ArtifactAccent;
  interactive?: boolean;
  href?: string | null;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

export function ArtifactFrame({
  accent = "cyan",
  interactive = false,
  href,
  className,
  children,
  "aria-label": ariaLabel,
}: ArtifactFrameProps) {
  const classes = [
    styles.frame,
    accentClass[accent],
    interactive ? styles.frameInteractive : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        aria-label={ariaLabel}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <div className={classes} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
