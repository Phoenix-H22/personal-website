import { isCaseStudySlug } from "@/lib/portfolio/case-studies";
import snapshot from "@/lib/portfolio/projects/data/public-projects.snapshot.json";
import { PROJECTS_INDEX_PATH } from "@/lib/portfolio/projects/project-routes";
import { RECRUITER_PROFILE } from "@/lib/portfolio/recruiter-profile";

import { renderSocialCardHtml } from "@/lib/metadata/social-card-html";
import {
  projectSocialImagePath,
  projectsIndexSocialImagePath,
} from "@/lib/metadata/social-image";

const PROJECTS_INDEX_TITLE = "Projects | Production Systems Map";
const PROJECTS_INDEX_DESCRIPTION =
  "Thirteen production systems built by Software Engineer Abdalrhman M. Alkady — commerce, payments, messaging, connected hardware, and SaaS, mapped as a systems orbit.";

const SOCIAL_DESCRIPTION_MAX = 160;

function clipSocialText(value: string): string {
  const text = value.trim();
  if (text.length <= SOCIAL_DESCRIPTION_MAX) return text;
  return `${text.slice(0, SOCIAL_DESCRIPTION_MAX - 1).replace(/\s+\S*$/, "")}…`;
}

function projectOgTitle(title: string, systemType: string, slug: string): string {
  if (isCaseStudySlug(slug)) return `${title} — Engineering Case Study`;
  return `${title} — ${systemType}`;
}

export function getSocialPreviewHtml(
  pathname: string,
  siteUrl: URL,
): string | null {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === PROJECTS_INDEX_PATH) {
    const title = `${PROJECTS_INDEX_TITLE} — ${RECRUITER_PROFILE.name}`;
    return renderSocialCardHtml({
      title,
      description: PROJECTS_INDEX_DESCRIPTION,
      url: new URL(PROJECTS_INDEX_PATH, siteUrl).toString(),
      image: new URL(projectsIndexSocialImagePath(), siteUrl).toString(),
      imageAlt: "Projects orbit — 13 production systems by Abdalrhman M. Alkady",
      type: "website",
    });
  }

  const match = /^\/projects\/([^/]+)$/.exec(path);
  if (!match) return null;

  const slug = match[1];
  const project = snapshot.projects.find((item) => item.slug === slug);
  if (!project) return null;

  const description = clipSocialText(project.shortTagline || project.publicSummary);
  const title = projectOgTitle(project.title, project.systemType, project.slug);

  return renderSocialCardHtml({
    title,
    description,
    url: new URL(`/projects/${slug}`, siteUrl).toString(),
    image: new URL(projectSocialImagePath(slug), siteUrl).toString(),
    imageAlt: `${project.title} — ${project.systemType}`,
    type: "article",
  });
}
