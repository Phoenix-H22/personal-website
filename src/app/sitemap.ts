import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/metadata/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const routes = [
    { path: "/", priority: 1 },
    { path: "/v2", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/projects/smart-lockers-platform", priority: 0.8 },
    { path: "/projects/warqah-store", priority: 0.8 },
    { path: "/projects/autopay-eg", priority: 0.8 },
  ] as const;

  return routes.map(({ path, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: "monthly" as const,
    priority,
  }));
}
