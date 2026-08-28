import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono } from "next/font/google";

import { getSiteUrl } from "@/lib/metadata/site";
import { homeSocialImagePath, socialJpeg } from "@/lib/metadata/social-image";
import { getMotionBootstrapScript } from "@/lib/motion-preference";
import "@/styles/globals.css";

const geist = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist",
});

const plexMono = IBM_Plex_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Abdalrhman M. Alkady | Software Engineer",
    template: "%s — Abdalrhman M. Alkady",
  },
  description:
    "Software Engineer building production web systems across SaaS, commerce, payments, integrations, and connected products.",
  applicationName: "Abdalrhman M. Alkady",
  authors: [{ name: "Abdalrhman Mohamed Alkady" }],
  creator: "Abdalrhman Mohamed Alkady",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "software engineer",
    "backend engineer",
    "Laravel engineer",
    "Node.js engineer",
    "SaaS development",
    "systems integration",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Abdalrhman M. Alkady | Software Engineer",
    description:
      "Software Engineer — production systems, APIs, integrations, commerce, and connected products with verified delivery evidence.",
    siteName: "Abdalrhman M. Alkady",
    images: [
      socialJpeg(homeSocialImagePath(), "Abdalrhman M. Alkady — Software Engineer"),
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdalrhman M. Alkady | Software Engineer",
    description:
      "Software Engineer — production systems, APIs, integrations, commerce, and connected products.",
    images: [socialJpeg(homeSocialImagePath(), "Abdalrhman M. Alkady — Software Engineer")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geist.variable} ${plexMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: getMotionBootstrapScript() }}
        />
      </head>
      {/* Browser extensions (e.g. Grammarly) inject attributes onto <body>
          before hydration; suppress the resulting attribute-mismatch warning. */}
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
