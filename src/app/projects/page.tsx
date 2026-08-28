import { ProjectsOrbit } from "@/components/portfolio/projects-orbit/projects-orbit";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getProjectsIndexJsonLd,
  getProjectsIndexMetadata,
} from "@/lib/metadata/projects";
import { getSiteUrl } from "@/lib/metadata/site";

export const metadata = getProjectsIndexMetadata();
export const dynamic = "force-static";

export default function ProjectsReelPage() {
  return (
    <>
      <ProjectsOrbit />
      <JsonLd data={getProjectsIndexJsonLd(getSiteUrl())} />
    </>
  );
}
