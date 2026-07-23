import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // Former experimental primary route — bookmarks / QA scripts land on `/`.
      {
        source: "/concept-v3-rebuild",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
