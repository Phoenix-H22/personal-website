import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/metadata/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: "/design-system",
      userAgent: "*",
    },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
