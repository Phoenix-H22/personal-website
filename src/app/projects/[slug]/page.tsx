import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyPage } from "@/components/portfolio/case-study/case-study-page";
import { ProjectDossierPage } from "@/components/portfolio/project-page/project-dossier-page";
import { isCaseStudySlug } from "@/lib/portfolio/case-studies";
import { buildProjectPageMetadata } from "@/lib/metadata/projects";
import {
  CANONICAL_PROJECT_SLUGS,
  isCanonicalProjectSlug,
} from "@/lib/portfolio/projects/canonical-projects";
import { getProjectBySlug } from "@/lib/portfolio/projects";

interface ProjectSlugPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CANONICAL_PROJECT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { robots: { index: false, follow: false } };
  return buildProjectPageMetadata(project);
}

export default async function ProjectSlugPage({ params }: ProjectSlugPageProps) {
  const { slug } = await params;
  if (!isCanonicalProjectSlug(slug)) notFound();

  if (isCaseStudySlug(slug)) {
    return <CaseStudyPage slug={slug} />;
  }

  return <ProjectDossierPage slug={slug} />;
}
