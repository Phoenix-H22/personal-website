import styles from "@/styles/concept-v3-rebuild/artifacts.module.scss";

interface ScoreRingProps {
  value: number;
  unit: "%";
  label: string;
  className?: string;
}

/** Dedicated SVG score instrument — text never intersects the stroke. */
export function ScoreRing({ value, unit, label, className }: ScoreRingProps) {
  const size = 128;
  const stroke = 9;
  const radius = (size - stroke) / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  // Start empty so GSAP can draw 0 → value. Reduced-motion path sets final state.
  const initialOffset = circumference;

  return (
    <div
      className={[styles.scoreRing, className ?? ""].filter(Boolean).join(" ")}
      data-score-ring
      aria-hidden="true"
    >
      <svg
        className={styles.scoreRingSvg}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
      >
        <defs>
          <linearGradient id="scoreRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f5c0c" />
            <stop offset="45%" stopColor="#14a800" />
            <stop offset="100%" stopColor="#6bd12a" />
          </linearGradient>
          <radialGradient id="scoreRingLens" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgb(255 255 255 / 10%)" />
            <stop offset="55%" stopColor="rgb(8 22 12 / 55%)" />
            <stop offset="100%" stopColor="rgb(3 10 6 / 85%)" />
          </radialGradient>
          <filter id="scoreRingGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - stroke * 0.35}
          fill="url(#scoreRingLens)"
        />
        <circle
          className={styles.scoreRingTrack}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className={styles.scoreRingProgress}
          data-score-progress
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={initialOffset}
          stroke="url(#scoreRingGrad)"
          filter="url(#scoreRingGlow)"
          data-circumference={circumference}
          data-target-offset={circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference}
        />
        <circle
          className={styles.scoreRingHighlight}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={2.4}
          strokeDasharray={`${circumference * 0.07} ${circumference}`}
          strokeDashoffset={circumference * 0.015}
        />
      </svg>
      <div className={styles.scoreRingCenter}>
        <p className={styles.scoreRingValue} data-score-value>
          0{unit}
        </p>
        <p className={styles.scoreRingLabel} data-score-label>
          {label}
        </p>
      </div>
    </div>
  );
}
