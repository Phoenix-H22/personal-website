"use client";

import type { ProductDeckItem } from "@/components/concept-v3-rebuild/product-deck/types";
import styles from "@/styles/concept-v3-rebuild/product-deck.module.scss";

interface ProductDeckControlsProps {
  items: ProductDeckItem[];
  activeIndex: number;
  busy: boolean;
  autoplayActive: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

export function ProductDeckControls({
  items,
  activeIndex,
  busy,
  autoplayActive,
  onPrevious,
  onNext,
  onSelect,
}: ProductDeckControlsProps) {
  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.srOnlyControl}
        aria-label="Show previous project"
        disabled={busy}
        onClick={onPrevious}
      >
        Previous project
      </button>

      <div className={styles.indicators} role="tablist" aria-label="Products">
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={`Show ${item.title}`}
              className={styles.indicator}
              data-active={selected ? "true" : undefined}
              data-visual={item.visualType}
              disabled={busy}
              onClick={() => onSelect(index)}
            >
              {selected ? (
                <span
                  className={styles.indicatorProgress}
                  data-progress-active={autoplayActive ? "true" : undefined}
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.srOnlyControl}
        aria-label="Show next project"
        disabled={busy}
        onClick={onNext}
      >
        Next project
      </button>
    </div>
  );
}
