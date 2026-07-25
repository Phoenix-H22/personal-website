import type {
  ProjectCoverType,
  ProjectHomepageCategory,
  ProjectSummary,
} from "@/lib/portfolio/projects/types";

export interface FeaturedSystemCardProps {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  summary: string;
  domains: string[];
  ownershipSummary: string;
  technologies: string[];
  status: ProjectSummary["status"];
  confidentialityLabel: string | null;
  strongestProof: {
    value: string;
    label: string;
  } | null;
  logoSrc: string | null;
  logoAlt: string | null;
  coverType: ProjectCoverType;
  homepageCategory: ProjectHomepageCategory;
  categoryLabel: string;
  primary: ProjectSummary["visualTheme"]["primary"];
  companyName: string | null;
  caseStudyHref: string | null;
  isFlagship: boolean;
}

export const FEATURED_CATEGORY_LABELS: Record<
  ProjectHomepageCategory | "all",
  string
> = {
  all: "All Systems",
  commerce: "Commerce",
  messaging: "Messaging",
  iot: "IoT",
  "ai-healthcare": "AI & Healthcare",
};

export function toFeaturedSystemCard(
  project: ProjectSummary,
): FeaturedSystemCardProps {
  const logo = project.cover?.type === "logo" ? project.cover : null;
  const homepageCategory = project.visualTheme.homepageCategory;

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortTitle: project.shortTitle,
    subtitle: project.subtitle,
    summary: project.summary,
    domains: project.domains.slice(0, 3),
    ownershipSummary: project.ownershipSummary,
    technologies: project.technologies.slice(0, 6),
    status: project.status,
    confidentialityLabel:
      project.confidentiality === "public-limited"
        ? "Public-safe system view"
        : null,
    strongestProof: project.strongestProof
      ? {
          value: project.strongestProof.value,
          label: project.strongestProof.label,
        }
      : null,
    logoSrc: logo?.src ?? null,
    logoAlt: logo?.alt ?? null,
    coverType: project.visualTheme.coverType,
    homepageCategory,
    categoryLabel: FEATURED_CATEGORY_LABELS[homepageCategory],
    primary: project.visualTheme.primary,
    companyName: project.company?.publishName ? project.company.name : null,
    caseStudyHref: null,
    isFlagship: project.homepageOrder === 1,
  };
}
