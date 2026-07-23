"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { SelectedSystemCardProps } from "@/components/portfolio/selected-systems/selected-system-types";
import { useMotionPreference } from "@/lib/motion-preference-context";
import styles from "@/styles/portfolio/selected-systems.module.scss";

gsap.registerPlugin(ScrollTrigger);

interface SelectedSystemsExperienceProps {
  projects: SelectedSystemCardProps[];
}

function DomainLabel({ domains }: { domains: string[] }) {
  return (
    <p className={styles.domain}>
      {domains.join(" · ")}
    </p>
  );
}

function TechLine({ technologies }: { technologies: string[] }) {
  if (!technologies.length) return null;
  return (
    <p className={styles.tech}>
      {technologies.join(" · ")}
    </p>
  );
}

function FlagshipScene({ project }: { project: SelectedSystemCardProps }) {
  return (
    <article className={`${styles.project} ${styles.flagship}`} data-system-scene="flagship">
      <div className={styles.flagshipEditorial}>
        <DomainLabel domains={project.domains} />
        <h3 className={styles.projectTitle}>{project.title}</h3>
        {project.companyName ? (
          <p className={styles.company}>{project.companyName}</p>
        ) : null}
        <p className={styles.proposition}>{project.summary}</p>
        <p className={styles.ownership}>
          <span className={styles.ownershipLabel}>Owned</span>
          {project.ownershipSummary}
        </p>
        {project.strongestProof ? (
          <p className={styles.proof}>
            <span className={styles.proofValue}>{project.strongestProof.value}</span>
            <span className={styles.proofLabel}>{project.strongestProof.label}</span>
          </p>
        ) : null}
        {project.confidentialityLabel ? (
          <p className={styles.safeNote}>{project.confidentialityLabel}</p>
        ) : null}
        <TechLine technologies={project.technologies} />
      </div>
      <div className={styles.flagshipVisual} aria-hidden="true">
        <ol className={styles.route}>
          {[
            "Commerce events",
            "Webhook intake",
            "Normalization",
            "Operational states",
            "Reconciliation",
          ].map((label) => (
            <li key={label} className={styles.routeStep} data-route-step>
              <span className={styles.routeDot} />
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function NabdScene({ project }: { project: SelectedSystemCardProps }) {
  return (
    <article className={`${styles.project} ${styles.nabd}`} data-system-scene="nabd">
      <div className={styles.supportHeader}>
        {project.logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.logo}
            src={project.logoSrc}
            alt=""
            width={48}
            height={48}
          />
        ) : null}
        <div>
          <DomainLabel domains={project.domains} />
          <h3 className={styles.projectTitle}>{project.title}</h3>
        </div>
      </div>
      <p className={styles.proposition}>{project.summary}</p>
      <p className={styles.ownership}>{project.ownershipSummary}</p>
      <div className={styles.channelRouter} aria-hidden="true">
        <span className={styles.event} data-channel-event>
          Commerce event
        </span>
        <span className={styles.branch} />
        <ul className={styles.channels}>
          {["WhatsApp", "Telegram", "Email"].map((channel) => (
            <li key={channel} data-channel>
              {channel}
              <span className={styles.delivery}>routed</span>
            </li>
          ))}
        </ul>
      </div>
      <TechLine technologies={project.technologies} />
      {project.confidentialityLabel ? (
        <p className={styles.safeNote}>{project.confidentialityLabel}</p>
      ) : null}
    </article>
  );
}

function VendingScene({ project }: { project: SelectedSystemCardProps }) {
  return (
    <article className={`${styles.project} ${styles.vending}`} data-system-scene="vending">
      <DomainLabel domains={project.domains} />
      <h3 className={styles.projectTitle}>{project.title}</h3>
      <p className={styles.proposition}>{project.summary}</p>
      <p className={styles.ownership}>{project.ownershipSummary}</p>
      <ol className={styles.actionStack} aria-hidden="true">
        {[
          "QR request",
          "API validation",
          "Payment state",
          "Device command",
          "Dispense confirmation",
        ].map((step) => (
          <li key={step} data-vending-step>
            {step}
          </li>
        ))}
      </ol>
      <TechLine technologies={project.technologies} />
      {project.confidentialityLabel ? (
        <p className={styles.safeNote}>{project.confidentialityLabel}</p>
      ) : null}
    </article>
  );
}

function ClinicScene({ project }: { project: SelectedSystemCardProps }) {
  return (
    <article className={`${styles.project} ${styles.clinic}`} data-system-scene="clinic">
      <DomainLabel domains={project.domains} />
      <h3 className={styles.projectTitle}>{project.title}</h3>
      {project.strongestProof ? (
        <p className={styles.proof}>
          <span className={styles.proofValue}>{project.strongestProof.value}</span>
          <span className={styles.proofLabel}>{project.strongestProof.label}</span>
        </p>
      ) : null}
      <p className={styles.proposition}>{project.summary}</p>
      <p className={styles.ownership}>{project.ownershipSummary}</p>
      <ul className={styles.careLoop} aria-hidden="true">
        {[
          "Patient interaction",
          "Mobile / web client",
          "API layer",
          "AI workflow",
          "Hardware interaction",
        ].map((node) => (
          <li key={node} data-clinic-node>
            {node}
          </li>
        ))}
      </ul>
      <TechLine technologies={project.technologies} />
      {project.confidentialityLabel ? (
        <p className={styles.safeNote}>{project.confidentialityLabel}</p>
      ) : null}
    </article>
  );
}

export function SelectedSystemsExperience({
  projects,
}: SelectedSystemsExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const { effective } = useMotionPreference();

  const flagship = projects.find((p) => p.id === "merchant-operations-salla-automation");
  const nabd = projects.find((p) => p.id === "nabd-messaging-platform");
  const vending = projects.find((p) => p.id === "smart-vending-medication-dispensing");
  const clinic = projects.find((p) => p.id === "virtual-clinic-dr-robot");

  useEffect(() => {
    const root = rootRef.current;
    if (!root || effective === "reduced") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-system-scene]"),
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            once: true,
          },
        },
      );

      const steps = root.querySelectorAll("[data-route-step]");
      if (steps.length) {
        gsap.fromTo(
          steps,
          { autoAlpha: 0.35 },
          {
            autoAlpha: 1,
            duration: 0.35,
            stagger: 0.12,
            scrollTrigger: {
              trigger: root.querySelector('[data-system-scene="flagship"]'),
              start: "top 60%",
              once: true,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [effective]);

  return (
    <section
      ref={rootRef}
      id="selected-systems"
      className={styles.section}
      aria-labelledby="selected-systems-title"
      data-selected-systems
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>Selected Systems</p>
        <h2 id="selected-systems-title" className={styles.title}>
          Systems that had to work when it mattered.
        </h2>
        <p className={styles.lede}>
          Commerce, messaging, physical devices, and AI products built around
          real operational constraints.
        </p>
      </header>

      <div className={styles.stage}>
        {flagship ? <FlagshipScene project={flagship} /> : null}
        <div className={styles.supportRow}>
          {nabd ? <NabdScene project={nabd} /> : null}
          {vending ? <VendingScene project={vending} /> : null}
        </div>
        {clinic ? <ClinicScene project={clinic} /> : null}
      </div>
    </section>
  );
}
