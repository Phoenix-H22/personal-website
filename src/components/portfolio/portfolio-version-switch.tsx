"use client";

import Link from "next/link";

import type { PortfolioVariant } from "@/lib/portfolio/portfolio-variant";
import { portfolioVariants } from "@/lib/portfolio/portfolio-variant";
import styles from "@/styles/portfolio/version-switch.module.scss";

interface PortfolioVersionSwitchProps {
  active: PortfolioVariant;
}

/**
 * Temporary development comparison control.
 * Route is the source of truth — no localStorage.
 * Not part of the portfolio design system or public navigation.
 */
export function PortfolioVersionSwitch({ active }: PortfolioVersionSwitchProps) {
  const current = portfolioVariants.current;
  const v2 = portfolioVariants.v2;

  return (
    <nav
      className={styles.switch}
      aria-label="Portfolio version comparison"
      data-portfolio-version-switch
    >
      <p className={styles.label}>Version</p>
      <div className={styles.group} role="group" aria-label="Select portfolio version">
        <Link
          href={current.route}
          className={[
            styles.option,
            active === "current" ? styles.optionActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-current={active === "current" ? "page" : undefined}
        >
          Current
        </Link>
        <Link
          href={v2.route}
          className={[
            styles.option,
            active === "v2" ? styles.optionActive : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-current={active === "v2" ? "page" : undefined}
        >
          V2
        </Link>
      </div>
    </nav>
  );
}
