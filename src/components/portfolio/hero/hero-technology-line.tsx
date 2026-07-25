"use client";

import styles from "@/styles/portfolio/hero-tech-line.module.scss";

interface HeroTechnologyLineProps {
  technologies: string[];
}

const EMPHASIS = new Set(["PHP", "Laravel"]);

/**
 * Core technology line for V2 Hero. Entrance stagger is owned by hero-motion
 * so timing stays attached to the identity reveal sequence.
 */
export function HeroTechnologyLine({ technologies }: HeroTechnologyLineProps) {
  return (
    <ul
      className={styles.line}
      data-hero-tech-line
      aria-label="Core technologies"
    >
      {technologies.map((tech, index) => (
        <li key={tech} className={styles.item} data-tech-item>
          {index > 0 ? (
            <span className={styles.sep} aria-hidden="true">
              ·
            </span>
          ) : null}
          <span
            className={EMPHASIS.has(tech) ? styles.techStrong : styles.tech}
          >
            {tech}
          </span>
        </li>
      ))}
    </ul>
  );
}
