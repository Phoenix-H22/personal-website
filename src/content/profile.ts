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
  shortName: "Abdalrhman M. Alkady",
  role: "Software Engineer",
  headline: "Most people see the product. I build what makes it work.",
  summary:
    "I’m Abdalrhman M. Alkady, a Software Engineer with a strong backend foundation. I turn business requirements into practical production systems — APIs, integrations, commerce workflows, and web products — and I collaborate with teams and stakeholders to ship and support them.",
  location: "Egypt",
  mobility: "Open to remote roles and relocation opportunities",
  availability: {
    isAvailable: true,
    label: "Open to Software Engineer roles and selected projects",
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
    value: "200 · 20K · ~SAR 12M",
    label: "Merchants · avg monthly orders · order value (≈2–3 months)",
    scope: "Commerce operations systems",
    tone: "scale",
  },
  {
    value: "EGP 21M+",
    label: "Commerce sales scale",
    scope: "Warqah Store",
    tone: "reach",
  },
];
