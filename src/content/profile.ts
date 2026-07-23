export type SocialLink = {
  label: string;
  href: string;
};

export type Profile = {
  fullName: string;
  shortName: string;
  role: string;
  headline: string;
  summary: string;
  location: string;
  mobility: string;
  availability: {
    isAvailable: boolean;
    label: string;
  };
  socialLinks: SocialLink[];
};

export const profile: Profile = {
  fullName: "Abdalrhman Mohamed Alkady",
  shortName: "Abdalrhman Alkady",
  role: "Backend-Focused Product Engineer",
  headline: "Most people see the product. I build what makes it work.",
  summary:
    "I’m Abdalrhman Alkady, a backend-focused product engineer building reliable SaaS platforms, integrations, automation systems, and mobile-backed products with Laravel, Node.js, and modern frontend technologies.",
  location: "Egypt",
  mobility: "Open to remote roles and relocation opportunities",
  availability: {
    isAvailable: true,
    label: "Available for senior engineering roles and selected projects",
  },
  socialLinks: [
    { label: "Email", href: "mailto:alkady2019@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/alkady22/" },
    { label: "GitHub", href: "https://github.com/Phoenix-H22/" },
  ],
};

export type EvidenceItem = {
  value: string;
  label: string;
  scope: string;
  tone: "credential" | "scale" | "reach";
};

export const evidence: EvidenceItem[] = [
  {
    value: "Top Rated · 100%",
    label: "Upwork Job Success Score",
    scope: "Freelance platform credential",
    tone: "credential",
  },
  {
    value: "200+ · 20K+ · 12M+ SAR",
    label: "Merchants · monthly orders · handled order value",
    scope: "Commerce operations systems",
    tone: "scale",
  },
  {
    value: "10K+",
    label: "Users served",
    scope: "Educational platform",
    tone: "reach",
  },
];
