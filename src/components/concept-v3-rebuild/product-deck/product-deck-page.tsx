"use client";

import Image from "next/image";

import type { ProductDeckItem } from "@/components/concept-v3-rebuild/product-deck/types";
import styles from "@/styles/concept-v3-rebuild/product-deck.module.scss";

interface ProductDeckPageProps {
  item: ProductDeckItem;
  active?: boolean;
}

export function ProductDeckPage({ item, active = false }: ProductDeckPageProps) {
  return (
    <article
      className={styles.page}
      data-deck-page={item.id}
      data-visual={item.visualType}
      data-active={active ? "true" : undefined}
      aria-hidden={!active}
    >
      <div className={styles.pageShadow} data-deck-shadow aria-hidden="true" />
      <div
        className={styles.pageThickness}
        data-deck-thickness
        aria-hidden="true"
      />
      <div
        className={styles.pageFace}
        data-deck-face
        data-silhouette={active ? "false" : "true"}
      >
        <div className={styles.pageEdge} aria-hidden="true" />
        <div
          className={styles.pageSheen}
          data-deck-sheen
          aria-hidden="true"
        />
        <header className={styles.pageHeader}>
          {item.logo ? (
            <Image
              src={item.logo}
              alt=""
              width={40}
              height={40}
              className={styles.pageLogo}
            />
          ) : (
            <span className={styles.pageLogoFallback} aria-hidden="true">
              {item.title.slice(0, 1)}
            </span>
          )}
          <div className={styles.pageCopy}>
            <h3 className={styles.pageTitle}>{item.title}</h3>
            <p className={styles.pageSubtitle}>{item.subtitle}</p>
          </div>
          {item.status ? (
            <span className={styles.pageStatus} data-page-status>
              {item.status}
            </span>
          ) : null}
        </header>

        <div className={styles.pageVisual} aria-hidden="true">
          {item.visualType === "city-guide" ? <CityGuideVisual /> : null}
          {item.visualType === "vending" ? <VendingVisual /> : null}
          {item.visualType === "messaging" ? <MessagingVisual /> : null}
        </div>

        {item.description ? (
          <p className={styles.pageDescription}>{item.description}</p>
        ) : null}
      </div>
    </article>
  );
}

function CityGuideVisual() {
  return (
    <div className={styles.cityGuide}>
      <div className={styles.cityDevice}>
        <div className={styles.cityScreen}>
          <span className={styles.cityGrid} />
          <svg className={styles.cityRoute} viewBox="0 0 100 120" aria-hidden="true">
            <path
              data-reveal-route
              d="M18 92 C30 68, 42 74, 52 52 S72 28, 84 40"
              fill="none"
              stroke="#8fb0ff"
              strokeWidth="2"
            />
            <g data-reveal-pin>
              <circle
                cx="52"
                cy="52"
                r="11"
                fill="none"
                stroke="#a8c0ff"
                strokeWidth="1.2"
              />
              <path
                d="M52 38 C46 38 42 42.5 42 48 C42 56 52 68 52 68 S62 56 62 48 C62 42.5 58 38 52 38 Z"
                fill="#6b8fff"
              />
              <circle cx="52" cy="48" r="3" fill="#0b1220" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function VendingVisual() {
  return (
    <div className={styles.vending}>
      <div className={styles.vendingBody}>
        <div className={styles.vendingScreen}>
          <span className={styles.vendingQr} />
          <span className={styles.vendingScan} data-reveal-scan aria-hidden="true" />
          <span
            className={styles.vendingLight}
            data-reveal-light
            data-vending-light
          />
        </div>
        <div className={styles.vendingSlots}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.vendingBay} data-reveal-bay />
      </div>
    </div>
  );
}

function MessagingVisual() {
  return (
    <div className={styles.messaging}>
      <svg className={styles.messagingGraph} viewBox="0 0 180 72" aria-hidden="true">
        <circle cx="24" cy="36" r="5" fill="#f2b84f" />
        <circle cx="90" cy="24" r="4.5" fill="#31e6d0" />
        <circle
          cx="150"
          cy="42"
          r="5"
          fill="#31e6d0"
          data-reveal-delivered
          data-nabd-delivered
        />
        <path
          d="M30 36 C50 36, 64 24, 90 24"
          fill="none"
          stroke="#f2b84f"
          strokeWidth="1.6"
        />
        <path
          data-reveal-wave
          data-nabd-wave
          d="M96 24 C116 24, 130 42, 150 42"
          fill="none"
          stroke="#31e6d0"
          strokeWidth="1.8"
        />
        <path
          d="M24 52 C48 62, 78 44, 108 56 S148 58, 168 48"
          fill="none"
          stroke="#31e6d0"
          strokeWidth="1.3"
          opacity="0.45"
        />
      </svg>
    </div>
  );
}
