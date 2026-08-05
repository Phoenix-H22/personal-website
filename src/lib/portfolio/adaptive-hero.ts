export const ADAPTIVE_HERO_CONTENT = {
  identity: "SOFTWARE ENGINEER",
  // Retained for the content contract/test. The hero now renders a single,
  // minimal eyebrow (identity only) on every breakpoint, so this tail is not
  // shown in the UI.
  eyebrow: "BUILDING PRODUCTION SOFTWARE SINCE 2021",
  name: "Abdalrhman M. Alkady",
  // Desktop/tablet presence: short stacked belief lines under the name.
  statement: [
    "I learn the system,",
    "choose what fits,",
    "and ship what survives production.",
  ],
  summary:
    "Software engineer with a backend focus, working across web, mobile, commerce, integrations, connected devices, and infrastructure.",
  // Desktop/tablet supporting line under the statement — small, regular weight.
  support:
    "A backend-focused engineer building across web, mobile, commerce, integrations, and infrastructure, using AI to move faster without outsourcing the thinking.",
  // Mobile-only: one compact paragraph (belief + scope + AI) so the phone
  // hero stays simple. Desktop uses `statement` + `support` instead.
  manifesto:
    "I learn the system, choose what fits, and ship what survives production — a backend-focused engineer building across web, mobile, commerce, integrations, and infrastructure, using AI to move faster without outsourcing the thinking.",
  fundamentals:
    "Built before AI became a daily development tool. Now I use research, automation, and AI to move faster — without outsourcing the thinking.",
} as const;
