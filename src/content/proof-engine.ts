import { portfolioAssets } from "@/content/portfolio-assets";
import type { ProofEngineHeroContent } from "@/lib/proof-engine/types";
import { validateProofEngineHero } from "@/lib/proof-engine/validation";

export const proofEngineHero: ProofEngineHeroContent = {
  eyebrow: "Software Engineer · Backend, Products & Integrations",
  name: "Abdalrhman M. Alkady",
  headline: "I engineer the systems businesses learn to depend on.",
  headlineEmphasis: "depend on.",
  summary:
    "Backend-focused product engineer building reliable SaaS, commerce, ERP, IoT, mobile, and AI-enabled products.",
  primaryAction: {
    label: "Enter the portfolio",
    href: "#proof-stage",
    ariaLabel: "Enter the portfolio proof stage",
  },
  secondaryAction: {
    label: "Download résumé",
    href: "/documents/Abdalrhman_Alkady_Resume.pdf",
    ariaLabel: "Download résumé PDF",
    isExternal: true,
  },
  socialActions: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/alkady22/",
      ariaLabel: "Open LinkedIn",
      isExternal: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/Phoenix-H22/",
      ariaLabel: "Open GitHub",
      isExternal: true,
    },
    {
      label: "Email",
      href: "mailto:alkady2019@gmail.com",
      ariaLabel: "Send email",
    },
  ],
  artifacts: [
    {
      id: "upwork-credential",
      kind: "credential",
      provider: "upwork",
      title: "Upwork Credential",
      eyebrow: "Upwork",
      summary: "Consistent. Reliable. Professional.",
      credential: "Top Rated",
      score: {
        value: 100,
        unit: "%",
        label: "JSS",
      },
      priority: "primary",
      accent: "upwork-green",
      visibleIn: ["cinematic", "layered", "narrative"],
      href: "https://www.upwork.com/freelancers/alkady22h/",
      asset: {
        src: portfolioAssets.credentials.upwork,
        alt: "Upwork",
        width: 140,
        height: 38,
      },
      status: "verified",
      profileLink: {
        label: "View Abdalrhman M. Alkady’s Upwork profile",
        href: "https://www.upwork.com/freelancers/alkady22h/",
        ariaLabel: "View Abdalrhman M. Alkady’s Upwork profile",
        isExternal: true,
      },
      sortOrder: 1,
    },
    {
      id: "commerce-scale",
      kind: "commerce-scale",
      title: "Commerce Operations Scale",
      eyebrow: "Mohssilh / commerce operations",
      summary: "Scoped merchant operations evidence.",
      scope: "Mohssilh / commerce operations",
      metrics: [
        {
          id: "merchants",
          value: "200+",
          label: "merchants",
          accent: "cyan",
        },
        {
          id: "orders",
          value: "20K+",
          label: "monthly orders",
          accent: "cyan",
        },
        {
          id: "value",
          value: "12M+ SAR",
          label: "handled order activity",
          accent: "amber",
        },
      ],
      flow: [
        { id: "storefront", label: "Storefront" },
        { id: "webhooks", label: "Webhooks" },
        { id: "operations", label: "Operations" },
        { id: "reconciliation", label: "Reconciliation" },
        { id: "reporting", label: "Reporting" },
      ],
      priority: "primary",
      accent: "cyan",
      visibleIn: ["cinematic", "layered", "narrative"],
      status: "verified",
      sortOrder: 2,
    },
    {
      id: "education-journey",
      kind: "education-journey",
      title: "Education Journey",
      eyebrow: "The origin of the engineering mindset",
      startYear: 2018,
      endYear: 2025,
      milestones: [
        {
          id: "obour-stem",
          institution: "Obour STEM School",
          period: "2018–2021",
          qualification: "STEM secondary education",
          highlight: "Scientific problem-solving and early software development",
          mark: {
            src: portfolioAssets.education.obourStem,
            alt: "Obour STEM School",
          },
        },
        {
          id: "usc",
          institution: "University of Sadat City",
          period: "2021–2025",
          qualification: "Bachelor’s in Computer & Artificial Intelligence",
          highlight: "A-grade with Honors · Capstone graded A+",
          mark: {
            src: portfolioAssets.education.universityOfSadatCity,
            alt: "University of Sadat City — Faculty of Computers & Artificial Intelligence",
          },
        },
      ],
      priority: "secondary",
      accent: "violet",
      visibleIn: ["cinematic", "layered", "narrative"],
      status: "verified",
      sortOrder: 3,
    },
    {
      id: "your-obour-guide",
      kind: "product",
      title: "Your Obour Guide",
      slug: "your-obour-guide",
      visualKind: "map-phone",
      domain: "Mobile-backed city guide",
      projectStatus: "private",
      priority: "supporting",
      accent: "violet",
      visibleIn: ["cinematic", "layered", "narrative"],
      asset: {
        src: portfolioAssets.projects.yourObourGuide,
        alt: "Your Obour Guide",
        width: 64,
        height: 64,
      },
      status: "verified",
      sortOrder: 4,
    },
    {
      id: "smart-vending",
      kind: "product",
      title: "Smart Vending",
      slug: "smart-vending-medication-dispensing",
      visualKind: "vending-machine",
      domain: "IoT and physical product systems",
      projectStatus: "case-study-planned",
      priority: "supporting",
      accent: "cyan",
      visibleIn: ["cinematic", "layered", "narrative"],
      asset: null,
      status: "verified",
      sortOrder: 5,
    },
    {
      id: "nabd",
      kind: "product",
      title: "NABD Messaging",
      slug: "nabd-messaging-platform",
      visualKind: "message-signal",
      domain: "Commerce messaging automation",
      projectStatus: "private",
      priority: "supporting",
      accent: "amber",
      visibleIn: ["cinematic", "layered", "narrative"],
      asset: {
        src: portfolioAssets.projects.nabd,
        alt: "NABD",
        width: 72,
        height: 72,
      },
      status: "verified",
      sortOrder: 6,
    },
    {
      id: "ak-core",
      kind: "brand-core",
      title: "AK Core",
      mark: "AK",
      tagline: "Engineering core",
      priority: "supporting",
      accent: "cyan",
      visibleIn: ["cinematic", "layered", "narrative"],
      status: "verified",
      sortOrder: 7,
    },
  ],
};

export function getProofEngineHero(): ProofEngineHeroContent {
  const errors = validateProofEngineHero(proofEngineHero);
  if (errors.length > 0) {
    throw new Error(`Proof Engine content invalid:\n${errors.join("\n")}`);
  }
  return proofEngineHero;
}

export function getHeroArtifactsForMode(
  mode: import("@/lib/proof-engine/types").CompositionMode,
) {
  return getProofEngineHero()
    .artifacts.filter((artifact) => artifact.visibleIn.includes(mode))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getArtifactById(id: string) {
  return getProofEngineHero().artifacts.find((artifact) => artifact.id === id);
}

export function getUpworkCredential() {
  const artifact = getArtifactById("upwork-credential");
  if (!artifact || artifact.kind !== "credential") {
    throw new Error("Upwork credential artifact missing");
  }
  return artifact;
}

export function getAkCore() {
  const artifact = getArtifactById("ak-core");
  if (!artifact || artifact.kind !== "brand-core") {
    throw new Error("AK Core artifact missing");
  }
  return artifact;
}
