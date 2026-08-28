import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import {
  buildProjectPageMetadata,
  getProjectJsonLd,
  getProjectsIndexJsonLd,
  getProjectsIndexMetadata,
} from "@/lib/metadata/projects";
import { getSiteUrl } from "@/lib/metadata/site";
import { getProjectBySlug } from "@/lib/portfolio/projects";
import {
  CANONICAL_PROJECT_SLUGS,
  isCanonicalProjectSlug,
} from "@/lib/portfolio/projects/canonical-projects";

interface ProjectsPageProps {
  params: Promise<{ slug?: string[] }>;
}

export const dynamicParams = false;
export const dynamic = "force-static";

export function generateStaticParams() {
  return [
    { slug: [] },
    ...CANONICAL_PROJECT_SLUGS.map((slug) => ({ slug: [slug] })),
  ];
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { slug: parts } = await params;
  const slug = parts?.[0];
  if (!slug) return getProjectsIndexMetadata();
  const project = await getProjectBySlug(slug);
  if (!project) return { robots: { index: false, follow: false } };
  return buildProjectPageMetadata(project);
}

/**
 * Listing and shareable /projects/[slug] are the same page so Next never
 * treats dossier URL changes as a different route tree. The overlay lives in
 * the layout orbit and syncs the URL on the client.
 */
export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { slug: parts } = await params;
  const slug = parts?.[0];
  if (!slug) {
    return <JsonLd data={getProjectsIndexJsonLd(getSiteUrl())} />;
  }
  if (!isCanonicalProjectSlug(slug)) notFound();

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return <JsonLd data={getProjectJsonLd(project, getSiteUrl())} />;
}
