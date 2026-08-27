import type { CanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";

export interface AdaptiveStackLensMode {
  id: "commerce" | "connected" | "product" | "automation";
  index: string;
  label: string;
  slug: CanonicalProjectSlug;
  caseStudyHref: string;
  accent: "signal" | "cool" | "mint" | "green";
  title: string;
  category: string;
  description: string;
  metadata: readonly [
    { label: string; value: string },
    { label: string; value: string },
  ];
}

export interface AdaptiveStackLensDto extends AdaptiveStackLensMode {
  technologies: readonly string[];
}

export const ADAPTIVE_STACK_LENS_MODES = [
  {
    id: "commerce",
    index: "01",
    label: "WARQAH STORE",
    slug: "warqah-store",
    caseStudyHref: "/projects/warqah-store",
    accent: "signal",
    title: "Warqah Store",
    category: "COMMERCE AT SCALE",
    description:
      "A high-volume commerce platform engineered to stay responsive during unpredictable order spikes.",
    metadata: [
      {
        label: "ENGINEERING FOCUS",
        value: "Burst-safe order processing and infrastructure",
      },
      { label: "PRODUCTION PROOF", value: "100K+ orders · 90K+ customers" },
    ],
  },
  {
    id: "connected",
    index: "02",
    label: "SMART LOCKERS",
    slug: "smart-lockers-platform",
    caseStudyHref: "/projects/smart-lockers-platform",
    accent: "cool",
    title: "Smart Medication Lockers",
    category: "CONNECTED SYSTEMS",
    description:
      "A payment-to-device platform that safely controls physical medication lockers.",
    metadata: [
      { label: "SYSTEM FLOW", value: "QR → Payment → MQTT → Device" },
      {
        label: "ENGINEERING FOCUS",
        value: "Traceable commands and safe recovery",
      },
    ],
  },
  {
    id: "product",
    index: "03",
    label: "YOUR OBOUR GUIDE",
    slug: "your-obour-guide",
    caseStudyHref: "/projects/your-obour-guide",
    accent: "mint",
    title: "Your Obour Guide",
    category: "FOUNDER-BUILT PRODUCT",
    description:
      "A bilingual local-discovery product built from raw geographic data through production launch.",
    metadata: [
      {
        label: "PRODUCT SCOPE",
        value: "Backend · Flutter · Web · Data pipeline",
      },
      { label: "PRODUCTION PROOF", value: "7K+ locations processed" },
    ],
  },
  {
    id: "automation",
    index: "04",
    label: "NABD",
    slug: "nabd",
    caseStudyHref: "/projects/nabd",
    accent: "green",
    title: "NABD Commerce Automation",
    category: "EVENT-DRIVEN PLATFORM",
    description:
      "Reliable commerce automation built around external events and merchant-specific workflows.",
    metadata: [
      {
        label: "ENGINEERING FOCUS",
        value: "Webhook reliability and recovery",
      },
      {
        label: "PRODUCTION PROOF",
        value: "200+ merchants · 20K+ monthly orders",
      },
    ],
  },
] as const satisfies readonly AdaptiveStackLensMode[];

export const DEFAULT_ADAPTIVE_STACK_LENS_SLUG = "smart-lockers-platform";
