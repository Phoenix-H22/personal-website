export type SystemNode = {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  kind: "core" | "service" | "client" | "outcome";
};

export type SystemConnection = {
  from: string;
  to: string;
};

export type ProjectMedia = {
  id: string;
  type:
    | "screenshot"
    | "mobileScreenshot"
    | "architecture"
    | "diagram"
    | "logo"
    | "video"
    | "externalEmbed";
  src: string;
  alt: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  orientation: "landscape" | "portrait" | "square" | null;
  device: "desktop" | "mobile" | "tablet" | "other" | null;
  sortOrder: number;
};

export type ProjectLink = {
  label: string;
  type: "live" | "repository" | "caseStudy" | "store" | "documentation";
  url: string;
  visibility: "public" | "private" | "restricted";
};

export type ProjectCategory =
  | "SaaS Platforms"
  | "Commerce and Integrations"
  | "Commerce and Messaging Automation"
  | "Mobile-backed Products"
  | "AI and Automation"
  | "AI, Healthcare, Mobile, and Hardware"
  | "IoT and Physical Product Systems"
  | "Education Platforms"
  | "Business Systems"
  | "Websites and Custom Platforms";

export type Project = {
  slug: string;
  index: string;
  title: string;
  proposition: string;
  summary: string;
  category: ProjectCategory;
  startDate: string | null;
  endDate: string | null;
  company: string | null;
  clientVisibility: "public" | "private" | "client-confidential";
  teamContext: string | null;
  exactRole: string;
  ownership: string;
  featured: boolean;
  cover: ProjectMedia | null;
  gallery: ProjectMedia[];
  links: ProjectLink[];
  results: string[];
  caseStudyAvailability: "available" | "partial" | "unavailable";
  sortOrder: number;
  visibility: string;
  role: string;
  impact: string[];
  technologies: string[];
  nodes: SystemNode[];
  connections: SystemConnection[];
  status: "canonical" | "pending_canonical_entry";
};

export const projects: Project[] = [
  {
    slug: "merchant-operations-salla-automation",
    index: "01",
    title: "Merchant Operations and Salla Automation",
    proposition:
      "A commerce operations layer that turned high-volume platform events into reliable reporting, fulfillment, and employee action.",
    summary:
      "Backend integrations, reporting, and reconciliation for multi-merchant commerce operations connected to Salla.",
    category: "Commerce and Integrations",
    startDate: null,
    endDate: null,
    company: "Mohssilh",
    clientVisibility: "client-confidential",
    teamContext: null,
    exactRole: "Backend systems, integrations, reliability, and operational workflows",
    ownership: "Backend integrations, queues, webhooks, reporting, and reconciliation",
    featured: true,
    cover: null,
    gallery: [],
    links: [],
    results: [
      "200+ merchants served",
      "20K+ monthly orders processed",
      "12M+ SAR in handled order value",
      "API performance improved by 70–80%",
      "Synchronization errors reduced by 15%",
    ],
    caseStudyAvailability: "partial",
    sortOrder: 1,
    visibility: "Client-confidential · Architecture and impact available",
    role: "Backend systems, integrations, reliability, and operational workflows",
    impact: [
      "200+ merchants served",
      "20K+ monthly orders processed",
      "12M+ SAR in handled order value",
      "API performance improved by 70–80%",
    ],
    technologies: ["Laravel", "Salla", "Queues", "Webhooks", "Redis", "MySQL", "Reporting"],
    nodes: [
      {
        id: "salla",
        label: "Salla",
        detail: "Commerce events enter through a controlled integration boundary.",
        x: 6,
        y: 28,
        kind: "client",
      },
      {
        id: "webhook",
        label: "Webhooks",
        detail: "Events are validated, normalized, and routed predictably.",
        x: 30,
        y: 28,
        kind: "core",
      },
      {
        id: "queue",
        label: "Queue",
        detail: "Background processing protects request paths and supports retries.",
        x: 54,
        y: 28,
        kind: "service",
      },
      {
        id: "operations",
        label: "Ops",
        detail: "Orders, shipments, branches, and status rules stay synchronized.",
        x: 76,
        y: 14,
        kind: "core",
      },
      {
        id: "alerts",
        label: "Alerts",
        detail: "Relevant changes reach the people responsible for action.",
        x: 76,
        y: 42,
        kind: "outcome",
      },
      {
        id: "reporting",
        label: "Reports",
        detail: "Operational events become reliable business visibility.",
        x: 76,
        y: 70,
        kind: "outcome",
      },
    ],
    connections: [
      { from: "salla", to: "webhook" },
      { from: "webhook", to: "queue" },
      { from: "queue", to: "operations" },
      { from: "queue", to: "alerts" },
      { from: "queue", to: "reporting" },
    ],
    status: "canonical",
  },
  {
    slug: "nabd-messaging-platform",
    index: "02",
    title: "NABD Messaging Platform",
    proposition:
      "A multi-tenant messaging automation platform for e-commerce merchants across WhatsApp, Telegram, email, and webhook-triggered campaigns.",
    summary:
      "A multi-tenant messaging automation platform for e-commerce merchants, supporting WhatsApp, Telegram, email, campaigns, chatbots, subscriptions, and webhook-triggered communication.",
    category: "Commerce and Messaging Automation",
    startDate: null,
    endDate: null,
    company: null,
    clientVisibility: "private",
    teamContext: null,
    exactRole: "Platform and messaging-system engineering",
    ownership:
      "Multi-tenant messaging automation, WhatsApp device sessions, queues, and webhook-driven delivery",
    featured: true,
    cover: null,
    gallery: [],
    links: [],
    results: [],
    caseStudyAvailability: "partial",
    sortOrder: 2,
    visibility: "Private product · Architecture available",
    role: "Platform and messaging-system engineering",
    impact: [
      "QR-based WhatsApp device pairing",
      "Background queue workers for high-volume delivery",
      "Webhook-triggered merchant communication",
    ],
    technologies: [
      "Laravel",
      "Node.js",
      "Express.js",
      "Baileys",
      "Redis",
      "MySQL",
      "Supervisor",
      "Salla APIs",
      "Zid APIs",
    ],
    nodes: [],
    connections: [],
    status: "canonical",
  },
  {
    slug: "smart-vending-medication-dispensing",
    index: "03",
    title: "Smart Vending / Medication Dispensing Platform",
    proposition:
      "An API-driven medication-dispensing platform connecting dashboards, QR flows, payments, machine controllers, and real-world dispensing actions.",
    summary:
      "An API-driven medication-dispensing platform connecting dashboards, QR flows, payments, machine controllers, and real-world dispensing actions.",
    category: "IoT and Physical Product Systems",
    startDate: null,
    endDate: null,
    company: null,
    clientVisibility: "client-confidential",
    teamContext: null,
    exactRole: "Backend integration and device workflow architecture",
    ownership: "API workflows from request through payment, MQTT control, and physical dispensing",
    featured: true,
    cover: null,
    gallery: [],
    links: [],
    results: [],
    caseStudyAvailability: "partial",
    sortOrder: 3,
    visibility: "Client-confidential · Architecture and impact available",
    role: "Backend integration and device workflow architecture",
    impact: [
      "Raspberry Pi controllers",
      "QR-based product flows",
      "MQTT-style remote machine communication",
    ],
    technologies: ["Laravel", "Python", "React.js", "MQTT", "Redis", "PostgreSQL"],
    nodes: [],
    connections: [],
    status: "canonical",
  },
  {
    slug: "virtual-clinic-dr-robot",
    index: "04",
    title: "Virtual Clinic / Dr. Robot",
    proposition:
      "An AI-powered virtual clinic combining web, mobile, backend, and hardware components.",
    summary:
      "An AI-powered virtual clinic combining web, mobile, backend, and hardware components.",
    category: "AI, Healthcare, Mobile, and Hardware",
    startDate: null,
    endDate: "2025-08",
    company: null,
    clientVisibility: "private",
    teamContext: "Graduation project",
    exactRole: "Product and system ownership across web, mobile, backend, and hardware",
    ownership: "Authentication, diagnosis flow, face-based login, patient data, and Pi interaction screens",
    featured: true,
    cover: null,
    gallery: [],
    links: [],
    results: ["Awarded A+ as a graduation project"],
    caseStudyAvailability: "partial",
    sortOrder: 4,
    visibility: "Private product · Graduation project",
    role: "Product and system ownership across web, mobile, backend, and hardware",
    impact: ["Graduation project", "A+ grade"],
    technologies: [
      "Laravel",
      "Flutter",
      "Vue.js",
      "Python",
      "Raspberry Pi",
      "AI models",
      "Face recognition",
    ],
    nodes: [],
    connections: [],
    status: "canonical",
  },
  {
    slug: "your-obour-guide",
    index: "05",
    title: "Your Obour Guide",
    proposition:
      "A bilingual city-guide ecosystem spanning a Laravel core, Flutter application, public Next.js website, and operations dashboard.",
    summary:
      "PENDING_CANONICAL_ENTRY — keep as portfolio candidate until full case-study fields are confirmed.",
    category: "Mobile-backed Products",
    startDate: null,
    endDate: null,
    company: null,
    clientVisibility: "private",
    teamContext: null,
    exactRole: "Product ownership, multi-platform architecture, and release quality",
    ownership: "PENDING_CANONICAL_ENTRY",
    featured: false,
    cover: null,
    gallery: [],
    links: [],
    results: [
      "406 Laravel tests passing at a major release gate",
      "138 Flutter tests passing",
      "Production Android App Bundle",
    ],
    caseStudyAvailability: "unavailable",
    sortOrder: 10,
    visibility: "Private product · Public demo unavailable",
    role: "Product ownership, multi-platform architecture, and release quality",
    impact: [
      "406 Laravel tests passing at a major release gate",
      "138 Flutter tests passing",
      "Production Android App Bundle",
    ],
    technologies: ["Laravel", "Flutter", "Next.js", "Bunny CDN"],
    nodes: [],
    connections: [],
    status: "pending_canonical_entry",
  },
  {
    slug: "ai-pdf-extraction",
    index: "06",
    title: "AI PDF Extraction Pipeline",
    proposition:
      "A visible, failure-aware document pipeline that turns long-running OCR and GPT extraction into structured data.",
    summary:
      "PENDING_CANONICAL_ENTRY — keep as portfolio candidate until full case-study fields are confirmed.",
    category: "AI and Automation",
    startDate: null,
    endDate: null,
    company: null,
    clientVisibility: "private",
    teamContext: null,
    exactRole: "Pipeline orchestration, progress reporting, and failure handling",
    ownership: "PENDING_CANONICAL_ENTRY",
    featured: false,
    cover: null,
    gallery: [],
    links: [],
    results: [],
    caseStudyAvailability: "unavailable",
    sortOrder: 11,
    visibility: "Private product · Architecture and impact available",
    role: "Pipeline orchestration, progress reporting, and failure handling",
    impact: ["Queued OCR and extraction", "Live progress over SSE", "Structured output"],
    technologies: ["Laravel", "Vue", "Tesseract OCR", "GPT", "SSE"],
    nodes: [],
    connections: [],
    status: "pending_canonical_entry",
  },
];
