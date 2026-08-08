import type { CanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";

export const ENGINEERING_CASE_STUDY_SECTION_ORDER = [
  "system-in-one-sentence",
  "production-evidence",
  "constraint",
  "difficulty",
  "architecture-flow",
  "critical-decisions",
  "failure-recovery",
  "ownership",
  "production-outcome",
  "improvements-next",
] as const;

export type EngineeringCaseStudySectionId =
  (typeof ENGINEERING_CASE_STUDY_SECTION_ORDER)[number];

export type ConfirmableText =
  | { status: "confirmed"; value: string }
  | { status: "needs-confirmation"; prompt: string };

export interface EngineeringDecisionFoundation {
  decision: ConfirmableText;
  whyNecessary: ConfirmableText;
  alternativeConsidered: ConfirmableText;
  tradeOffAccepted: ConfirmableText;
}

export interface EngineeringCaseStudyFoundation {
  slug: CanonicalProjectSlug;
  title: string;
  systemInOneSentence: ConfirmableText;
  productionEvidence: readonly ConfirmableText[];
  constraint: ConfirmableText;
  difficulty: ConfirmableText;
  architectureAndFlow: ConfirmableText;
  criticalDecisions: readonly EngineeringDecisionFoundation[];
  failureAndRecovery: ConfirmableText;
  ownership: ConfirmableText;
  productionOutcome: ConfirmableText;
  improvementsNext: ConfirmableText;
}

export const SELECTED_SYSTEM_CASE_STUDY_SLUGS = [
  "warqah-store",
  "smart-lockers-platform",
  "your-obour-guide",
  "nabd",
] as const satisfies readonly CanonicalProjectSlug[];

export type SelectedSystemCaseStudySlug =
  (typeof SELECTED_SYSTEM_CASE_STUDY_SLUGS)[number];

const confirmed = (value: string): ConfirmableText => ({ status: "confirmed", value });
const needsConfirmation = (prompt: string): ConfirmableText => ({
  status: "needs-confirmation",
  prompt,
});

export const ENGINEERING_CASE_STUDY_FOUNDATIONS = {
  "warqah-store": {
    slug: "warqah-store",
    title: "Warqah Store",
    systemInOneSentence: confirmed(
      "An e-commerce backend built to stay predictable while order volume becomes unpredictable.",
    ),
    productionEvidence: [
      confirmed("EGP 21M+ in sales"),
      confirmed("100K+ orders processed"),
      confirmed("90K+ registered customers"),
      confirmed("10K-order peak days"),
    ],
    constraint: confirmed(
      "Burst traffic and expensive order workflows must not make customer-facing operations unresponsive.",
    ),
    difficulty: confirmed(
      "Orders, inventory, payments, shipping, queues, and deployment health affect the same commercial lifecycle but fail independently.",
    ),
    architectureAndFlow: confirmed(
      "Laravel owns order state while Redis-backed queues move expensive payment, inventory, fulfillment, and integration work outside request handling.",
    ),
    criticalDecisions: [
      {
        decision: confirmed("Separate expensive commercial workflows from synchronous requests."),
        whyNecessary: confirmed("Customer requests must stay responsive during burst traffic."),
        alternativeConsidered: needsConfirmation(
          "Confirm the main alternative evaluated before queue-backed processing was selected.",
        ),
        tradeOffAccepted: needsConfirmation(
          "Confirm the operational complexity accepted in exchange for asynchronous processing.",
        ),
      },
    ],
    failureAndRecovery: confirmed(
      "Queues, caching, deployment ownership, and operational recovery keep background failures visible and recoverable without corrupting order state.",
    ),
    ownership: confirmed(
      "Backend and production infrastructure ownership across order processing, database performance, queues, caching, deployments, and operational recovery.",
    ),
    productionOutcome: confirmed(
      "The platform sustained verified sales, order, and customer volume through live commercial operations.",
    ),
    improvementsNext: needsConfirmation(
      "Confirm the next reliability or scaling improvement that would deliver the highest production value.",
    ),
  },
  "smart-lockers-platform": {
    slug: "smart-lockers-platform",
    title: "Smart Lockers",
    systemInOneSentence: confirmed(
      "A payment-to-device command system where a backend decision opens a physical locker.",
    ),
    productionEvidence: [
      confirmed("Production reusable locker-control platform"),
      confirmed("Laravel, Python, MQTT, and Raspberry Pi execution boundary"),
    ],
    constraint: confirmed(
      "A command crosses payment, cloud, network, and physical-device boundaries before success can be confirmed.",
    ),
    difficulty: confirmed(
      "Software success does not prove physical execution; timeouts, duplicate commands, lost acknowledgements, and partial recovery remain possible.",
    ),
    architectureAndFlow: confirmed(
      "QR scanning, product validation, payment state, and facility rules resolve into an MQTT command executed by Raspberry Pi-controlled lockers and reconciled through acknowledgements.",
    ),
    criticalDecisions: [
      {
        decision: confirmed("Model device work as an explicit command lifecycle."),
        whyNecessary: confirmed(
          "Every command must remain traceable across queued delivery and physical execution.",
        ),
        alternativeConsidered: needsConfirmation(
          "Confirm whether direct synchronous device control was formally evaluated.",
        ),
        tradeOffAccepted: needsConfirmation(
          "Confirm the latency or operational trade-off accepted for traceability and recovery.",
        ),
      },
    ],
    failureAndRecovery: confirmed(
      "Idempotency, timeouts, acknowledgements, explicit command states, and safe retries protect the physical workflow from uncertain delivery.",
    ),
    ownership: confirmed(
      "Platform architecture and full-stack delivery across tenant APIs, command orchestration, MQTT, machine-side Python, and callbacks.",
    ),
    productionOutcome: confirmed(
      "A reusable control plane separates business applications from locker and device execution.",
    ),
    improvementsNext: needsConfirmation(
      "Confirm the next observability, fleet-management, or device-recovery improvement.",
    ),
  },
  "your-obour-guide": {
    slug: "your-obour-guide",
    title: "Your Obour Guide",
    systemInOneSentence: confirmed(
      "A city guide built end to end - from raw location data to a production mobile product.",
    ),
    productionEvidence: [
      confirmed("7,000+ location records processed"),
      confirmed("Flutter, Laravel, and Next.js delivery surfaces"),
      confirmed("Bilingual product architecture"),
      confirmed("Signed CDN media delivery"),
    ],
    constraint: confirmed(
      "Thousands of raw geographic records must become searchable, bilingual, moderated local listings across mobile and web surfaces.",
    ),
    difficulty: confirmed(
      "Data quality, geospatial discovery, translation, moderation, media delivery, and release operations belong to one product lifecycle.",
    ),
    architectureAndFlow: confirmed(
      "A Laravel backend and administration workflow normalize place data for Flutter and Next.js clients while signed CDN delivery protects public media access.",
    ),
    criticalDecisions: [
      {
        decision: confirmed("Treat the place-data pipeline as a product foundation, not an import script."),
        whyNecessary: confirmed(
          "Search, bilingual content, moderation, and delivery all depend on normalized records.",
        ),
        alternativeConsidered: needsConfirmation(
          "Confirm the alternative data-source or ingestion approach considered.",
        ),
        tradeOffAccepted: needsConfirmation(
          "Confirm the delivery-speed trade-off accepted for stronger data quality and moderation.",
        ),
      },
    ],
    failureAndRecovery: needsConfirmation(
      "Document import recovery, moderation rollback, media failure, and client synchronization paths.",
    ),
    ownership: confirmed(
      "Product, brand, backend, Flutter app, public website, data pipeline, administration, media, deployment, and release operations.",
    ),
    productionOutcome: confirmed(
      "Raw geographic records became a searchable bilingual city-discovery product across mobile and web.",
    ),
    improvementsNext: needsConfirmation(
      "Confirm the next product, data-quality, or discovery improvement after launch readiness.",
    ),
  },
  nabd: {
    slug: "nabd",
    title: "NABD Commerce Automation",
    systemInOneSentence: confirmed(
      "A multi-merchant automation platform built around unreliable external events.",
    ),
    productionEvidence: [
      confirmed("200 registered merchants"),
      confirmed("20K+ monthly orders"),
      confirmed("12M+ SAR order value"),
      confirmed("Webhook failures reduced from 30-40% to near zero"),
    ],
    constraint: confirmed(
      "External commerce events may be duplicated, delayed, missing, or malformed before merchant-specific automation runs.",
    ),
    difficulty: confirmed(
      "Receiving a webhook is easy; preventing uncertain input from silently corrupting downstream customer and operational workflows is not.",
    ),
    architectureAndFlow: confirmed(
      "External events enter a normalization boundary, pass through merchant-specific rules, and trigger queue-backed operational and communication workflows.",
    ),
    criticalDecisions: [
      {
        decision: confirmed("Normalize and identify events before applying merchant automation."),
        whyNecessary: confirmed(
          "Duplicate or malformed provider payloads must not become duplicate downstream actions.",
        ),
        alternativeConsidered: needsConfirmation(
          "Confirm the provider-specific processing alternative considered.",
        ),
        tradeOffAccepted: needsConfirmation(
          "Confirm the storage or latency trade-off accepted for idempotency and replay safety.",
        ),
      },
    ],
    failureAndRecovery: confirmed(
      "Idempotent event handling, queue isolation, validation, retry boundaries, and observable recovery protect downstream automation.",
    ),
    ownership: needsConfirmation(
      "Confirm the exact personal ownership boundary across product, backend, integrations, infrastructure, and operations.",
    ),
    productionOutcome: confirmed(
      "Webhook failure rates fell from 30-40% to near zero across multi-merchant commerce automation.",
    ),
    improvementsNext: needsConfirmation(
      "Confirm the next provider-resilience, replay, or merchant-observability improvement.",
    ),
  },
} as const satisfies Record<SelectedSystemCaseStudySlug, EngineeringCaseStudyFoundation>;
