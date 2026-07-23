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
