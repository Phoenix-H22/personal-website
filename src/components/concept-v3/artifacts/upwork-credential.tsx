import { ArtifactFrame } from "@/components/concept-v3/shared/artifact-frame";
import { StatusSeal } from "@/components/concept-v3/shared/status-seal";
import { TemporaryMark } from "@/components/concept-v3/shared/temporary-mark";
import type { CompositionMode, CredentialArtifact } from "@/lib/proof-engine/types";
import styles from "@/styles/concept-v3/artifacts.module.scss";

interface UpworkCredentialProps {
  artifact: CredentialArtifact;
  mode: CompositionMode;
  reducedMotion: boolean;
}

function ScoreRing({
  value,
  unit,
  label,
}: {
  value: number;
  unit: "%";
  label: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={styles.upworkScore} aria-hidden="true">
      <svg className={styles.upworkScoreSvg} viewBox="0 0 100 100">
        <circle
          className={styles.upworkScoreTrack}
          cx="50"
          cy="50"
          r={radius}
        />
        <circle
          className={styles.upworkScoreProgress}
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={styles.upworkScoreCenter}>
        <p className={styles.upworkScoreValue}>
          {value}
          {unit}
        </p>
        <p className={styles.upworkScoreLabel}>{label}</p>
      </div>
    </div>
  );
}

export function UpworkCredential({
  artifact,
  mode,
  reducedMotion,
}: UpworkCredentialProps) {
  const scoreText = `${artifact.score.value}${artifact.score.unit} ${artifact.score.label}`;
  const profileHref = artifact.profileLink?.href ?? artifact.href ?? null;

  return (
    <ArtifactFrame
      accent={artifact.accent}
      href={profileHref}
      aria-label={`${artifact.title}: ${artifact.credential}, ${scoreText}`}
      className={styles.upwork}
      interactive={Boolean(profileHref)}
    >
      <div
        className={styles.upworkInner}
        data-composition-mode={mode}
        data-reduced-motion={reducedMotion ? "true" : "false"}
      >
        <div className={styles.upworkEdgeGlow} aria-hidden="true" />
        <div className={styles.upworkThickness} aria-hidden="true" />
        <div className={styles.upworkSlab}>
          <div className={styles.upworkBody}>
            <div className={styles.upworkHeader}>
              {artifact.asset ? (
                // Official mark only when an approved asset is provided in content.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artifact.asset.src}
                  alt={artifact.asset.alt}
                  width={artifact.asset.width ?? 120}
                  height={artifact.asset.height ?? 32}
                />
              ) : (
                <TemporaryMark label="Upwork" variant="upwork" />
              )}
              <StatusSeal label={artifact.credential} />
            </div>

            <div className={styles.upworkProof}>
              <div className={styles.upworkCopy}>
                {artifact.summary ? (
                  <p className={styles.upworkSummary}>{artifact.summary}</p>
                ) : null}
                <p className="sr-only">
                  {artifact.credential}. {scoreText}.
                </p>
              </div>
              <ScoreRing
                value={artifact.score.value}
                unit={artifact.score.unit}
                label={artifact.score.label}
              />
            </div>

            <div className={styles.upworkFoot}>
              {artifact.eyebrow ? (
                <p className={styles.upworkEyebrow}>{artifact.eyebrow}</p>
              ) : (
                <span />
              )}
              {artifact.profileLink ? (
                <span className={styles.upworkLink}>{artifact.profileLink.label}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </ArtifactFrame>
  );
}
