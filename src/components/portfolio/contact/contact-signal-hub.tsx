"use client";

import { useEffect, useRef } from "react";

import {
  formatPhoneDisplay,
  RECRUITER_PROFILE,
  WHATSAPP_WA_ME_DIGITS,
} from "@/lib/portfolio/recruiter-profile";
import styles from "@/styles/portfolio/contact-signal-hub.module.scss";

import { ContactIcon, type ContactIconName } from "./contact-icons";

interface ContactEndpoint {
  readonly key: string;
  readonly channel: string;
  readonly icon: ContactIconName;
  readonly name: string;
  /** Destination handle / number shown under the name. */
  readonly handle: string;
  readonly href: string;
  /** External web profiles open in a new tab; tel:/mailto: stay in place. */
  readonly external: boolean;
  /** Full accessible name for the icon-forward link. */
  readonly label: string;
}

const PHONE_DISPLAY = formatPhoneDisplay(RECRUITER_PROFILE.phone);
const WHATSAPP_DISPLAY = formatPhoneDisplay(RECRUITER_PROFILE.whatsapp);

/**
 * Every destination is derived from the single canonical RECRUITER_PROFILE
 * source — no contact value is hardcoded a second time here.
 */
const ENDPOINTS: readonly ContactEndpoint[] = [
  {
    key: "upwork",
    channel: "01",
    icon: "upwork",
    name: "Upwork",
    handle: "Top Rated · Verified",
    href: RECRUITER_PROFILE.upwork,
    external: true,
    label: "Upwork profile, Top Rated and verified (opens in a new tab)",
  },
  {
    key: "linkedin",
    channel: "02",
    icon: "linkedin",
    name: "LinkedIn",
    handle: "in/alkady22",
    href: RECRUITER_PROFILE.linkedin,
    external: true,
    label: "LinkedIn profile (opens in a new tab)",
  },
  {
    key: "github",
    channel: "03",
    icon: "github",
    name: "GitHub",
    handle: "Phoenix-H22",
    href: RECRUITER_PROFILE.github,
    external: true,
    label: "GitHub profile (opens in a new tab)",
  },
  {
    key: "whatsapp",
    channel: "04",
    icon: "whatsapp",
    name: "WhatsApp",
    handle: WHATSAPP_DISPLAY,
    href: `https://wa.me/${WHATSAPP_WA_ME_DIGITS}`,
    external: true,
    label: `Message on WhatsApp at ${WHATSAPP_DISPLAY} (opens in a new tab)`,
  },
  {
    key: "phone",
    channel: "05",
    icon: "phone",
    name: "Direct line",
    handle: PHONE_DISPLAY,
    href: `tel:${RECRUITER_PROFILE.phone}`,
    external: false,
    label: `Call the direct line at ${PHONE_DISPLAY}`,
  },
  {
    key: "email",
    channel: "06",
    icon: "email",
    name: "Email",
    handle: RECRUITER_PROFILE.email,
    href: `mailto:${RECRUITER_PROFILE.email}`,
    external: false,
    label: `Email ${RECRUITER_PROFILE.email}`,
  },
];

export function ContactSignalHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);

  // The entrance reveal and the signature year only drive CSS / DOM text, so
  // they are applied imperatively to the node (the intended use of an effect —
  // synchronising React with an external system) rather than via React state.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (yearRef.current) {
      yearRef.current.textContent = ` · ${new Date().getFullYear()}`;
    }

    if (typeof IntersectionObserver === "undefined") {
      el.dataset.revealed = "true";
      return;
    }

    // Arm the pre-reveal hidden state only now that JS is confirmed present, so
    // no-JS / SSR always renders fully visible content.
    el.dataset.armed = "true";

    // A single (non-per-frame) measurement: if the hub is already on screen —
    // e.g. a /v2#contact deep link — reveal without waiting for the observer.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      el.dataset.revealed = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.revealed = "true";
            observer.disconnect();
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={styles.hub}
      aria-labelledby="contact-title"
    >
      <div className={styles.inner}>
        <div className={styles.editorial}>
          <p className={styles.eyebrow}>CONTACT / OPEN CHANNEL</p>
          <h2 id="contact-title" className={styles.headline}>
            Let&apos;s build something{" "}
            <span className={styles.headlineAccent}>
              that has to survive production.
            </span>
          </h2>
          <p className={styles.lede}>
            Available for senior backend and backend-focused full-stack
            opportunities, production systems, integrations, and ambitious
            products.
          </p>
        </div>

        <div className={styles.channel}>
          <div className={styles.core}>
            <p className={styles.coreTitle}>
              <span className={styles.coreMark}>ALKADY</span>
              <span className={styles.coreSlash}> / </span>CONNECTION ROUTER
            </p>
            <dl className={styles.coreReadout}>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={styles.statusDot} aria-hidden="true" />
                  Available
                </dd>
              </div>
              <div>
                <dt>Base</dt>
                <dd>{RECRUITER_PROFILE.location}</dd>
              </div>
              <div>
                <dt>Remote</dt>
                <dd>Open</dd>
              </div>
              <div>
                <dt>Relocation</dt>
                <dd>KSA · UAE</dd>
              </div>
            </dl>
          </div>

          <ul className={styles.endpoints} aria-label="Contact channels">
            {ENDPOINTS.map((endpoint, index) => (
              <li
                key={endpoint.key}
                className={styles.endpointItem}
                style={{ "--endpoint-index": index } as React.CSSProperties}
              >
                <a
                  className={styles.endpoint}
                  data-endpoint={endpoint.key}
                  href={endpoint.href}
                  aria-label={endpoint.label}
                  {...(endpoint.external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                >
                  <span className={styles.port} aria-hidden="true">
                    <span className={styles.portRoute} />
                    <span className={styles.portNode}>
                      <ContactIcon name={endpoint.icon} className={styles.icon} />
                    </span>
                  </span>
                  <span className={styles.endpointBody}>
                    <span className={styles.endpointName}>{endpoint.name}</span>
                    <span className={styles.endpointHandle}>{endpoint.handle}</span>
                  </span>
                  <span className={styles.endpointMeta} aria-hidden="true">
                    <span className={styles.channelTag}>{endpoint.channel}</span>
                    <span className={styles.endpointGlyph}>
                      {endpoint.external ? "↗" : "→"}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className={styles.signature}>
        Designed and engineered by{" "}
        <span className={styles.signatureName}>{RECRUITER_PROFILE.name}</span>
        <span ref={yearRef} className={styles.signatureYear} />
      </p>
    </section>
  );
}
