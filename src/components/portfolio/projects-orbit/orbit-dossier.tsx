"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";

import { CASE_STUDY_SLUGS } from "@/lib/portfolio/case-studies";
import {
  ORBIT_SYSTEMS,
  statusTone,
  systemArchitecture,
  systemCover,
  type OrbitSystem,
} from "@/lib/portfolio/projects/orbit-systems";
import { formatIndex } from "@/components/portfolio/projects-orbit/orbit-utils";
import styles from "@/styles/portfolio/projects-orbit.module.scss";

interface OrbitDossierProps {
  system: OrbitSystem;
  onClose: () => void;
  onNext: () => void;
}

const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

function hasCaseStudy(slug: string): boolean {
  return (CASE_STUDY_SLUGS as readonly string[]).includes(slug);
}

export function OrbitDossier({ system, onClose, onNext }: OrbitDossierProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const globalIndex = ORBIT_SYSTEMS.findIndex((item) => item.slug === system.slug);
  const nextSystem = ORBIT_SYSTEMS[(globalIndex + 1) % ORBIT_SYSTEMS.length];
  const tone = statusTone(system.status);
  const caseStudyHref = hasCaseStudy(system.slug) ? `/v2/work/${system.slug}` : null;

  // Lock body scroll and move focus into the dialog while it is open.
  useEffect(() => {
    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousActive?.focus?.();
    };
  }, []);

  // Trap Tab focus within the dialog.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const facts: Array<{ label: string; value: string }> = [
    { label: "System type", value: system.systemType },
    { label: "Ownership", value: system.ownership },
    { label: "Status", value: system.status },
    { label: "Domain", value: system.domains.join(" / ") },
  ];

  return (
    <div className={styles.dossier}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close dossier"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.dialog}
        onKeyDown={onKeyDown}
      >
        <div className={styles.dialogCover}>
          <Image
            src={systemCover(system.slug)}
            alt={`${system.name} cover`}
            fill
            sizes="(max-width: 64rem) 100vw, 64rem"
          />
          <span className={styles.dialogCoverShade} aria-hidden="true" />
          <button ref={closeRef} type="button" className={styles.dialogClose} onClick={onClose}>
            Close ✕
          </button>
        </div>

        <div className={styles.dialogBody}>
          <div>
            <p className={styles.dossierMeta}>
              <span>Node {formatIndex(globalIndex)} / 13</span>
              <span
                className={styles.statusDot}
                data-tone={tone}
                data-founder={system.ownership === "Founder-built"}
                aria-hidden="true"
              />
              <span>{system.status}</span>
            </p>
            <h2 id={titleId} className={styles.dossierTitle}>
              {system.name}
            </h2>
          </div>

          <p className={styles.dossierSummary}>{system.summary}</p>

          <dl className={styles.factGrid}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.factCell}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.metricPanel}>
            <p className={styles.blockLabel}>Headline metric</p>
            <p className={styles.metricValue}>{system.metric}</p>
          </div>

          <div>
            <p className={styles.blockLabel}>Stack</p>
            <ul className={styles.techRow} aria-label={`${system.name} stack`}>
              {system.tech.map((tech) => (
                <li key={tech} className={styles.tech}>
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {system.hasArchitecture ? (
            <div>
              <p className={styles.archHead}>
                <span>System architecture</span>
                <span className={styles.line} aria-hidden="true" />
              </p>
              <div className={styles.archFrame}>
                <Image
                  src={systemArchitecture(system.slug)}
                  alt={`${system.name} architecture diagram`}
                  width={0}
                  height={0}
                  sizes="(max-width: 64rem) 100vw, 60rem"
                  className={styles.archImage}
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}

          <div className={styles.dossierActions}>
            {caseStudyHref ? (
              <Link className={styles.caseStudyLink} href={caseStudyHref} prefetch={false}>
                Read case study →
              </Link>
            ) : null}
            {system.website ? (
              <a
                className={styles.visitLink}
                href={`https://${system.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit {system.website} ↗
              </a>
            ) : (
              <span className={styles.privateNote}>
                {system.websiteNote ?? "Private / client-owned deployment"}
              </span>
            )}
            <button type="button" className={styles.nextButton} onClick={onNext}>
              Next: {nextSystem.name} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
