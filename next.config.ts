import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Dev only: allow loading /_next/* over 127.0.0.1 as well as localhost, so
  // opening the app on either host doesn't 403 the client chunks (which breaks
  // hydration and stops the JS-driven animations).
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Former experimental primary route — bookmarks / QA scripts land on `/`.
      {
        source: "/concept-v3-rebuild",
        destination: "/",
        permanent: true,
      },
      // Projects moved from /v2/work to /projects — keep old links (and any
      // indexed case-study URLs) resolving to the new route.
      {
        source: "/v2/work",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/v2/work/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
