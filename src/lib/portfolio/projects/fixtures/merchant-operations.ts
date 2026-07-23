import type { ProjectCaseStudyDto } from "@/lib/portfolio/projects/schemas";

/** Validated Flagship fixture for foundation tests — not wired to UI. */
export const merchantOperationsFixture: ProjectCaseStudyDto = {
  id: "merchant-operations-salla-automation",
  slug: "merchant-operations-salla-automation",
  title: "Merchant Operations Platform",
  shortTitle: "Merchant Ops",
  subtitle: "Commerce operations · Salla integrations",
  summary:
    "Backend integrations, reporting, and reconciliation for multi-merchant commerce operations connected to Salla.",
  status: "live",
  publicationStatus: "published",
  visibility: "public",
  confidentiality: "public-limited",
  period: { start: "2025-03", end: null, label: "2025 – Present" },
  company: {
    id: "mohssilh",
    name: "Mohssilh",
    publishName: true,
  },
  domains: ["commerce", "integrations"],
  roles: ["backend", "integrations"],
  platforms: ["web", "api"],
  technologies: ["Laravel", "Salla", "Queues", "Webhooks", "Redis", "MySQL"],
  ownershipSummary:
    "Backend integrations, queues, webhooks, reporting, and reconciliation",
  strongestProof: {
    id: "merchants",
    value: "200+",
    label: "merchants",
    evidenceStatus: "source-supported",
    public: true,
  },
  featured: true,
  homepageOrder: 1,
  workOrder: 1,
  cover: null,
  visualTheme: {
    id: "merchant-ops",
    primary: "cyan",
    secondary: "amber",
    motif: "order-lifecycle",
  },
  caseStudyAvailable: true,
  problem:
    "High-volume commerce platform events needed reliable reporting, fulfillment visibility, and employee action without fragile sync.",
  ownership:
    "Backend integrations, queues, webhooks, reporting, and reconciliation",
  constraints: [
    "Multi-merchant operational complexity",
    "External commerce API boundaries",
    "Client-confidential implementation details",
  ],
  metrics: [
    {
      id: "merchants",
      value: "200+",
      label: "merchants",
      evidenceStatus: "source-supported",
      public: true,
    },
    {
      id: "orders",
      value: "20K+",
      label: "monthly orders",
      evidenceStatus: "source-supported",
      public: true,
    },
    {
      id: "value",
      value: "12M+ SAR",
      label: "handled order activity",
      evidenceStatus: "source-supported",
      public: true,
    },
    {
      id: "internal-debug",
      value: "n/a",
      label: "internal note",
      evidenceStatus: "unverified",
      public: false,
    },
  ],
  links: [],
  gallery: [],
  blocks: [
    {
      id: "overview",
      type: "overview",
      order: 1,
      publicationStatus: "published",
      heading: "Overview",
      body: "A commerce operations layer that turns platform events into reliable reporting and action.",
    },
    {
      id: "architecture",
      type: "architecture",
      order: 2,
      publicationStatus: "published",
      heading: "System architecture",
      summary: "Salla events enter through webhooks, queues protect request paths, and ops/reporting stay synchronized.",
      nodes: [
        {
          id: "salla",
          label: "Salla",
          detail: "Commerce events enter through a controlled integration boundary.",
          kind: "client",
        },
        {
          id: "webhook",
          label: "Webhooks",
          detail: "Events are validated, normalized, and routed predictably.",
          kind: "core",
        },
        {
          id: "queue",
          label: "Queue",
          detail: "Background processing protects request paths and supports retries.",
          kind: "service",
        },
      ],
      connections: [
        { from: "salla", to: "webhook" },
        { from: "webhook", to: "queue" },
      ],
      textAlternative:
        "Salla connects to webhooks, which feed a queue for operational processing.",
    },
  ],
  seo: {
    title: "Merchant Operations Platform — Abdalrhman Alkady",
    description:
      "Backend integrations, queues, and reconciliation for multi-merchant commerce operations.",
    canonicalPath: "/work/merchant-operations-salla-automation",
    robots: { index: true, follow: true },
    structuredDataType: "SoftwareApplication",
    modifiedAt: "2026-07-23",
  },
  updatedAt: "2026-07-23",
  relatedSlugs: ["nabd-messaging-platform"],
};
