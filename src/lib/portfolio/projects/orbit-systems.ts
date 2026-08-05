import type { CanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";

/**
 * Presentation data for Projects Orbit — the sonar systems map rendered at
 * `/v2/work`. Each system is a node placed by its primary domain (its sector)
 * and its ownership/status tier (its ring). Copy is richer than the recruiter
 * ledger: a one-line framing, a headline metric, domains, and stack.
 *
 * Cover, thumbnail, and architecture assets already live under
 * `public/portfolio/projects/<slug>/`; the helpers below resolve their public
 * URLs. Slugs are typed against the canonical set so this file cannot drift.
 */

export type OrbitStatus =
  | "Live"
  | "Active development"
  | "Completed"
  | "Completed before launch";

/** Coarse status tone for indicator dots; never the sole signal. */
export type OrbitStatusTone = "live" | "active" | "settled";

export type OrbitDomainKey =
  | "Commerce"
  | "Fintech & Payments"
  | "IoT & Connected Hardware"
  | "Healthcare"
  | "Messaging & SaaS"
  | "Mobile Products"
  | "AI & Data"
  | "Integrations";

/**
 * Ownership/status ring:
 * - 0 — founder-built (inner ring, diamond mark)
 * - 1 — live or in active development, built by me (mid ring)
 * - 2 — completed / handed over (outer ring)
 */
export type OrbitTier = 0 | 1 | 2;

export interface OrbitDomain {
  key: OrbitDomainKey;
  /** Short label used around the sonar rim and in filter chips. */
  short: string;
}

export interface OrbitSystem {
  slug: CanonicalProjectSlug;
  name: string;
  summary: string;
  systemType: string;
  ownership: string;
  status: OrbitStatus;
  metric: string;
  tech: string[];
  /** First entry is the primary domain — it decides the node's sector. */
  domains: OrbitDomainKey[];
  website: string;
  websiteNote?: string;
  hasArchitecture: boolean;
}

export interface OrbitTelemetryStat {
  target: number;
  label: string;
  prefix?: string;
  suffix?: string;
  grouped?: boolean;
}

/** Sector order around the sonar, starting at the top and going clockwise. */
export const ORBIT_DOMAINS: readonly OrbitDomain[] = [
  { key: "Commerce", short: "Commerce" },
  { key: "Fintech & Payments", short: "Fintech" },
  { key: "IoT & Connected Hardware", short: "IoT" },
  { key: "Healthcare", short: "Health" },
  { key: "Messaging & SaaS", short: "Messaging" },
  { key: "Mobile Products", short: "Mobile" },
  { key: "AI & Data", short: "AI · Data" },
  { key: "Integrations", short: "Integrations" },
];

/** Ring radius (in the 0–100 sonar coordinate space) for each tier. */
export const ORBIT_TIER_RADII: readonly [number, number, number] = [22, 31.5, 40];

export const ORBIT_TELEMETRY: readonly OrbitTelemetryStat[] = [
  { target: 13, label: "Production systems" },
  { target: 3, label: "Founder-built products" },
  { target: 21, prefix: "EGP ", suffix: "M+", label: "Platform sales" },
  { target: 100, suffix: "K+", label: "Orders processed" },
  { target: 90, suffix: "K+", label: "Customers served" },
  { target: 5000, suffix: "+", label: "Messages / week", grouped: true },
];

export const ORBIT_SYSTEMS: readonly OrbitSystem[] = [
  {
    slug: "smart-lockers-platform",
    name: "Smart Lockers Platform",
    summary:
      "An independent control plane separating business systems from locker and device orchestration.",
    systemType: "Multi-tenant IoT control plane",
    ownership: "Built entirely",
    status: "Live",
    metric: "Reusable production platform",
    tech: ["Laravel 11", "PHP 8.2", "Python", "MQTT", "Redis", "Raspberry Pi", "Filament"],
    domains: ["IoT & Connected Hardware"],
    website: "smartlockers.tech",
    hasArchitecture: true,
  },
  {
    slug: "warqah-store",
    name: "Warqah Store",
    summary:
      "A production commerce platform keeping orders, inventory, payments and shipping dependable through high-activity sales.",
    systemType: "Commerce operations platform",
    ownership: "Backend & DevOps owner",
    status: "Live",
    metric: "EGP 21M+ sales · 100K+ orders · 90K+ customers",
    tech: ["Laravel 12", "Sanctum", "Redis", "Bosta API", "Fawaterk"],
    domains: ["Commerce"],
    website: "waraqah-store.com",
    hasArchitecture: true,
  },
  {
    slug: "your-obour-guide",
    name: "Your Obour Guide",
    summary:
      "A founder-built city-discovery ecosystem: Laravel backend, Flutter app, Next.js site, geospatial place data, media delivery and releases.",
    systemType: "Multi-surface city-discovery product",
    ownership: "Founder-built",
    status: "Active development",
    metric: "397 Laravel + 143 Flutter tests passing",
    tech: ["Laravel 10", "Flutter", "Next.js", "MySQL", "Redis", "Bunny CDN", "Sentry"],
    domains: ["Mobile Products"],
    website: "yourobour.guide",
    hasArchitecture: true,
  },
  {
    slug: "autopay-eg",
    name: "Autopay EG",
    summary:
      "A founder-built Egyptian payment-automation SaaS that detects and matches Vodafone Cash & InstaPay transfers to merchant invoices.",
    systemType: "Payment-confirmation automation SaaS",
    ownership: "Founder-built",
    status: "Live",
    metric: "Concurrency-safe payment matching in production",
    tech: ["Laravel 11", "Vue 3", "Inertia", "PostgreSQL", "Redis", "Kotlin", "WooCommerce", "Shopify"],
    domains: ["Fintech & Payments"],
    website: "autopayeg.com",
    hasArchitecture: true,
  },
  {
    slug: "nabd",
    name: "NABD",
    summary:
      "A founder-built messaging SaaS connecting a Laravel orchestration platform with WhatsApp & Telegram services, plus native Salla and Zid commerce integrations.",
    systemType: "Multi-service messaging SaaS",
    ownership: "Founder-built",
    status: "Live",
    metric: "5,000+ messages processed weekly",
    tech: ["Laravel 10", "Node.js", "Express", "Redis", "Baileys", "MadelineProto"],
    domains: ["Messaging & SaaS"],
    website: "",
    hasArchitecture: true,
  },
  {
    slug: "wasfaty-smart-vending",
    name: "Wasfaty Smart Vending",
    summary:
      "A healthcare smart-vending platform that validates Wasfaty prescriptions and coordinates controlled medicine dispensing through connected machines.",
    systemType: "Prescription-dispensing orchestration",
    ownership: "Built entirely",
    status: "Live",
    metric: "Ran in Hajj-season production",
    tech: ["Laravel 9", "PHP 8", "Filament", "OAuth 2.0", "HMAC-SHA256", "Horizon", "MQTT"],
    domains: ["Healthcare", "IoT & Connected Hardware"],
    website: "",
    hasArchitecture: true,
  },
  {
    slug: "alzahaby-loyalty-app",
    name: "Alzahaby Loyalty App",
    summary:
      "A QR-powered loyalty and rewards platform turning product scans into points and redeemable rewards.",
    systemType: "Cross-platform loyalty product",
    ownership: "Built entirely",
    status: "Live",
    metric: "Published on iOS + Android",
    tech: ["Laravel 13", "PHP 8.3", "Flutter", "Sanctum"],
    domains: ["Mobile Products"],
    website: "",
    websiteNote: "Shipped on App Store + Google Play",
    hasArchitecture: true,
  },
  {
    slug: "riders-shopify-wordpress",
    name: "Riders Integrations",
    summary:
      "A Laravel-embedded Shopify app and a standalone WooCommerce plugin connecting Kuwait merchants to Riders shipping.",
    systemType: "Commerce integrations",
    ownership: "Built entirely",
    status: "Live",
    metric: "2 production commerce integrations",
    tech: ["Laravel 12", "Shopify GraphQL Admin API", "Webhooks", "WooCommerce", "Action Scheduler"],
    domains: ["Integrations"],
    website: "tryriders.com",
    hasArchitecture: false,
  },
  {
    slug: "sim-express",
    name: "SIM Express",
    summary:
      "A self-service telecom kiosk platform to sell and activate stc SIM and eSIM services for Hajj-oriented journeys.",
    systemType: "Telecom kiosk operations platform",
    ownership: "Technical owner",
    status: "Completed before launch",
    metric: "7 kiosk hardware categories integrated",
    tech: ["Laravel 11", "Filament", "Redis", "Horizon", "Docker"],
    domains: ["IoT & Connected Hardware"],
    website: "simexpress.sa",
    hasArchitecture: true,
  },
  {
    slug: "tawfir",
    name: "Tawfir",
    summary:
      "A UAE surplus-food marketplace where restaurants sell discounted dishes for scheduled customer pickup.",
    systemType: "Multi-role marketplace",
    ownership: "Technical owner (backend/web)",
    status: "Completed",
    metric: "Delivered to a private client",
    tech: ["Laravel 10", "Filament", "Laratrust", "Laravel Modules", "Stripe Connect", "OneSignal"],
    domains: ["Commerce"],
    website: "",
    hasArchitecture: true,
  },
  {
    slug: "pdf-extractor",
    name: "PDF Extractor",
    summary:
      "A document-extraction platform: native PDF parsing, OCR fallback, queue processing, live SSE progress and optional AI cleanup.",
    systemType: "Async document-processing platform",
    ownership: "Built entirely",
    status: "Completed",
    metric: "PDF + Word ingestion, one observable pipeline",
    tech: ["Laravel 10", "Vue 3", "Tesseract OCR", "LibreOffice", "Server-Sent Events", "OpenAI"],
    domains: ["AI & Data"],
    website: "",
    hasArchitecture: true,
  },
  {
    slug: "pinoyaid",
    name: "PinoyAid",
    summary:
      "A substantially rebuilt crowdfunding platform: campaign moderation, donations, withdrawals, admin and multi-gateway payments.",
    systemType: "Crowdfunding platform rebuild",
    ownership: "Technical owner",
    status: "Completed",
    metric: "Multi-gateway payment architecture",
    tech: ["Laravel 11", "PHP 8.3", "Blade", "MySQL", "Stripe", "PayPal"],
    domains: ["Fintech & Payments"],
    website: "",
    hasArchitecture: true,
  },
  {
    slug: "chocolate-smart-vending",
    name: "Chocolate Smart Vending",
    summary:
      "A QR-powered chocolate retail platform integrating Moyasar payments with automated smart-locker collection.",
    systemType: "QR smart-retail system",
    ownership: "Technical owner",
    status: "Completed",
    metric: "Production, real Moyasar payments",
    tech: ["Laravel 10", "Filament", "Sanctum", "Redis", "Moyasar", "MQTT", "Raspberry Pi"],
    domains: ["IoT & Connected Hardware", "Commerce"],
    website: "",
    hasArchitecture: true,
  },
];

const STATUS_TONES: Record<OrbitStatus, OrbitStatusTone> = {
  Live: "live",
  "Active development": "active",
  Completed: "settled",
  "Completed before launch": "settled",
};

export function statusTone(status: OrbitStatus): OrbitStatusTone {
  return STATUS_TONES[status];
}

export function systemTier(system: OrbitSystem): OrbitTier {
  if (system.ownership === "Founder-built") return 0;
  if (system.status === "Live" || system.status === "Active development") return 1;
  return 2;
}

export function isFounderBuilt(system: OrbitSystem): boolean {
  return system.ownership === "Founder-built";
}

const ASSET_ROOT = "/portfolio/projects";

export function systemCover(slug: CanonicalProjectSlug): string {
  return `${ASSET_ROOT}/${slug}/cover.webp`;
}

export function systemThumb(slug: CanonicalProjectSlug): string {
  return `${ASSET_ROOT}/${slug}/cover-card.webp`;
}

export function systemArchitecture(slug: CanonicalProjectSlug): string {
  return `${ASSET_ROOT}/${slug}/architecture.webp`;
}
