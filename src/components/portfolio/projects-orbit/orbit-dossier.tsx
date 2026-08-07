"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";

import { resolveDossier } from "@/lib/portfolio/projects/orbit-dossiers";
import {
  ORBIT_SYSTEMS,
  statusTone,
  systemArchitecture,
  systemCover,
  type OrbitSystem,
} from "@/lib/portfolio/projects/orbit-systems";
import { OrbitMechanicCard } from "@/components/portfolio/projects-orbit/orbit-mechanic-card";
import styles from "@/styles/portfolio/projects-orbit.module.scss";

interface OrbitDossierProps {
  system: OrbitSystem;
  onClose: () => void;
  onNext: () => void;
}

const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function OrbitDossier({ system, onClose, onNext }: OrbitDossierProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const globalIndex = ORBIT_SYSTEMS.findIndex((item) => item.slug === system.slug);
  const nextSystem = ORBIT_SYSTEMS[(globalIndex + 1) % ORBIT_SYSTEMS.length];
  const tone = statusTone(system.status);
  const dossier = resolveDossier(system);

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

  const meta: Array<{ label: string; value: string }> = [
    { label: "Role", value: dossier.role },
    ...(dossier.shipped ? [{ label: "Shipped", value: dossier.shipped }] : []),
    { label: "Stack", value: dossier.stackLine },
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
        <button ref={closeRef} type="button" className={styles.dialogClose} onClick={onClose}>
          Close ✕
        </button>

        <div className={styles.dialogBody}>
          {/* Header — identity, tagline, and the role / shipped / stack ledger. */}
          <header className={styles.dossierHeader}>
            <p className={styles.dossierMeta}>
              <span>{system.systemType}</span>
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
              <span className={styles.titleDot} aria-hidden="true">
                .
              </span>
            </h2>
            {dossier.tagline ? (
              <p className={styles.dossierTagline}>{dossier.tagline}</p>
            ) : null}
            <dl className={styles.dossierMetaRow}>
              {meta.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          {/* Preview — the product behind a browser chrome. */}
          <figure className={styles.preview}>
            <div className={styles.previewChrome}>
              <span className={styles.previewDots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {system.website ? (
                <a
                  className={styles.previewUrl}
                  href={`https://${system.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.livePip} aria-hidden="true" />
                  {system.website}
                  <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span className={styles.previewUrl} data-private="true">
                  {system.websiteNote ?? "Private / client-owned deployment"}
                </span>
              )}
            </div>
            <div className={styles.previewShot}>
              <Image
                src={systemCover(system.slug)}
                alt={`${system.name} cover`}
                fill
                sizes="(max-width: 64rem) 100vw, 64rem"
              />
            </div>
          </figure>

          {/* Act I — the challenge. */}
          {dossier.challenge ? (
            <section className={styles.act}>
              <p className={styles.actLabel}>Act I · The challenge</p>
              <p className={styles.actBody}>{dossier.challenge}</p>
            </section>
          ) : null}

          {/* Act II — what I built, alongside the numbers panel. */}
          <section className={styles.actGrid}>
            <div className={styles.act}>
              <p className={styles.actLabel}>Act II · What I built</p>
              <p className={styles.actBody}>{dossier.whatIBuilt}</p>
            </div>
            {dossier.numbers.length > 0 ? (
              <aside className={styles.numbersPanel}>
                <p className={styles.blockLabel}>By the numbers</p>
                <ul className={styles.numbersList}>
                  {dossier.numbers.slice(0, 3).map((number) => (
                    <li key={`${number.label}-${number.value}`} className={styles.numberItem}>
                      <span className={styles.numberValue}>{number.value}</span>
                      <span className={styles.numberLabel}>{number.label}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </section>

          {/* The cast — flip cards that explain how the system works. */}
          {dossier.mechanics.length > 0 ? (
            <section className={styles.cast}>
              <p className={styles.actLabel}>What actually makes it work</p>
              <p className={styles.castHint}>Read the card, then flip it to watch the mechanism run.</p>
              <div className={styles.castGrid}>
                {dossier.mechanics.map((mechanic) => (
                  <OrbitMechanicCard key={mechanic.code} slug={system.slug} mechanic={mechanic} />
                ))}
              </div>
            </section>
          ) : null}

          {/* System architecture — optional public diagram. */}
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

          {/* Actions — open live, deeper case study, and next system. */}
          <div className={styles.dossierActions}>
            {system.website ? (
              <a
                className={styles.openLive}
                href={`https://${system.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open live ↗
              </a>
            ) : null}
            <button type="button" className={styles.nextButton} onClick={onNext}>
              Next: {nextSystem.name} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
