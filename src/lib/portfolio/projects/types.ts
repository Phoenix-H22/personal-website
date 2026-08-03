/**
 * Portfolio project domain types (S2-PRE).
 * UI must consume these via ProjectRepository — never import raw content arrays.
 */

export type ProjectStatus =
  | "live"
  | "in-development"
  | "completed"
  | "maintained"
  | "archived";

export type ProjectPublicationStatus =
  | "draft"
  | "review"
  | "published"
  | "hidden";

export type ProjectVisibility = "public" | "unlisted" | "private";

export type ProjectConfidentiality =
  | "public"
  | "public-limited"
  | "private"
  | "internal-only";

export type EvidenceStatus =
  | "verified"
  | "owner-confirmed"
  | "source-supported"
  | "unverified"
  | "not-applicable";

export interface ProjectPeriod {
  start: string | null;
  end: string | null;
  label?: string;
}

export interface ProjectCompanyReference {
  id: string;
  name: string;
  publishName: boolean;
}

export interface ProjectMetric {
  id: string;
  value: string;
  label: string;
  context?: string;
  evidenceStatus: EvidenceStatus;
  public: boolean;
}

export interface ProjectLink {
  type:
    | "live"
    | "repository"
    | "demo"
    | "store"
    | "article"
    | "documentation";
  label: string;
  url: string;
  public: boolean;
}

export interface ProjectMediaVariant {
  src: string;
  width: number;
  type?: string;
}

export interface ProjectMedia {
  id: string;
  type: "image" | "video" | "diagram" | "logo";
  role?: "cover" | "gallery" | "diagram" | "logo" | "og";
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  credit?: string;
  blurDataURL?: string;
  focalPoint?: { x: number; y: number };
  variants?: ProjectMediaVariant[];
  sortOrder?: number;
  darkThemeSuitable?: boolean;
  mobileCrop?: "center" | "top" | "focal";
}

export type ProjectCoverType =
  | "merchant-operations"
  | "messaging-router"
  | "vending-device-flow"
  | "virtual-clinic-loop";

export type ProjectHomepageCategory =
  | "commerce"
  | "messaging"
  | "iot"
  | "ai-healthcare";

export interface ProjectVisualTheme {
  id: string;
  primary: "cyan" | "blue" | "violet" | "green" | "amber";
  secondary?: "cyan" | "blue" | "violet" | "green" | "amber";
  motif:
    | "order-lifecycle"
    | "message-routing"
    | "scan-pay-release"
    | "city-map"
    | "clinic-flow"
    | "document-pipeline"
    | "neutral";
  coverType: ProjectCoverType;
  homepageCategory: ProjectHomepageCategory;
}

export interface ProjectSeo {
  title: string;
  description: string;
  canonicalPath: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImageId?: string;
  robots: { index: boolean; follow: boolean };
  structuredDataType:
    | "CreativeWork"
    | "SoftwareApplication"
    | "WebApplication"
    | "MobileApplication";
  publishedAt?: string;
  modifiedAt: string;
}

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  summary: string;
  status: ProjectStatus;
  publicationStatus: ProjectPublicationStatus;
  visibility: ProjectVisibility;
  confidentiality: ProjectConfidentiality;
  period: ProjectPeriod;
  company?: ProjectCompanyReference;
  domains: string[];
  roles: string[];
  platforms: string[];
  technologies: string[];
  ownershipSummary: string;
  strongestProof?: ProjectMetric;
  featured: boolean;
  homepageOrder: number | null;
  workOrder: number;
  cover: ProjectMedia | null;
  visualTheme: ProjectVisualTheme;
  caseStudyAvailable: boolean;
  seo: Pick<ProjectSeo, "title" | "description" | "robots">;
}

export type ProjectTextBlockType =
  | "overview"
  | "context"
  | "problem"
  | "ownership"
  | "constraints"
  | "workflow"
  | "implementation"
  | "integration"
  | "reliability"
  | "security"
  | "performance"
  | "difficult-edge-case"
  | "outcome"
  | "lesson"
  | "retrospective"
  | "next-step";

interface ProjectBlockBase {
  id: string;
  order: number;
  publicationStatus: ProjectPublicationStatus;
  heading?: string;
  anchor?: string;
}

export interface ProjectTextBlock extends ProjectBlockBase {
  type: ProjectTextBlockType;
  body: string;
}

export interface ProjectListBlock extends ProjectBlockBase {
  type: "constraints-list" | "technologies-list";
  items: string[];
}

export interface ProjectArchitectureBlock extends ProjectBlockBase {
  type: "architecture";
  summary: string;
  nodes: {
    id: string;
    label: string;
    detail: string;
    kind: string;
  }[];
  connections: { from: string; to: string }[];
  textAlternative: string;
}

export interface ProjectDecisionBlock extends ProjectBlockBase {
  type: "engineering-decision";
  context: string;
  decision: string;
  alternativesRejected?: string[];
  tradeOff: string;
  outcome: string;
}

export interface ProjectMetricGroupBlock extends ProjectBlockBase {
  type: "metrics";
  metricIds: string[];
}

export interface ProjectMediaBlock extends ProjectBlockBase {
  type: "image" | "video";
  mediaId: string;
}

export interface ProjectGalleryBlock extends ProjectBlockBase {
  type: "gallery";
  mediaIds: string[];
}

export interface ProjectDiagramBlock extends ProjectBlockBase {
  type: "system-diagram";
  diagramId: string;
  textAlternative: string;
}

export interface ProjectQuoteBlock extends ProjectBlockBase {
  type: "quote";
  quote: string;
  attribution?: string;
}

export type ProjectCaseStudyBlock =
  | ProjectTextBlock
  | ProjectListBlock
  | ProjectArchitectureBlock
  | ProjectDecisionBlock
  | ProjectMetricGroupBlock
  | ProjectMediaBlock
  | ProjectGalleryBlock
  | ProjectDiagramBlock
  | ProjectQuoteBlock;

export interface ProjectCaseStudy extends ProjectSummary {
  problem: string;
  ownership: string;
  constraints: string[];
  metrics: ProjectMetric[];
  links: ProjectLink[];
  gallery: ProjectMedia[];
  blocks: ProjectCaseStudyBlock[];
  seo: ProjectSeo;
  publishedAt?: string;
  updatedAt: string;
  relatedSlugs: string[];
}

export interface ProjectFilters {
  domain?: string[];
  role?: string[];
  platform?: string[];
  technology?: string[];
  status?: ProjectStatus[];
  search?: string;
}

export interface ProjectPagination {
  page: number;
  pageSize: number;
}

export interface ProjectCollection {
  items: ProjectSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProjectQueryOptions {
  locale?: string;
  /** Public repository implementations must ignore or reject this. */
  includeDrafts?: boolean;
}

export interface ProjectFilterOptions {
  domains: { value: string; count: number }[];
  roles: { value: string; count: number }[];
  platforms: { value: string; count: number }[];
  technologies: { value: string; count: number }[];
  statuses: { value: ProjectStatus; count: number }[];
}

export interface ProjectRepository {
  getFeaturedProjects(): Promise<ProjectSummary[]>;
  getProjects(
    filters?: ProjectFilters,
    pagination?: ProjectPagination,
  ): Promise<ProjectCollection>;
  getProjectBySlug(
    slug: string,
    options?: ProjectQueryOptions,
  ): Promise<ProjectCaseStudy | null>;
  getPublishedSlugs(): Promise<string[]>;
  getProjectFilterOptions(): Promise<ProjectFilterOptions>;
}

export type PublicOwnershipType =
  | "founder-built"
  | "built-entirely"
  | "backend-devops-owner"
  | "technical-owner"
  | "lead-developer"
  | "major-contributor";

export type PublicProjectStatus =
  | "live"
  | "active-development"
  | "completed"
  | "completed-before-launch"
  | "archived";

export type PublicProjectCategory =
  | "platforms-saas"
  | "commerce"
  | "mobile-products"
  | "fintech-payments"
  | "connected-devices"
  | "integrations"
  | "ai-data"
  | "healthcare";

export type PublicCapability =
  | "Backend Architecture"
  | "DevOps"
  | "High Scale"
  | "Multi-Tenancy"
  | "MQTT"
  | "Raspberry Pi"
  | "Payments"
  | "External APIs"
  | "Mobile Apps"
  | "Shopify"
  | "WordPress"
  | "AI / OCR"
  | "Queues / Horizon"
  | "Security"
  | "Real-Time Updates";

export interface PublicVerifiedMetric {
  value: string;
  label: string;
  context: string | null;
  evidence: "verified" | "owner-confirmed" | "source-supported";
}

export interface PublicProjectLinks {
  website: string | null;
  publicGitHub: string | null;
  appStore: string | null;
  googlePlay: string | null;
}

export interface PublicCaseStudyData {
  heroStatement: string;
  problem: string;
  ownership: string;
  sections: Array<{
    id: string;
    heading: string;
    body: string;
  }>;
}

export interface PublicProjectContent {
  id: string;
  slug: import("@/lib/portfolio/projects/canonical-projects").CanonicalProjectSlug;
  title: import("@/lib/portfolio/projects/canonical-projects").CanonicalProjectTitle;
  shortTagline: string;
  publicSummary: string;
  role: string;
  ownershipType: PublicOwnershipType;
  status: PublicProjectStatus;
  primaryCategory: PublicProjectCategory;
  secondaryCategory: PublicProjectCategory | null;
  systemType: string;
  strongestCapability: string;
  technologies: string[];
  capabilities: PublicCapability[];
  verifiedMetrics: PublicVerifiedMetric[];
  links: PublicProjectLinks;
  featured: boolean;
  featuredOrder: number | null;
  listingOrder: number;
  lastReviewed: string;
  confidentiality: "public" | "public-limited";
  caseStudyAvailability: "hidden" | "planned" | "published";
  caseStudy: PublicCaseStudyData | null;
}

export interface PublicProject extends PublicProjectContent {
  cover: import("@/lib/portfolio/projects/media-schema").PublicMediaAsset;
  coverCard: import("@/lib/portfolio/projects/media-schema").PublicMediaAsset;
  architectureDiagram: import("@/lib/portfolio/projects/media-schema").PublicMediaAsset | null;
  gallery: import("@/lib/portfolio/projects/media-schema").PublicMediaAsset[];
}

export interface PublicProjectsSnapshot {
  schemaVersion: 1;
  projects: PublicProjectContent[];
}

export interface FeaturedProjectDto {
  id: string;
  slug: string;
  title: string;
  shortTagline: string;
  role: string;
  ownershipType: PublicOwnershipType;
  status: PublicProjectStatus;
  primaryCategory: PublicProjectCategory;
  systemType: string;
  strongestCapability: string;
  technologies: string[];
  strongestMetric: PublicVerifiedMetric | null;
  website: string | null;
  cover: import("@/lib/portfolio/projects/media-schema").PublicMediaAsset;
  coverCard: import("@/lib/portfolio/projects/media-schema").PublicMediaAsset;
  caseStudyAvailable: boolean;
}

export interface WorkIndexProjectDto extends FeaturedProjectDto {
  publicSummary: string;
  secondaryCategory: PublicProjectCategory | null;
  listingOrder: number;
  links: PublicProjectLinks;
}

export interface ProjectDetailDto extends WorkIndexProjectDto {
  capabilities: PublicCapability[];
  verifiedMetrics: PublicVerifiedMetric[];
  architectureDiagram: import("@/lib/portfolio/projects/media-schema").PublicMediaAsset | null;
  gallery: import("@/lib/portfolio/projects/media-schema").PublicMediaAsset[];
  lastReviewed: string;
  confidentiality: "public" | "public-limited";
  caseStudy: PublicCaseStudyData | null;
}
