import { getProjectsIndexMetadata } from "@/lib/metadata/projects";
import { renderSocialCardHtml } from "@/lib/metadata/social-card-html";
import { getSiteUrl } from "@/lib/metadata/site";
import { projectsIndexSocialImagePath } from "@/lib/metadata/social-image";
import { PROJECTS_INDEX_PATH } from "@/lib/portfolio/projects/project-routes";

export function GET() {
  const siteUrl = getSiteUrl();
  const metadata = getProjectsIndexMetadata();
  const title = String(metadata.openGraph?.title ?? metadata.title);
  const description = String(metadata.openGraph?.description ?? metadata.description);

  return new Response(
    renderSocialCardHtml({
      title,
      description,
      url: new URL(PROJECTS_INDEX_PATH, siteUrl).toString(),
      image: new URL(projectsIndexSocialImagePath(), siteUrl).toString(),
      imageAlt: "Projects orbit — 13 production systems by Abdalrhman M. Alkady",
      type: "website",
    }),
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
