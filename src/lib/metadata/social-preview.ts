import { isCaseStudySlug } from "@/lib/portfolio/case-studies";
import snapshot from "@/lib/portfolio/projects/data/public-projects.snapshot.json";
import { PROJECTS_INDEX_PATH } from "@/lib/portfolio/projects/project-routes";
import { RECRUITER_PROFILE } from "@/lib/portfolio/recruiter-profile";

import { HOME_IMAGE_ALT, HOME_OG_DESCRIPTION, HOME_PATH, HOME_TITLE } from "@/lib/metadata/home";
import { renderSocialCardHtml } from "@/lib/metadata/social-card-html";
import {
  homeSocialImagePath,
  projectSocialImagePath,
  projectsIndexSocialImagePath,
} from "@/lib/metadata/social-image";

const PROJECTS_INDEX_TITLE = "Projects | Production Systems Map";
const PROJECTS_INDEX_DESCRIPTION =
  "Thirteen production systems built by Software Engineer Abdalrhman M. Alkady — commerce, payments, messaging, connected hardware, and SaaS, mapped as a systems orbit.";

const SOCIAL_DESCRIPTION_MAX = 160;
const catalogs = new Map<string, ReadonlyMap<string, string>>();

function clipSocialText(value: string): string {
  const text = value.trim();
  if (text.length <= SOCIAL_DESCRIPTION_MAX) return text;
  return `${text.slice(0, SOCIAL_DESCRIPTION_MAX - 1).replace(/\s+\S*$/, "")}…`;
}

function projectOgTitle(title: string, systemType: string, slug: string): string {
  if (isCaseStudySlug(slug)) return `${title} — Engineering Case Study`;
  return `${title} — ${systemType}`;
}

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function buildSocialPreviewCatalog(
  siteUrl: URL,
): ReadonlyMap<string, string> {
  const catalog = new Map<string, string>();
  const homeImage = new URL(homeSocialImagePath(), siteUrl).toString();
  const homeUrl = new URL(HOME_PATH, siteUrl).toString();
  const homeCard = renderSocialCardHtml({
    title: HOME_TITLE,
    description: clipSocialText(HOME_OG_DESCRIPTION),
    url: homeUrl,
    image: homeImage,
    imageAlt: HOME_IMAGE_ALT,
    type: "website",
  });
  catalog.set(HOME_PATH, homeCard);
  catalog.set("/v2", homeCard);

  const title = `${PROJECTS_INDEX_TITLE} — ${RECRUITER_PROFILE.name}`;

  catalog.set(
    PROJECTS_INDEX_PATH,
    renderSocialCardHtml({
      title,
      description: clipSocialText(PROJECTS_INDEX_DESCRIPTION),
      url: new URL(PROJECTS_INDEX_PATH, siteUrl).toString(),
      image: new URL(projectsIndexSocialImagePath(), siteUrl).toString(),
      imageAlt: "Projects orbit — 13 production systems by Abdalrhman M. Alkady",
      type: "website",
    }),
  );

  for (const project of snapshot.projects) {
    catalog.set(
      `/projects/${project.slug}`,
      renderSocialCardHtml({
        title: projectOgTitle(project.title, project.systemType, project.slug),
        description: clipSocialText(project.shortTagline || project.publicSummary),
        url: new URL(`/projects/${project.slug}`, siteUrl).toString(),
        image: new URL(projectSocialImagePath(project.slug), siteUrl).toString(),
        imageAlt: `${project.title} — ${project.systemType}`,
        type: "article",
      }),
    );
  }

  return catalog;
}

export function getSocialPreviewHtml(
  pathname: string,
  siteUrl: URL,
): string | null {
  const origin = siteUrl.origin;
  let catalog = catalogs.get(origin);
  if (!catalog) {
    catalog = buildSocialPreviewCatalog(siteUrl);
    catalogs.set(origin, catalog);
  }
  return catalog.get(normalizePath(pathname)) ?? null;
}
