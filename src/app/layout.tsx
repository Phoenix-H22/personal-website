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
    default: "Abdalrhman M. Alkady — Backend-Focused Product Engineer",
    template: "%s — Abdalrhman M. Alkady",
  },
  description:
    "Backend-focused product engineer building reliable SaaS platforms, Laravel and Node.js systems, integrations, automation, and mobile-backed products.",
  applicationName: "Abdalrhman M. Alkady",
  authors: [{ name: "Abdalrhman Mohamed Alkady" }],
  creator: "Abdalrhman Mohamed Alkady",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "backend product engineer",
    "Laravel engineer",
    "Node.js engineer",
    "SaaS development",
    "systems integration",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Abdalrhman M. Alkady — Backend-Focused Product Engineer",
    description:
      "I build the systems products depend on: SaaS platforms, integrations, automation, and mobile-backed products.",
    siteName: "Abdalrhman M. Alkady",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdalrhman M. Alkady — Backend-Focused Product Engineer",
    description:
      "Reliable SaaS platforms, integrations, automation, and mobile-backed products.",
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
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
