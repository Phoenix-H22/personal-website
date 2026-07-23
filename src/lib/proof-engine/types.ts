export type ProofArtifactKind =
  | "credential"
  | "commerce-scale"
  | "education-journey"
  | "product"
  | "brand-core";

export type ArtifactPriority = "primary" | "secondary" | "supporting";

export type ArtifactAccent =
  | "cyan"
  | "blue"
  | "amber"
  | "violet"
  | "upwork-green"
  | "communication-green";

export type CompositionMode = "cinematic" | "layered" | "narrative";

export interface ExternalLink {
  label: string;
  href: string;
  ariaLabel?: string;
  isExternal?: boolean;
}

export interface Metric {
  id: string;
  value: string;
  label: string;
  context?: string;
  accent?: ArtifactAccent;
}

export interface ProofArtifactBase {
  id: string;
  kind: ProofArtifactKind;
  title: string;
  eyebrow?: string;
  summary?: string;
  priority: ArtifactPriority;
  accent: ArtifactAccent;
  visibleIn: CompositionMode[];
  href?: string | null;
  asset?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  } | null;
  status?: "verified" | "temporary-mark" | "asset-missing";
  sortOrder: number;
}

export interface CredentialArtifact extends ProofArtifactBase {
  kind: "credential";
  provider: "upwork";
  credential: string;
  score: {
    value: number;
    unit: "%";
    label: string;
  };
  profileLink?: ExternalLink | null;
}

export interface CommerceScaleArtifact extends ProofArtifactBase {
  kind: "commerce-scale";
  scope: string;
  metrics: Metric[];
  flow: Array<{
    id: string;
    label: string;
  }>;
}

export interface EducationMilestone {
  id: string;
  institution: string;
  period: string;
  qualification: string;
  highlight?: string;
  mark?: {
    src: string;
    alt: string;
  } | null;
}

export interface EducationJourneyArtifact extends ProofArtifactBase {
  kind: "education-journey";
  startYear: number;
  endYear: number;
  milestones: EducationMilestone[];
}

export type ProductVisualKind =
  | "map-phone"
  | "vending-machine"
  | "message-signal";

export interface ProductArtifact extends ProofArtifactBase {
  kind: "product";
  slug: string;
  visualKind: ProductVisualKind;
  domain: string;
  projectStatus: "public" | "private" | "case-study-planned";
  technologyHints?: string[];
}

export interface BrandCoreArtifact extends ProofArtifactBase {
  kind: "brand-core";
  mark: "AK";
  tagline?: string;
}

export type ProofArtifact =
  | CredentialArtifact
  | CommerceScaleArtifact
  | EducationJourneyArtifact
  | ProductArtifact
  | BrandCoreArtifact;

export interface ProofEngineHeroContent {
  eyebrow: string;
  name: string;
  headline: string;
  headlineEmphasis?: string;
  summary: string;
  primaryAction: ExternalLink;
  secondaryAction: ExternalLink;
  socialActions: ExternalLink[];
  artifacts: ProofArtifact[];
}
