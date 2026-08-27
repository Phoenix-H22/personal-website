export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const OG_IMAGE_TYPE = "image/jpeg";

export function projectSocialImagePath(slug: string): string {
  return `/portfolio/projects/${slug}/opengraph.jpg`;
}

export function projectsIndexSocialImagePath(): string {
  return `/portfolio/projects/opengraph.jpg`;
}
