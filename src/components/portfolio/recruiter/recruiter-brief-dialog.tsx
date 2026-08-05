"use client";

import { useEffect, useRef } from "react";

import { RECRUITER_CORE_STACK, RECRUITER_PROFILE } from "@/lib/portfolio/recruiter-profile";
import type { PublicVerifiedMetric } from "@/lib/portfolio/projects/types";
import styles from "@/styles/portfolio/recruiter-experience.module.scss";

export function RecruiterBriefDialog({
  proofPoints,
}: {
  proofPoints: Array<PublicVerifiedMetric & { project: string }>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousOverflowRef = useRef("");

  const close = () => {
    dialogRef.current?.close();
    document.body.style.overflow = previousOverflowRef.current;
    triggerRef.current?.focus({ preventScroll: true });
  };

  const open = () => {
    dialogRef.current?.showModal();
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      if (dialogRef.current?.open) closeButtonRef.current?.focus();
    });
  };

  useEffect(
    () => () => {
      document.body.style.overflow = previousOverflowRef.current;
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
        <span>VIEW MY 60-SECOND BRIEF</span>
        <span aria-hidden="true">01:00</span>
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
        <div className={styles.briefPanel}>
          <header className={styles.briefHeader}>
            <div>
              <p>RECRUITER ENGINEERING BRIEF / ONE MINUTE</p>
              <h2 id="recruiter-brief-title">What I can own from day one.</h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.briefClose}
              onClick={close}
              aria-label="Close brief"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <div className={styles.briefGrid}>
            <section aria-labelledby="brief-target">
              <p className={styles.briefIndex}>01 / TARGET</p>
              <h3 id="brief-target">Senior backend ownership</h3>
              <ul>
                {RECRUITER_PROFILE.targetRoles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
              <p>{RECRUITER_PROFILE.identity}</p>
            </section>

            <section aria-labelledby="brief-ownership">
              <p className={styles.briefIndex}>02 / WHAT I OWN</p>
              <h3 id="brief-ownership">Beyond implementation</h3>
              <ul className={styles.briefInlineList}>
                {[
                  "Architecture",
                  "Backend",
                  "Integrations",
                  "Infrastructure",
                  "Deployment",
                  "Production operations",
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.briefProof} aria-labelledby="brief-proof">
              <p className={styles.briefIndex}>03 / PROOF IN PRODUCTION</p>
              <h3 id="brief-proof">Verified operating evidence</h3>
              <dl>
                {proofPoints.map((metric) => (
                  <div key={`${metric.project}-${metric.value}-${metric.label}`}>
                    <dt>{metric.value}</dt>
                    <dd>
                      {metric.label} <span>{metric.project}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="brief-founder">
              <p className={styles.briefIndex}>04 / OWNERSHIP MODEL</p>
              <h3 id="brief-founder">Founder, builder, operator</h3>
              <p>
                Founder-built products sit beside systems built entirely by me and client
                platforms where I owned backend, infrastructure, integrations, or delivery.
              </p>
            </section>

            <section aria-labelledby="brief-stack">
              <p className={styles.briefIndex}>05 / CORE STACK</p>
              <h3 id="brief-stack">The useful eight</h3>
              <ul className={styles.briefStack}>
                {RECRUITER_CORE_STACK.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section
              className={styles.briefAvailability}
              aria-labelledby="brief-availability"
            >
              <p className={styles.briefIndex}>06 / AVAILABILITY</p>
              <h3 id="brief-availability">Where I can work</h3>
              <div className={styles.briefAvailabilityMeta}>
                <p>{RECRUITER_PROFILE.location}</p>
                <p>{RECRUITER_PROFILE.availability}</p>
                <p>{RECRUITER_PROFILE.relocation}</p>
              </div>
            </section>
          </div>

          <footer className={styles.briefActions}>
            <a href={RECRUITER_PROFILE.resume} download>
              Download Resume
            </a>
            <a href={RECRUITER_PROFILE.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={RECRUITER_PROFILE.upwork} target="_blank" rel="noreferrer">
              Upwork
            </a>
            <a href={`mailto:${RECRUITER_PROFILE.email}`}>Contact Me</a>
            <a href="/v2/work">Explore Systems</a>
          </footer>
        </div>
      </dialog>
    </>
  );
}
