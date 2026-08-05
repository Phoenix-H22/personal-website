export const ADAPTIVE_HERO_CONTENT = {
  identity: "SOFTWARE ENGINEER",
  // Retained for the content contract/test. The hero now renders a single,
  // minimal eyebrow (identity only) on every breakpoint, so this tail is not
  // shown in the UI.
  eyebrow: "BUILDING PRODUCTION SOFTWARE SINCE 2021",
  name: "Abdalrhman M. Alkady",
  statement: [
    "I learn the system,",
    "choose what fits,",
    "and ship what survives production.",
  ],
  summary:
    "Software engineer with a backend focus, working across web, mobile, commerce, integrations, connected devices, and infrastructure.",
  // Single unified hero paragraph, identical on desktop + mobile. Combines the
  // belief, scope, and AI approach into one flowing statement; `accent` is the
  // cyan-emphasized phrase. (`statement`/`summary`/`fundamentals` above are kept
  // for the content contract/test but are no longer rendered.)
  manifesto: {
    lead: "I learn the system, choose what fits, and ship what ",
    accent: "survives production",
    tail:
      " — a backend-focused engineer building across web, mobile, commerce, integrations, and infrastructure, using AI to move faster without outsourcing the thinking.",
  },
  fundamentals:
    "Built before AI became a daily development tool. Now I use research, automation, and AI to move faster — without outsourcing the thinking.",
} as const;
