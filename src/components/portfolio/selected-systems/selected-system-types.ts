import type { ProjectSummary } from "@/lib/portfolio/projects/types";

/** Serializable public props for Selected Systems client islands. */
export interface SelectedSystemCardProps {
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
  motif: ProjectSummary["visualTheme"]["motif"];
  primary: ProjectSummary["visualTheme"]["primary"];
  companyName: string | null;
  caseStudyHref: string | null;
}

export function toSelectedSystemCard(
  project: ProjectSummary,
): SelectedSystemCardProps {
  const logo =
    project.cover?.type === "logo"
      ? project.cover
      : null;

  // Prefer gallery logo from summary path — cover is usually null; logo comes via
  // a parallel field only on case studies. For summaries we use visualTheme + title.
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
    motif: project.visualTheme.motif,
    primary: project.visualTheme.primary,
    companyName:
      project.company?.publishName ? project.company.name : null,
    caseStudyHref: null,
  };
}

/** Attach logo from full case study when mapping featured summaries. */
export function withLogo(
  card: SelectedSystemCardProps,
  src: string | null,
  alt: string | null,
): SelectedSystemCardProps {
  return { ...card, logoSrc: src, logoAlt: alt };
}
