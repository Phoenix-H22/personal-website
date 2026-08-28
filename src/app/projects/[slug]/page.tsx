import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrbitDossierRoute } from "@/components/portfolio/projects-orbit/orbit-dossier-route";
import { ProjectsOrbit } from "@/components/portfolio/projects-orbit/projects-orbit";
import { JsonLd } from "@/components/seo/json-ld";
import { buildProjectPageMetadata, getProjectJsonLd } from "@/lib/metadata/projects";
import { getSiteUrl } from "@/lib/metadata/site";
import { getProjectBySlug } from "@/lib/portfolio/projects";
import {
  CANONICAL_PROJECT_SLUGS,
  isCanonicalProjectSlug,
} from "@/lib/portfolio/projects/canonical-projects";

interface ProjectSlugPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;
export const dynamic = "force-static";

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

/**
 * Shared project URLs render the orbit with that system's dossier open.
 * Dedicated long-form project documents stay in the codebase unused for now.
 */
export default async function ProjectSlugPage({ params }: ProjectSlugPageProps) {
  const { slug } = await params;
  if (!isCanonicalProjectSlug(slug)) notFound();

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <ProjectsOrbit />
      <OrbitDossierRoute slug={slug} />
      <JsonLd data={getProjectJsonLd(project, getSiteUrl())} />
    </>
  );
}
