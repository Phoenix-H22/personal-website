import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono } from "next/font/google";

import { getSiteUrl } from "@/lib/metadata/site";
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
    "Backend-focused software engineer building reliable APIs, integrations, commerce platforms, connected hardware, and production web products.",
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
      "Backend systems, product engineering, integrations, commerce, and connected hardware with verified production evidence.",
    siteName: "Abdalrhman M. Alkady",
    images: [
      {
        url: "/opengraph-image?v=20260805",
        width: 1200,
        height: 630,
        alt: "Abdalrhman M. Alkady — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdalrhman M. Alkady | Software Engineer",
    description:
      "Backend systems, product engineering, integrations, commerce, and connected hardware.",
    images: ["/opengraph-image?v=20260805"],
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
