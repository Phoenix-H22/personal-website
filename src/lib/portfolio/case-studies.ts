import type { CanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";

export const CASE_STUDY_SLUGS = [
  "smart-lockers-platform",
  "warqah-store",
  "autopay-eg",
] as const satisfies readonly CanonicalProjectSlug[];

export type CaseStudySlug = (typeof CASE_STUDY_SLUGS)[number];

interface CaseStudyDecision {
  heading: string;
  problem: string;
  boundary: string;
  effect: string;
}

interface CaseStudyPresentation {
  accent: "cyan" | "amber" | "blue";
  recruiterSummary: string;
  situation: string;
  constraints: readonly string[];
  decisions: readonly CaseStudyDecision[];
  failurePaths: readonly string[];
  outcome: string;
  architectureCaption: string;
  technologyRoles: Readonly<Record<string, string>>;
}

export const CASE_STUDY_PRESENTATION: Record<
  CaseStudySlug,
  CaseStudyPresentation
> = {
  "smart-lockers-platform": {
    accent: "cyan",
    recruiterSummary:
      "A reusable multi-tenant control plane that keeps business applications separate from locker and device execution.",
    situation:
      "Business workflows needed a stable integration boundary without embedding hardware behavior into every application that used the lockers.",
    constraints: [
      "Commands cross a cloud-to-machine boundary and cannot be treated like synchronous browser requests.",
      "Business applications and machine execution require separate responsibilities.",
      "The platform must support more than one business application and machine deployment.",
    ],
    decisions: [
      {
        heading: "Create one reusable control plane",
        problem: "A one-off integration would repeat device rules inside each business product.",
        boundary: "A Laravel platform owns the tenant, API, command, and callback boundary.",
        effect: "Future business applications can connect through the same orchestration model.",
      },
      {
        heading: "Keep machine execution outside the business system",
        problem: "Cloud workflows and physical device execution fail in different ways.",
        boundary: "MQTT and machine-side Python sit behind an explicit command lifecycle.",
        effect: "Device behavior remains isolated from product and tenant rules.",
      },
      {
        heading: "Make command progress observable",
        problem: "Queued delivery and device callbacks are not immediate.",
        boundary: "Queued processing and webhook callbacks preserve explicit command state.",
        effect: "Delayed delivery and recovery remain part of the workflow instead of invisible edge cases.",
      },
    ],
    failurePaths: [
      "Queued commands preserve work when immediate delivery is unavailable.",
      "MQTT delivery and machine-side execution remain separate from business-state changes.",
      "Webhook callbacks reconcile device outcomes with the control platform.",
    ],
    outcome:
      "The result is a reusable platform boundary rather than a single hardware integration.",
    architectureCaption:
      "Public architecture overview of the Laravel control plane, queued command lifecycle, MQTT boundary, and machine-side execution.",
    technologyRoles: {
      "Laravel 11": "Tenant-aware API, orchestration, commands, and callbacks.",
      "PHP 8.2": "Backend runtime for the reusable control boundary.",
      Python: "Machine-side execution and hardware integration.",
      MQTT: "Asynchronous communication across the device boundary.",
      Redis: "Queued command processing and operational state.",
    },
  },
  "warqah-store": {
    accent: "amber",
    recruiterSummary:
      "A live commerce platform where backend and infrastructure reliability protect orders, inventory, payments, shipping, and revenue.",
    situation:
      "The platform needed production preparation before launch, then ongoing backend ownership as real commercial volume grew.",
    constraints: [
      "Order, inventory, payment, and fulfillment state move together during high-activity operations.",
      "Shipping and payment depend on external Bosta and Fawaterk integrations.",
      "Deployment and queue operations directly affect commercial continuity.",
    ],
    decisions: [
      {
        heading: "Rework queue-processing flows",
        problem: "Commercial operations cannot depend on every integration completing inline.",
        boundary: "Redis-backed processing separates background work from request handling.",
        effect: "Payment, inventory, and fulfillment work can progress through controlled workers.",
      },
      {
        heading: "Own production infrastructure with the backend",
        problem: "Application correctness is insufficient when deployment and workers are unreliable.",
        boundary: "Server configuration, deployments, and DevOps remain in the same ownership boundary.",
        effect: "Operational failures can be diagnosed and corrected across application and infrastructure layers.",
      },
      {
        heading: "Isolate external commerce integrations",
        problem: "Shipping and payment providers have independent request and failure lifecycles.",
        boundary: "Bosta and Fawaterk are implemented as explicit integration boundaries.",
        effect: "Provider behavior does not become indistinguishable from internal order state.",
      },
    ],
    failurePaths: [
      "Queue-backed processing prevents long-running integration work from blocking customer requests.",
      "Redis workers support recovery of background commerce operations.",
      "Payment and shipping integrations remain separate from internal order and inventory state.",
    ],
    outcome:
      "The backend launched and continued operating through verified sales, order, and customer volume without turning estimates into guarantees.",
    architectureCaption:
      "Public architecture overview of Warqah Store commerce, queue, payment, shipping, and operational boundaries.",
    technologyRoles: {
      "Laravel 12": "Commerce rules, order state, inventory, and integration orchestration.",
      "Laravel Sanctum": "Authenticated application access.",
      Redis: "Queue-backed commercial workflows.",
      "Bosta API": "Shipping execution boundary.",
      Fawaterk: "Payment integration boundary.",
    },
  },
  "autopay-eg": {
    accent: "blue",
    recruiterSummary:
      "A founder-built payment-confirmation SaaS that turns external Vodafone Cash and InstaPay evidence into reliable merchant invoice state.",
    situation:
      "Buyers transfer money in an external wallet application. Merchants still need reliable detection, matching, confirmation, and notification inside their own systems.",
    constraints: [
      "Autopay does not hold funds or control the external Vodafone Cash or InstaPay transfer.",
      "Android SMS or notification evidence can be delayed, duplicated, or incomplete.",
      "Concurrent evidence must not confirm one invoice twice or corrupt merchant state.",
      "Merchant APIs, signed webhooks, WooCommerce, and Shopify need deterministic outcomes.",
    ],
    decisions: [
      {
        heading: "Authenticate evidence at ingestion",
        problem: "Mobile-detected payment evidence crosses an untrusted network boundary.",
        boundary: "The Android application submits evidence through secure HMAC ingestion.",
        effect: "The matching workflow starts from authenticated application evidence rather than an assumed bank API.",
      },
      {
        heading: "Separate matching from invoice state",
        problem: "External evidence is uncertain while merchant invoice state must remain deterministic.",
        boundary: "A matching and risk engine evaluates evidence before changing invoice state.",
        effect: "Duplicate or conflicting evidence cannot become an unchecked confirmation path.",
      },
      {
        heading: "Deliver outcomes asynchronously",
        problem: "Merchant systems and commerce plugins are not always available at confirmation time.",
        boundary: "Redis and Horizon workers deliver signed webhooks and integration updates.",
        effect: "Retries and idempotent notification remain outside the core matching transaction.",
      },
    ],
    failurePaths: [
      "Duplicate evidence is handled through concurrency-safe matching and idempotent state changes.",
      "Delayed callbacks remain queue-backed rather than blocking invoice confirmation.",
      "Signed webhooks let merchants verify notification authenticity.",
      "Failed merchant delivery can be retried without claiming a second payment.",
    ],
    outcome:
      "The product automates merchant-side confirmation while preserving the distinction between payment evidence and external fund transfer.",
    architectureCaption:
      "Public architecture overview of Android evidence detection, HMAC ingestion, matching, invoice state, queues, signed webhooks, and merchant integrations.",
    technologyRoles: {
      "Laravel 11": "Evidence ingestion, matching, invoice state, APIs, and signed webhooks.",
      PostgreSQL: "Durable merchant, invoice, and payment-event state.",
      Redis: "Horizon queues, retries, and notification delivery.",
      Kotlin: "Android SMS and notification evidence detection.",
      WooCommerce: "Merchant checkout and confirmation integration.",
      Shopify: "Merchant commerce integration.",
    },
  },
};

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return (CASE_STUDY_SLUGS as readonly string[]).includes(slug);
}
