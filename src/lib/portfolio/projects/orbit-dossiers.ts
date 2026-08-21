import { CASE_STUDY_PRESENTATION, isCaseStudySlug } from "@/lib/portfolio/case-studies";
import type { CanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";
import { publicProjectRole } from "@/lib/portfolio/projects/public-roles";
import type { OrbitSystem } from "@/lib/portfolio/projects/orbit-systems";

/**
 * Narrative presentation copy for the Projects Orbit dossier (the modal opened
 * from `/projects`). This layer turns each system into a case-study-style read:
 * a tagline, an "Act I / challenge" and "Act II / what I built" pair, a
 * headline "by the numbers" panel, and a set of flip cards that explain how the
 * system actually works.
 *
 * Copy is authored per slug in {@link ORBIT_DOSSIERS} (sourced from the owner's
 * Notion "Portfolio Project Inventory"). {@link resolveDossier} merges that copy
 * with graceful fallbacks derived from {@link OrbitSystem} and the richer
 * `CASE_STUDY_PRESENTATION`, so an unauthored section degrades instead of
 * breaking.
 */

export interface DossierNumber {
  /** The figure itself, e.g. "EGP 21M+" or "100K+". */
  value: string;
  /** What the figure counts, e.g. "Sales" or "Orders". */
  label: string;
}

export interface DossierMechanic {
  /** Card index tag, e.g. "0x01". */
  code: string;
  /** Front-face title. */
  title: string;
  /** Front-face blurb — what the capability is. */
  front: string;
  /** Back-face copy — how it actually works (revealed on flip). */
  how: string;
}

export interface DossierContent {
  tagline?: string;
  shipped?: string;
  /** Act I — the problem the system had to solve. */
  challenge?: string;
  /** Act II — what was actually built. */
  whatIBuilt?: string;
  /** "By the numbers" panel. */
  numbers?: DossierNumber[];
  /** "What actually makes it work" flip cards. */
  mechanics?: DossierMechanic[];
}

export interface ResolvedDossier {
  tagline?: string;
  role: string;
  shipped?: string;
  stackLine: string;
  challenge?: string;
  whatIBuilt: string;
  numbers: DossierNumber[];
  mechanics: DossierMechanic[];
}

/**
 * Authored dossier copy, keyed by canonical slug. Populated from Notion.
 * Any slug left out still renders via the fallbacks in {@link resolveDossier}.
 */
export const ORBIT_DOSSIERS: Partial<Record<CanonicalProjectSlug, DossierContent>> = {
  "warqah-store": {
    tagline: "High-scale commerce backend that keeps orders, payments, and stock dependable.",
    challenge:
      "Warqah Store needed to handle real commercial activity without losing order accuracy, overselling stock, or breaking fulfillment when external services were slow. The core challenge was keeping order creation, payment confirmation, inventory updates, and shipping handoff aligned as one reliable business process.",
    whatIBuilt:
      "A Laravel backend built around authenticated customer and admin flows, Redis-backed asynchronous processing, validated payment callbacks, movement-based inventory tracking, and a Bosta shipping integration with retry-safe job handling. It also included the provisioned production server and deployment setup that supported launch and ongoing operations.",
    numbers: [
      { value: "EGP 21M+", label: "Sales" },
      { value: "100K+", label: "Orders" },
      { value: "90K+", label: "Customers" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Asynchronous fulfillment pipeline",
        front: "Order fulfillment runs off the request path through queued jobs.",
        how: "Payment callbacks are validated before processing, then fulfillment steps execute asynchronously on Redis-backed queues with retry and failed-job recovery.",
      },
      {
        code: "0x02",
        title: "Concurrency-safe inventory",
        front: "Stock stays accurate under concurrent order activity.",
        how: "Post-payment stock updates use row locking, reserved stock is tracked separately from final inventory movement, and reservations guard against overselling.",
      },
      {
        code: "0x03",
        title: "Idempotent shipping handoff",
        front: "Delivery creation integrates with the Bosta shipping API without duplicating shipments.",
        how: "Delivery creation is skipped when a tracking number already exists and retries automatically when external shipping calls fail, with errors written to both application logs and an error log table.",
      },
    ],
  },
  "smart-lockers-platform": {
    tagline: "A reusable control plane between business systems and locker hardware.",
    challenge:
      "A single business application needed to control remotely managed locker hardware. A direct integration would have buried device communication, MQTT commands, authentication, and command-state handling inside that one app, forcing every future integration to rebuild the same complex device layer.",
    whatIBuilt:
      "An independent, multi-tenant Smart Lockers platform acting as a reusable control plane: external systems connect through an HMAC-authenticated API, commands move through queues and a defined state lifecycle, MQTT delivers them to Raspberry Pi agents, and webhook callbacks synchronize results back. A reusable Laravel integration package lets future apps connect without rebuilding the device layer.",
    numbers: [
      { value: "Multi-tenant", label: "Reusable control plane" },
      { value: "Live", label: "In production" },
      { value: "MQTT", label: "Cloud-to-machine boundary" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Command state machine",
        front: "Every hardware action moves through an observable, recoverable lifecycle.",
        how: "Asynchronous queues drive an explicit command state machine with acknowledgements, idempotency and duplicate-command protection, timeouts, and exponential-backoff retries so failures stay visible and traceable.",
      },
      {
        code: "0x02",
        title: "HMAC-signed API boundary",
        front: "External systems get secure access without knowing device internals.",
        how: "Requests to the tenant-scoped API are signed and validated with HMAC authentication plus nonce and timestamp checks, keeping a consistent auth contract across integrations.",
      },
      {
        code: "0x03",
        title: "MQTT device agent",
        front: "A Python Raspberry Pi agent executes approved commands and reports state.",
        how: "Commands travel over MQTT QoS 1 to the device agent, which registers automatically, requires administrative approval, emits heartbeats for online/offline detection, and recovers through reconnection and service auto-restart.",
      },
    ],
  },
  "wasfaty-smart-vending": {
    tagline: "Smart vending that validates prescriptions and dispenses controlled medicine.",
    challenge:
      "The challenge was to provide controlled self-service access to prescribed medicines during high-demand healthcare scenarios without losing prescription validity, patient eligibility, stock accuracy, or dispensing auditability. The system also had to account for physical machine state, failure recovery, and reliable confirmation of what actually happened at dispense time.",
    whatIBuilt:
      "A Laravel healthcare orchestration layer connecting Wasfaty prescription APIs, prescription and medicine rules, machine and slot inventory, dispense callbacks, alerts, audit history, and operational dashboards. It validates prescriptions, resolves machine and stock availability, authorizes controlled dispensing, and reconciles physical outcomes through machine callbacks, using the separate Smart Lockers platform for hardware execution.",
    numbers: [
      { value: "Hajj season", label: "Production deployment" },
      { value: "Live", label: "Prescription-to-dispense transactions" },
      { value: "OAuth2 + HMAC", label: "Secured Wasfaty integration" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Prescription transaction state machine",
        front: "Each dispense moves through explicit, auditable states.",
        how: "Transactions progress through init, queued, dispensing, dispensed_success, and dispensed_failed states, with audit logs tracking every change and both successful and failed outcomes recorded against the Wasfaty synchronization state.",
      },
      {
        code: "0x02",
        title: "Callback reconciliation",
        front: "Hardware results are never assumed successful.",
        how: "The machine reports success or failure through a dispense callback; successful results update stock and transaction state, while failures are recorded and surfaced through alerts, aligning the digital transaction with the physical dispense result.",
      },
      {
        code: "0x03",
        title: "Resilient Wasfaty integration",
        front: "Prescription lookups stay reliable against a slow external API.",
        how: "Outbound Wasfaty calls use OAuth2 client-credentials auth with HMAC-SHA256 signing where configured, protected by exponential-backoff retries and timeouts, with a mock mode fallback for safe development and testing.",
      },
    ],
  },
  "your-obour-guide": {
    challenge:
      "Useful information about Obour and New Obour is fragmented, business listings are inconsistent, and residents need faster discovery of nearby services where location, language, data quality, and trust all affect usefulness. A generic national directory does not fully serve the local context of these cities.",
    whatIBuilt:
      "A city-discovery ecosystem: a Laravel API and admin platform, a Flutter mobile app, a Next.js public website, a geospatial place-data ingestion and review pipeline, Bunny CDN media infrastructure, and a QA and release-engineering system, built for a bilingual Arabic and English experience.",
    numbers: [
      { value: "397", label: "Laravel tests passed" },
      { value: "143", label: "Flutter tests passed" },
      { value: "3", label: "Platforms (API, app, web)" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Geospatial place-data pipeline",
        front: "Raw map-provider data becomes accurate, normalized, publishable places.",
        how: "Records pass through defined stages of geographic classification, category mapping, localization, review, deduplication, identity tracking, and controlled import, keeping candidate rows distinct from approved live places with auditability and rollback.",
      },
      {
        code: "0x02",
        title: "Signed CDN media delivery",
        front: "Media is served securely through a storage abstraction and CDN.",
        how: "Object keys are stored in the database rather than raw URLs, and media is delivered through signed Bunny CDN URLs with controlled expiry and a documented cutover workflow between local disk and CDN.",
      },
      {
        code: "0x03",
        title: "Stable API and moderation layer",
        front: "One Laravel backend serves the mobile app, website, and admin consistently.",
        how: "The API uses Sanctum bearer-token auth with active-user middleware, versioned stable response envelopes for Flutter, rate limiting, request validation, and moderation and approval workflows gating public content.",
      },
    ],
  },
  nabd: {
    tagline: "My messaging product — WhatsApp, Telegram, and commerce, built end to end.",
    challenge:
      "Businesses needed to automate customer communication without rebuilding messaging infrastructure for every channel. Each channel has a different authentication, connection, and execution model, external websites needed a reusable API, and commerce merchants needed event-driven messaging tied to store and order activity, all requiring queues, retries, state tracking, and service isolation.",
    whatIBuilt:
      "I built this product from the first API through production: the Laravel business platform, WhatsApp and Telegram execution services, queues and recovery, campaigns, templates, subscriptions, dashboards, a public messaging API, and native Salla and Zid integrations.",
    numbers: [
      { value: "5,000+", label: "Messages / week" },
      { value: "2", label: "Channels (WhatsApp, Telegram)" },
      { value: "2", label: "Commerce integrations (Salla, Zid)" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Isolated channel execution services",
        front: "Each messaging channel runs as its own execution boundary.",
        how: "Laravel acts as the control plane while a Node.js/Express service handles WhatsApp via Baileys and a separate Laravel-plus-Node service handles Telegram via MadelineProto, communicating through documented API contracts, callbacks, and queue-driven handoff.",
      },
      {
        code: "0x02",
        title: "Queue and recovery architecture",
        front: "Message traffic is processed reliably off the request path.",
        how: "Redis-backed Laravel queues with separated workers under Supervisor process messaging and commerce events, backed by scheduled recovery commands, retry handling, failed-job handling, and message state tracking distributed across jobs and services.",
      },
      {
        code: "0x03",
        title: "Multi-tenant commerce edge",
        front: "Salla and Zid connect through a shared backbone with platform-specific edges.",
        how: "Tenant-scoped resolution selects the correct sender channel, templates, and integration behavior, while OAuth-based installation and signature-verified webhooks drive order, customer, and abandoned-cart messaging workflows per platform.",
      },
    ],
  },
  "autopay-eg": {
    tagline: "My payment product — Vodafone Cash and InstaPay confirmation, built end to end.",
    challenge:
      "Egyptian merchants face payment-gateway costs that scale with sales volume, and manually confirming local wallet transfers eats staff time while delaying orders and risking incorrect matches. Buyers use familiar local payment methods, but confirmation is slow and merchants often cannot tell whether a transfer was received.",
    whatIBuilt:
      "I built this product from the first invoice flow through production: hosted invoices, Android payment-event ingestion, the matching engine, merchant APIs, webhooks, dashboards, WooCommerce and Shopify integrations, and the product design.",
    numbers: [
      { value: "2", label: "Wallet methods automated" },
      { value: "2", label: "Commerce integrations" },
      { value: "HMAC", label: "Signed Android ingestion" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Async payment matching engine",
        front: "The core engine associates a detected transfer with the right open invoice.",
        how: "It evaluates method, destination, amount, sender, reference, transaction ID, and time windows against eligible invoices, resolving exact, fee-adjusted, ambiguous, or manual-review outcomes.",
      },
      {
        code: "0x02",
        title: "Concurrency-safe confirmation",
        front: "Payment evidence is turned into invoice updates without double-confirming or duplicating.",
        how: "Duplicate fingerprints, database transactions with row locking, Redis locks, atomic state transitions, and unique constraints guard every state change through Redis-backed queues.",
      },
      {
        code: "0x03",
        title: "Signed Android ingestion",
        front: "A native Android app captures SMS and notification payment evidence on registered devices.",
        how: "Each device registers, then submits normalized events over HMAC-signed requests with timestamp and replay protection, secure local storage, offline retry, and device revocation.",
      },
    ],
  },
  "riders-shopify-wordpress": {
    challenge:
      "Merchants manage orders inside their commerce platforms while Riders runs the shipping lifecycle externally in Kuwait. Store orders must map accurately into shipping requests, shipment state must stay synchronized, tracking and cancellation must flow back, and failed or duplicate events must never create inconsistent shipments.",
    whatIBuilt:
      "Two separate production integrations for Riders: a Laravel-based embedded Shopify app and a standalone WooCommerce shipping plugin. Both connect merchant storefronts to Riders shipping operations while respecting each platform's distinct lifecycle, authentication, webhook, checkout, and background-processing models.",
    numbers: [
      { value: "2", label: "Production commerce integrations" },
      { value: "2", label: "Public marketplace listings" },
      { value: "1", label: "Shared merchant experience" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Order-to-shipment mapping",
        front: "Store orders are translated into Riders-compatible shipment requests on each platform.",
        how: "Shopify mapping runs in Laravel services over the GraphQL Admin API and order ingestion, while WooCommerce mapping runs through plugin services and checkout/order hooks, mapping customer, Kuwait address, and parcel data into Riders payloads.",
      },
      {
        code: "0x02",
        title: "Idempotent sync and recovery",
        front: "Failed or delayed operations recover without creating duplicate shipments.",
        how: "Duplicate-sync guards, local synchronization state, and background jobs drive reconciliation, retries, and tracking polling, using Shopify API throttling handling and WooCommerce Action Scheduler recovery.",
      },
      {
        code: "0x03",
        title: "Verified webhook processing",
        front: "Lifecycle and status events are handled securely on both platforms.",
        how: "Shopify processes signature-verified order and GDPR webhooks with reconciliation jobs, while WooCommerce exposes an HMAC-verified Riders callback endpoint guarded by nonces, capability checks, and REST permission callbacks.",
      },
    ],
  },
  "alzahaby-loyalty-app": {
    challenge:
      "An electrical-cable manufacturer wanted a direct digital channel to build a closer relationship with customers and make product engagement measurable. The goal was to turn product packaging and codes into an ongoing loyalty experience instead of a static label.",
    whatIBuilt:
      "The Flutter customer app and its App Store and Google Play releases. Customers scan supported QR or product codes, earn points through server-side validation, browse rewards, and submit redemption requests.",
    numbers: [
      { value: "2", label: "App stores (iOS + Android)" },
      { value: "Live", label: "Customer app in production" },
      { value: "QR", label: "Product-code scans" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Server-validated QR scans",
        front: "Scanned codes are trusted only after backend validation, never from the client.",
        how: "The app normalizes a scanned serial or scan URL and submits it; the backend checks the product-code record and eligibility, and points come from the associated product's value rather than any client payload.",
      },
      {
        code: "0x02",
        title: "Duplicate-safe scan handling",
        front: "A product code can only be redeemed once, with clean rejection of reuse.",
        how: "The backend locks the product-code row before processing and enforces a used_at timestamp plus a unique product_code_id constraint on scans, so duplicate or already-used codes are rejected server-side.",
      },
      {
        code: "0x03",
        title: "Ledger-backed points engine",
        front: "Point balances stay consistent and auditable across scans, redemptions, and transfers.",
        how: "A mutable user balance is paired with a points-transactions ledger; the points service locks the user row inside a transaction, blocks negative and zero-value changes, and records signed entries with balance snapshots.",
      },
    ],
  },
  "sim-express": {
    tagline: "Self-service telecom kiosk platform for stc SIM and eSIM activation.",
    challenge:
      "Telecom onboarding in high-demand environments must handle identity verification, inventory control, payment coordination, hardware dependencies, and operational visibility all at once. SIM Express was built for Hajj-oriented, multilingual customer journeys where physical SIM handling and recoverable activation steps all matter.",
    whatIBuilt:
      "I built the backend, the kiosk-facing REST API, the Filament operations dashboard, the stc integration layer, queue-based processing, and the DevOps needed for handover. The multi-tenant platform coordinates inventory, activation, and monitoring across seven kiosk hardware categories for SIM and eSIM sales and activation.",
    numbers: [
      { value: "7", label: "Kiosk hardware categories" },
      { value: "1", label: "stc activation integration" },
      { value: "Multi-tenant", label: "Operations platform" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Queue-based activation",
        front: "Long-running and recoverable activation work runs outside the request path.",
        how: "Redis and Laravel Horizon drive an activation queue with worker dispatch, retry and backoff, failed-job visibility, and scheduled recovery, so the platform recovers cleanly from delays and external failures.",
      },
      {
        code: "0x02",
        title: "Partial-failure recovery",
        front: "The system survives when steps in a multi-hardware flow fail independently.",
        how: "Payment can succeed while activation fails and activation can succeed while dispensing fails, so timeouts, duplicate callbacks, and stuck sessions are handled through state-guarded jobs, cancellation retries, and operator review.",
      },
      {
        code: "0x03",
        title: "Signed, scoped access",
        front: "Kiosks, workers, and the stc integration each authenticate over guarded boundaries.",
        how: "Sanctum and API-key device authentication protect kiosk routes, HMAC-signed and replay-protected callbacks secure worker communication, OAuth2 client credentials authenticate stc, and Spatie permissions enforce multi-tenant scoping.",
      },
    ],
  },
  tawfir: {
    tagline: "UAE surplus-food marketplace for discounted restaurant pickup.",
    challenge:
      "Restaurants often have unsold prepared food, creating waste and lost revenue, while customers want discounted meals. Restaurants need accurate control over quantities, prices, availability, and pickup windows to offer time-sensitive surplus inventory in an organized way.",
    whatIBuilt:
      "A modular Laravel marketplace where restaurants list surplus dishes at discounted prices and customers browse, order, and collect them during scheduled pickup windows. It spans REST APIs for a Flutter client, Filament admin and restaurant dashboards, marketplace workflows, payments, and notifications.",
    numbers: [
      { value: "6", label: "Domain modules" },
      { value: "4", label: "User roles" },
      { value: "2", label: "Notification languages" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Modular Laravel architecture",
        front: "The marketplace is split into independent domain modules for clean separation of concerns.",
        how: "Built on nwidart/laravel-modules, code is divided across Admin, Auth, Notifications, Payment, Restaurant, and User modules, each with its own routes, controllers, services, and models to reduce coupling and enable independent evolution.",
      },
      {
        code: "0x02",
        title: "Stripe Connect payouts",
        front: "Restaurants onboard connected accounts to receive payouts while platform funds stay separated.",
        how: "The Stripe PHP SDK handles payment creation, status tracking, and connected-account onboarding, with asynchronous webhook updates keeping order and payout state in sync while platform and restaurant money boundaries remain isolated.",
      },
      {
        code: "0x03",
        title: "Role-scoped access control",
        front: "Every request is authenticated and scoped to the correct role and restaurant boundary.",
        how: "Laravel Sanctum secures the customer API and dashboards, while Laratrust enforces role and permission boundaries so administrators, restaurant-scoped users, and customers each access only their own data through middleware and server-side rules.",
      },
    ],
  },
  "pdf-extractor": {
    challenge:
      "Business documents may contain embedded text or scanned page images, and manual extraction and correction are slow and inconsistent. Large documents cannot reliably be processed inside one blocking web request, and processing failures should not destroy already extracted content.",
    whatIBuilt:
      "A full-stack Laravel and Vue platform that ingests PDF and Word files, extracts native text where possible, falls back to OCR for scanned pages, processes work asynchronously through queues, and streams live progress to the browser before presenting the final result. Optional AI cleanup can correct extracted text.",
    numbers: [
      { value: "3", label: "Input formats (PDF, DOC, DOCX)" },
      { value: "45 MB", label: "Max upload size" },
      { value: "2", label: "Extraction paths (native + OCR)" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Native-first OCR fallback",
        front: "Each page attempts fast native text extraction before falling back to OCR only when needed.",
        how: "smalot/pdfparser extracts embedded text page by page; when a page returns no native text it is rendered to an image with pdftoppm and run through Tesseract OCR, so scanned pages get processed without wasting OCR work on text-based ones.",
      },
      {
        code: "0x02",
        title: "Queued async pipeline",
        front: "Large documents are processed in the background instead of blocking the request.",
        how: "ProcessPdf, ProcessPdfPage, and ProcessParagraph jobs are chained and sequenced through Laravel queues, preserving page order and persisting job status and page progress so long-running OCR and AI work never times out the browser.",
      },
      {
        code: "0x03",
        title: "Live SSE progress",
        front: "Users watch processing logs and progress update in real time.",
        how: "The Vue frontend opens an EventSource connection and the server streams job status and incremental process logs via Server-Sent Events until completion, at which point the browser closes the stream and the final text is displayed.",
      },
    ],
  },
  pinoyaid: {
    tagline: "Rebuilt crowdfunding platform with multi-gateway payments.",
    challenge:
      "The client needed a customized crowdfunding operation capable of creating and managing campaigns, reviewing submissions, accepting gateway-based donations, tracking donation states, updating campaign progress, and managing balances and withdrawals. The inherited base script was not enough and required major redevelopment.",
    whatIBuilt:
      "A substantially rebuilt Laravel crowdfunding platform covering campaign creation and moderation, donation operations, gateway-driven payment flows, raised-amount and balance updates, withdrawals, administration, and client-specific localization. Most payment integrations were added during the rebuild.",
    numbers: [
      { value: "9", label: "Payment gateways" },
      { value: "11", label: "Donation lifecycle steps" },
      { value: "Laravel 11", label: "PHP 8.3 stack" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Multi-gateway payment architecture",
        front: "The platform normalizes many provider-specific payment flows into one donation workflow.",
        how: "Providers such as Stripe, PayPal, Paystack, Razorpay, MercadoPago, Flutterwave, and NowPayments differ in redirect, capture, callback, webhook, and signature behavior, and the application maps each successful payment into a single crowdfunding donation flow.",
      },
      {
        code: "0x02",
        title: "Payment-state consistency",
        front: "Donation state, campaign totals, and receiver balances stay aligned across every payment outcome.",
        how: "After a callback, capture, or webhook confirms a provider result, the system updates donation status, increments the campaign raised amount, and adjusts the receiver balance, while guarding against duplicate callbacks and handling pending, failed, cancelled, and manually reviewed outcomes.",
      },
      {
        code: "0x03",
        title: "Campaign moderation and withdrawals",
        front: "Campaigns pass through admin review before publication, and funds are released through controlled withdrawals.",
        how: "Campaigns move through creation, submission, admin approval or rejection, and publication with ownership checks enforced in controllers, while user balances feed withdrawal requests with pending, completed, and cancelled states under administrative review.",
      },
    ],
  },
  "chocolate-smart-vending": {
    tagline: "Scan a QR, pay, and the locker opens itself.",
    shipped: "July 2026",
    challenge:
      "Aani & Dani needed a self-service retail experience that could sell chocolate products through secure locker compartments without a traditional staffed checkout, connecting product discovery, payment, and collection to the physical machine while keeping locker-control infrastructure reusable across smart-machine projects.",
    whatIBuilt:
      "A production retail sales platform where customers scan a compartment's QR code, review the product, pay through Moyasar, and automatically get the correct locker door unlocked. The commerce app handles product, order, payment, inventory, admin, and reporting, integrating with a separate reusable Smart Lockers Core for the hardware.",
    numbers: [
      { value: "2", label: "Connected Laravel apps" },
      { value: "11", label: "Steps from scan to collection" },
      { value: "1", label: "Machine live with real payments" },
    ],
    mechanics: [
      {
        code: "0x01",
        title: "Payment-to-unlock orchestration",
        front: "A confirmed payment automatically unlocks the correct locker compartment.",
        how: "Once Moyasar records and verifies the transaction, the sales application creates an authorized unlock operation and hands it to Smart Lockers Core, which finalizes the transaction state only after the door command result returns.",
      },
      {
        code: "0x02",
        title: "HMAC-authenticated MQTT control",
        front: "Door-opening commands travel over authenticated server-to-server messaging to the physical machine.",
        how: "Smart Lockers Core exposes an HMAC-authenticated REST API, publishes commands over MQTT to Raspberry Pi-controlled machines, tracks command execution, and returns completion or failure callbacks to the sales platform.",
      },
      {
        code: "0x03",
        title: "Commerce and hardware separation",
        front: "Business logic and machine control live in two independent, reusable applications.",
        how: "The Chocolate sales platform owns storefront, QR resolution, payments, and inventory, while the separate Smart Lockers Core owns locker state and device communication, keeping the machine-control infrastructure reusable across other smart-machine implementations.",
      },
    ],
  },
};

/** Compact a stack list into a single "A · B · C +N" line. */
function stackLine(tech: readonly string[]): string {
  const head = tech.slice(0, 4);
  const extra = tech.length - head.length;
  return head.join(" · ") + (extra > 0 ? ` +${extra}` : "");
}

/**
 * Fallback for the numbers panel: split a headline metric string on its
 * separators and lift a leading figure out of each chunk.
 */
function splitMetric(metric: string): DossierNumber[] {
  return metric
    .split(/\s*[·;]\s*/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const match = chunk.match(/^([^\s]+(?:\s*[A-Za-z%+]{1,4}\+?)?)\s+(.+)$/);
      if (match && /\d/.test(match[1])) {
        return { value: match[1].trim(), label: match[2].trim() };
      }
      return { value: chunk, label: "" };
    });
}

/**
 * Merge authored dossier copy with derived fallbacks so every system renders a
 * coherent dossier even before its copy is authored.
 */
export function resolveDossier(system: OrbitSystem): ResolvedDossier {
  const authored = ORBIT_DOSSIERS[system.slug] ?? {};
  const caseStudy = isCaseStudySlug(system.slug)
    ? CASE_STUDY_PRESENTATION[system.slug]
    : undefined;

  const numbers =
    authored.numbers && authored.numbers.length > 0
      ? authored.numbers
      : splitMetric(system.metric);

  const mechanics =
    authored.mechanics && authored.mechanics.length > 0
      ? authored.mechanics
      : caseStudy
        ? caseStudy.decisions.slice(0, 3).map((decision, index) => ({
            code: `0x0${index + 1}`,
            title: decision.heading,
            front: decision.problem,
            how: decision.effect,
          }))
        : [];

  return {
    tagline: authored.tagline,
    role: publicProjectRole(system.slug),
    shipped: authored.shipped,
    stackLine: stackLine(system.tech),
    challenge: authored.challenge ?? caseStudy?.situation,
    whatIBuilt: authored.whatIBuilt ?? caseStudy?.outcome ?? system.summary,
    numbers,
    mechanics,
  };
}
