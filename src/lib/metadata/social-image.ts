export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const OG_IMAGE_TYPE = "image/jpeg";
export const SOCIAL_IMAGE_VERSION = "20260828";

export function projectSocialImagePath(slug: string): string {
  return `/portfolio/projects/${slug}/opengraph.jpg?v=${SOCIAL_IMAGE_VERSION}`;
}

export function projectsIndexSocialImagePath(): string {
  return `/portfolio/projects/opengraph.jpg?v=${SOCIAL_IMAGE_VERSION}`;
}
