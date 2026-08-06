"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ContactIcon } from "@/components/portfolio/contact/contact-icons";
import {
  RECRUITER_PROFILE,
  WHATSAPP_WA_ME_DIGITS,
} from "@/lib/portfolio/recruiter-profile";
import type { PublicVerifiedMetric } from "@/lib/portfolio/projects/types";
import styles from "@/styles/portfolio/recruiter-experience.module.scss";

type ProofPoint = PublicVerifiedMetric & { project: string };

function DownloadIcon() {
  return (
    <svg
      className={styles.briefCtaIcon}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 20h16" />
    </svg>
  );
}

interface Chapter {
  kicker: string;
  title: string;
  lines?: string[];
  kind?: "proof" | "cta";
}

// Six ~10s beats -> a brief that genuinely runs about 60 seconds. Positioned
// on curiosity, diligence, and how fast I learn — not seniority or hype.
const CHAPTERS: Chapter[] = [
  {
    kicker: "The honest pitch",
    title: "No buzzwords, no inflated title.",
    lines: [
      "I'm early in my career and I lean into it.",
      "I learn your system faster than most — and I don't stop until it ships.",
    ],
  },
  {
    kicker: "How I think",
    title: "I go and find the answer.",
    lines: [
      "The docs, the source, the actual error — not the first search result.",
      "Diligent by default: I keep digging until it truly works.",
    ],
  },
  {
    kicker: "Adaptability",
    title: "New stack? Days, not months.",
    lines: [
      "Laravel, Node, Vue, Flutter, Python, MQTT, Redis — shipped, not skimmed.",
      "I pick what fits the problem and get productive fast.",
    ],
  },
  {
    kicker: "Proof in production",
    title: "Real systems. Real load.",
    kind: "proof",
  },
  {
    kicker: "What drives me",
    title: "I genuinely like the puzzle.",
    lines: [
      "Curiosity is the engine — I go deeper because I want to know how it works.",
      "That's usually why the thing ends up working.",
    ],
  },
  {
    kicker: "Let's talk",
    title: "Bring me the hard part.",
    kind: "cta",
  },
];

const CHAPTER_MS = 10_000;
const TOTAL = CHAPTERS.length;

function formatRemaining(index: number, progress: number): string {
  const doneMs = index * CHAPTER_MS + progress * CHAPTER_MS;
  const remaining = Math.max(0, Math.round((TOTAL * CHAPTER_MS - doneMs) / 1000));
  return `0:${String(remaining).padStart(2, "0")}`;
}

export function RecruiterBriefDialog({ proofPoints }: { proofPoints: ProofPoint[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const elapsed = useRef(0);
  const lastTs = useRef(0);
  const raf = useRef(0);
  const indexRef = useRef(0);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  const chapter = CHAPTERS[index];

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const goTo = useCallback((next: number, resume = true) => {
    const clamped = Math.min(TOTAL - 1, Math.max(0, next));
    elapsed.current = 0;
    lastTs.current = 0;
    setProgress(0);
    setFinished(false);
    setIndex(clamped);
    if (resume) setPlaying(true);
  }, []);

  // The clock: advances the active beat while playing.
  useEffect(() => {
    if (!playing) return;
    let cancelled = false;
    lastTs.current = 0;
    const tick = (ts: number) => {
      if (cancelled) return;
      if (!lastTs.current) lastTs.current = ts;
      elapsed.current += ts - lastTs.current;
      lastTs.current = ts;
      const p = Math.min(1, elapsed.current / CHAPTER_MS);
      setProgress(p);
      if (p >= 1) {
        if (indexRef.current >= TOTAL - 1) {
          setFinished(true);
          setPlaying(false);
          return;
        }
        elapsed.current = 0;
        lastTs.current = 0;
        setProgress(0);
        setIndex(indexRef.current + 1);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  const open = () => {
    setIndex(0);
    elapsed.current = 0;
    lastTs.current = 0;
    setProgress(0);
    setFinished(false);
    setPlaying(true);
    dialogRef.current?.showModal();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      if (dialogRef.current?.open) closeRef.current?.focus();
    });
  };

  const close = useCallback(() => {
    setPlaying(false);
    dialogRef.current?.close();
    document.body.style.overflow = previousOverflow.current;
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const togglePlay = () => {
    if (finished) {
      goTo(0);
      return;
    }
    setPlaying((value) => !value);
  };

  useEffect(
    () => () => {
      document.body.style.overflow = previousOverflow.current;
    },
    [],
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.briefTrigger}
        aria-haspopup="dialog"
        onClick={open}
      >
        <span className={styles.briefTriggerPlay} aria-hidden="true">
          ▶
        </span>
        <span>60-second brief</span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.briefDialog}
        aria-labelledby="recruiter-brief-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className={styles.briefStage}>
          <div className={styles.briefSegs} aria-hidden="true">
            {CHAPTERS.map((item, i) => (
              <span key={item.kicker} className={styles.briefSeg}>
                <span
                  className={styles.briefSegFill}
                  style={{
                    transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})`,
                  }}
                />
              </span>
            ))}
          </div>

          <div className={styles.briefTop}>
            <p className={styles.briefEyebrow}>
              60-second brief
              <span aria-hidden="true">·</span>
              <span className={styles.briefClock}>{formatRemaining(index, progress)}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              className={styles.briefClose}
              onClick={close}
              aria-label="Close brief"
            >
              <span aria-hidden="true">Close ✕</span>
            </button>
          </div>

          {/* Tap zones: left = previous, right = next. */}
          <button
            type="button"
            className={`${styles.briefZone} ${styles.briefZoneLeft}`}
            aria-label="Previous"
            tabIndex={-1}
            onClick={() => goTo(index - 1)}
          />
          <button
            type="button"
            className={`${styles.briefZone} ${styles.briefZoneRight}`}
            aria-label="Next"
            tabIndex={-1}
            onClick={() => goTo(index + 1)}
          />

          <div className={styles.briefBody} key={index}>
            <p className={styles.briefKicker}>
              {String(index + 1).padStart(2, "0")} · {chapter.kicker}
            </p>
            <h2 id="recruiter-brief-title" className={styles.briefTitle}>
              {chapter.title}
            </h2>

            {chapter.lines ? (
              <div className={styles.briefLines}>
                {chapter.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            ) : null}

            {chapter.kind === "proof" ? (
              <dl className={styles.briefProof}>
                {proofPoints.map((metric) => (
                  <div key={`${metric.project}-${metric.value}-${metric.label}`}>
                    <dt>{metric.value}</dt>
                    <dd>
                      {metric.label}
                      <span>{metric.project}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {chapter.kind === "cta" ? (
              <div className={styles.briefCta}>
                <p className={styles.briefAvail}>
                  {RECRUITER_PROFILE.location} · {RECRUITER_PROFILE.availability} ·{" "}
                  {RECRUITER_PROFILE.relocation}
                </p>
                <div className={styles.briefCtaLinks}>
                  <a
                    className={styles.briefCtaPrimary}
                    href={`mailto:${RECRUITER_PROFILE.email}`}
                  >
                    <ContactIcon name="email" className={styles.briefCtaIcon} />
                    Email me
                  </a>
                  <a className={styles.briefResume} href={RECRUITER_PROFILE.resume} download>
                    <DownloadIcon />
                    Résumé
                  </a>
                  <a
                    className={styles.briefIconBtn}
                    href={RECRUITER_PROFILE.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <ContactIcon name="linkedin" className={styles.briefCtaIcon} />
                  </a>
                  <a
                    className={styles.briefIconBtn}
                    href={RECRUITER_PROFILE.upwork}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Upwork"
                  >
                    <ContactIcon name="upwork" className={styles.briefCtaIcon} />
                  </a>
                  <a
                    className={styles.briefIconBtn}
                    href={RECRUITER_PROFILE.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                  >
                    <ContactIcon name="github" className={styles.briefCtaIcon} />
                  </a>
                  <a
                    className={styles.briefIconBtn}
                    href={`https://wa.me/${WHATSAPP_WA_ME_DIGITS}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                  >
                    <ContactIcon name="whatsapp" className={styles.briefCtaIcon} />
                  </a>
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.briefControls}>
            <button
              type="button"
              className={styles.briefCtrl}
              onClick={() => goTo(index - 1)}
              aria-label="Previous"
              disabled={index === 0}
            >
              ‹ Prev
            </button>
            <button
              type="button"
              className={styles.briefPlay}
              onClick={togglePlay}
              aria-label={finished ? "Replay" : playing ? "Pause" : "Play"}
            >
              {finished ? "↻ Replay" : playing ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button
              type="button"
              className={styles.briefCtrl}
              onClick={() => goTo(index + 1)}
              aria-label="Next"
              disabled={index === TOTAL - 1}
            >
              Next ›
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
