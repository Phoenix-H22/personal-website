import { notFound } from "next/navigation";

import { OrbitDossierRoute } from "@/components/portfolio/projects-orbit/orbit-dossier-route";
import { isCanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";

interface InterceptedProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function InterceptedProjectPage({
  params,
}: InterceptedProjectPageProps) {
  const { slug } = await params;
  if (!isCanonicalProjectSlug(slug)) notFound();
  return <OrbitDossierRoute slug={slug} dismissWithBack />;
}
