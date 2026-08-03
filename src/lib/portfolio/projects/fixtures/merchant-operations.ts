import type { ProjectCaseStudyDto } from "@/lib/portfolio/projects/schemas";

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
  technologies: [
    "Laravel",
    "Salla",
    "Queues",
    "Webhooks",
    "Redis",
    "MySQL",
  ],
  ownershipSummary:
    "Backend integrations, queues, webhooks, reporting, and reconciliation",
  strongestProof: {
    id: "api-performance",
    value: "70–80%",
    label: "API performance improvement",
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
    coverType: "merchant-operations",
    homepageCategory: "commerce",
  },
  caseStudyAvailable: false,
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
      id: "api-performance",
      value: "70–80%",
      label: "API performance improvement",
      evidenceStatus: "source-supported",
      public: true,
    },
    {
      id: "sync-errors",
      value: "15%",
      label: "synchronization error reduction",
      evidenceStatus: "source-supported",
      public: true,
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
      summary:
        "Commerce events enter through webhooks, queues protect request paths, and ops, alerts, and reporting stay synchronized.",
      nodes: [
        {
          id: "commerce-events",
          label: "Commerce events",
          detail: "Platform events enter through a controlled integration boundary.",
          kind: "client",
        },
        {
          id: "webhook",
          label: "Webhook intake",
          detail: "Events are validated, normalized, and routed predictably.",
          kind: "core",
        },
        {
          id: "queue",
          label: "Normalization",
          detail: "Background processing protects request paths and supports retries.",
          kind: "service",
        },
        {
          id: "operations",
          label: "Operational states",
          detail: "Orders, shipments, branches, and status rules stay synchronized.",
          kind: "core",
        },
        {
          id: "reconciliation",
          label: "Reconciliation",
          detail: "Operational events become reliable business visibility.",
          kind: "outcome",
        },
      ],
      connections: [
        { from: "commerce-events", to: "webhook" },
        { from: "webhook", to: "queue" },
        { from: "queue", to: "operations" },
        { from: "queue", to: "reconciliation" },
      ],
      textAlternative:
        "Commerce events connect to webhook intake, which feeds normalization that fans out to operational states and reconciliation.",
    },
  ],
  seo: {
    title: "Merchant Operations Platform — Abdalrhman M. Alkady",
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
