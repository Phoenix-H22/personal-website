import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/metadata/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "facebookexternalhit",
          "Facebot",
          "WhatsApp",
          "Twitterbot",
          "LinkedInBot",
        ],
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/design-system"],
      },
    ],
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
