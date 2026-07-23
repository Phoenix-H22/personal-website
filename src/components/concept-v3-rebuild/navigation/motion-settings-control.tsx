"use client";

/**
 * Future accessibility surface for motion preference.
 * Not mounted in production-facing navigation. Prefer footer / a11y settings
 * when reintroduced. Development forcing remains via `?motionDebug=1` panel
 * and `?motionOverride=full`.
 */

import { useEffect, useId, useRef, useState } from "react";

import { useMotionPreference } from "@/lib/motion-preference-context";
import type { MotionPreference } from "@/lib/motion-preference";
import styles from "@/styles/concept-v3-rebuild/hero.module.scss";

const OPTIONS: { value: Exclude<MotionPreference, null>; label: string }[] = [
  { value: "full", label: "Full" },
  { value: "reduced", label: "Reduced" },
];

interface MotionSettingsControlProps {
  variant?: "nav" | "menu";
}

export function MotionSettingsControl({
  variant = "nav",
}: MotionSettingsControlProps) {
  const { preference, setPreference, clearPreference } = useMotionPreference();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "menu") {
    return (
      <div
        className={styles.motionControlMenu}
        role="group"
        aria-labelledby={labelId}
      >
        <p id={labelId} className={styles.motionControlLabel}>
          Motion
        </p>
        <div className={styles.motionControlOptions}>
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={styles.motionControlOption}
              aria-pressed={preference === option.value}
              onClick={() => setPreference(option.value)}
            >
              {option.label}
            </button>
          ))}
          <button
            type="button"
            className={styles.motionControlOption}
            aria-pressed={preference === null}
            onClick={() => clearPreference()}
          >
            Auto
          </button>
        </div>
      </div>
    );
  }

  const currentLabel =
    preference === "full"
      ? "Full"
      : preference === "reduced"
        ? "Reduced"
        : "Auto";

  return (
    <div ref={rootRef} className={styles.motionPopover}>
      <button
        type="button"
        className={styles.motionPopoverTrigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Motion preference: ${currentLabel}`}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8v2.2A5.8 5.8 0 1 0 17.8 12H20a8 8 0 1 1-16 0zm9-7.7V12h7.7A8.01 8.01 0 0 0 13 4.3z"
          />
        </svg>
        <span className={styles.motionPopoverHint}>{currentLabel}</span>
      </button>
      {open ? (
        <div
          id={panelId}
          className={styles.motionPopoverPanel}
          role="dialog"
          aria-label="Motion preference"
        >
          <p id={labelId} className={styles.motionControlLabel}>
            Motion
          </p>
          <div className={styles.motionControlOptions} role="group">
            {OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={styles.motionControlOption}
                aria-pressed={preference === option.value}
                onClick={() => {
                  setPreference(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              className={styles.motionControlOption}
              aria-pressed={preference === null}
              onClick={() => {
                clearPreference();
                setOpen(false);
              }}
            >
              Auto
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
