import type { ProjectCaseStudyDto } from "@/lib/portfolio/projects/schemas";
import type {
  ProjectCaseStudy,
  ProjectSummary,
} from "@/lib/portfolio/projects/types";

/** Strip non-public fields for public repository responses. */
export function toPublicCaseStudy(dto: ProjectCaseStudyDto): ProjectCaseStudy {
  return {
    ...dto,
    metrics: dto.metrics.filter((metric) => metric.public),
    links: dto.links.filter((link) => link.public),
    strongestProof:
      dto.strongestProof && dto.strongestProof.public
        ? dto.strongestProof
        : undefined,
    blocks: dto.blocks.filter(
      (block) => block.publicationStatus === "published",
    ),
    seo: dto.seo,
  };
}

export function toProjectSummary(project: ProjectCaseStudy): ProjectSummary {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortTitle: project.shortTitle,
    subtitle: project.subtitle,
    summary: project.summary,
    status: project.status,
    publicationStatus: project.publicationStatus,
    visibility: project.visibility,
    confidentiality: project.confidentiality,
    period: project.period,
    company: project.company,
    domains: project.domains,
    roles: project.roles,
    platforms: project.platforms,
    technologies: project.technologies,
    ownershipSummary: project.ownershipSummary,
    strongestProof: project.strongestProof,
    featured: project.featured,
    homepageOrder: project.homepageOrder,
    workOrder: project.workOrder,
    cover: project.cover,
    visualTheme: project.visualTheme,
    caseStudyAvailable: project.caseStudyAvailable,
    seo: {
      title: project.seo.title,
      description: project.seo.description,
      robots: project.seo.robots,
    },
  };
}

export function isPubliclyListable(project: {
  publicationStatus: ProjectCaseStudyDto["publicationStatus"];
  visibility: ProjectCaseStudyDto["visibility"];
  confidentiality: ProjectCaseStudyDto["confidentiality"];
}): boolean {
  return (
    project.publicationStatus === "published" &&
    project.visibility !== "private" &&
    project.confidentiality !== "internal-only"
  );
}
