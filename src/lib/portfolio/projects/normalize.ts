import type {
  FeaturedProjectDto,
  ProjectDetailDto,
  PublicProject,
  WorkIndexProjectDto,
} from "@/lib/portfolio/projects/types";

export function toFeaturedProjectDto(project: PublicProject): FeaturedProjectDto {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortTagline: project.shortTagline,
    role: project.role,
    ownershipType: project.ownershipType,
    status: project.status,
    primaryCategory: project.primaryCategory,
    systemType: project.systemType,
    strongestCapability: project.strongestCapability,
    technologies: project.technologies.slice(0, 3),
    strongestMetric: project.verifiedMetrics[0] ?? null,
    website: project.links.website,
    cover: project.cover,
    coverCard: project.coverCard,
    caseStudyAvailable: project.caseStudyAvailability === "published",
  };
}

export function toWorkIndexProjectDto(project: PublicProject): WorkIndexProjectDto {
  return {
    ...toFeaturedProjectDto(project),
    publicSummary: project.publicSummary,
    secondaryCategory: project.secondaryCategory,
    listingOrder: project.listingOrder,
    links: project.links,
    technologies: project.technologies.slice(0, 4),
  };
}

export function toProjectDetailDto(project: PublicProject): ProjectDetailDto {
  return {
    ...toWorkIndexProjectDto(project),
    technologies: project.technologies.slice(0, 10),
    capabilities: [...project.capabilities],
    verifiedMetrics: [...project.verifiedMetrics],
    architectureDiagram: project.architectureDiagram,
    gallery: [...project.gallery],
    lastReviewed: project.lastReviewed,
    confidentiality: project.confidentiality,
    caseStudy: project.caseStudy,
  };
}
