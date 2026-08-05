"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { InventoryProject } from "@/lib/portfolio/projects/inventory";
import { useMotionPreference } from "@/lib/motion-preference-context";
import styles from "@/styles/portfolio/systems-exhibition.module.scss";

gsap.registerPlugin(ScrollTrigger);

interface SystemsExhibitionExperienceProps {
  projects: InventoryProject[];
}

export function SystemsExhibitionExperience({
  projects,
}: SystemsExhibitionExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const headingId = useId();
  const { effective } = useMotionPreference();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || effective === "reduced") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-exhibit-item]"),
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            once: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [effective, projects]);

  const [flagship, ...rest] = projects;

  return (
    <section
      ref={rootRef}
      id="systems-exhibition"
      className={styles.section}
      aria-labelledby={headingId}
      data-systems-exhibition
    >
      <header className={styles.header} data-exhibit-item>
        <p className={styles.eyebrow}>Systems Exhibition</p>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Production systems in the field
          </h2>
          <p className={styles.count}>{projects.length} featured</p>
        </div>
        <p className={styles.lede}>
          Platforms, commerce infrastructure, connected devices, and product
          systems owned end-to-end — not concept decks.
        </p>
      </header>

      {flagship ? (
        <article
          className={`${styles.stage} ${styles.flagship}`}
          data-exhibit-item
          data-project-slug={flagship.slug}
        >
          <div className={styles.media}>
            <Image
              src={flagship.cover.src}
              alt={flagship.cover.alt}
              width={flagship.cover.width}
              height={flagship.cover.height}
              sizes="(max-width: 900px) 100vw, 58vw"
              className={styles.coverImage}
              priority
            />
          </div>
          <div className={styles.copy}>
            <p className={styles.index}>01</p>
            <p className={styles.category}>{flagship.primaryCategory}</p>
            <h3 className={styles.projectTitle}>{flagship.title}</h3>
            <p className={styles.tagline}>{flagship.shortTagline}</p>
            <p className={styles.role}>{flagship.role}</p>
            {flagship.keyMetrics ? (
              <p className={styles.impact}>{flagship.keyMetrics}</p>
            ) : null}
            <p className={styles.tech}>{flagship.technologies.join(" · ")}</p>
            <div className={styles.actions}>
              <Link className={styles.primaryLink} href="/projects">
                Browse all systems
              </Link>
              <span className={styles.reserved}>Case study route reserved</span>
            </div>
          </div>
        </article>
      ) : null}

      <div className={styles.rail}>
        {rest.map((project, index) => (
          <article
            key={project.id}
            className={styles.railCard}
            data-exhibit-item
            data-project-slug={project.slug}
          >
            <div className={styles.railMedia}>
              <Image
                src={(project.coverCard ?? project.cover).src}
                alt={(project.coverCard ?? project.cover).alt}
                width={(project.coverCard ?? project.cover).width}
                height={(project.coverCard ?? project.cover).height}
                sizes="(max-width: 900px) 100vw, 32vw"
                className={styles.coverImage}
                loading="lazy"
              />
            </div>
            <div className={styles.railCopy}>
              <p className={styles.index}>
                {String(index + 2).padStart(2, "0")}
              </p>
              <p className={styles.category}>{project.filterGroup.replace("-", " ")}</p>
              <h3 className={styles.railTitle}>{project.title}</h3>
              <p className={styles.tagline}>{project.shortTagline}</p>
              <p className={styles.role}>{project.role}</p>
              <p className={styles.tech}>{project.technologies.join(" · ")}</p>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.footer} data-exhibit-item>
        <Link className={styles.primaryLink} href="/projects">
          View the complete systems index
        </Link>
      </div>
    </section>
  );
}
