import { NextResponse } from "next/server";

import { buildProjectPageMetadata } from "@/lib/metadata/projects";
import { renderSocialCardHtml } from "@/lib/metadata/social-card-html";
import { getSiteUrl } from "@/lib/metadata/site";
import { projectSocialImagePath } from "@/lib/metadata/social-image";
import { getProjectBySlug } from "@/lib/portfolio/projects";
import { isCanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";
import { projectPath } from "@/lib/portfolio/projects/project-routes";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!isCanonicalProjectSlug(slug)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const project = await getProjectBySlug(slug);
  if (!project) {
    return new NextResponse("Not found", { status: 404 });
  }

  const siteUrl = getSiteUrl();
  const metadata = buildProjectPageMetadata(project);
  const title = String(metadata.openGraph?.title ?? metadata.title);
  const description = String(metadata.openGraph?.description ?? metadata.description);

  return new Response(
    renderSocialCardHtml({
      title,
      description,
      url: new URL(projectPath(slug), siteUrl).toString(),
      image: new URL(projectSocialImagePath(slug), siteUrl).toString(),
      imageAlt: `${project.title} — ${project.systemType}`,
      type: "article",
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
