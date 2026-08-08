export const RECRUITER_PROFILE = {
  name: "Abdalrhman M. Alkady",
  targetRoles: [
    "Software Engineer",
    "Full-Stack Software Engineer",
  ],
  identity:
    "A Software Engineer with a strong backend foundation who can deliver frontend when needed, own meaningful features, and support production systems inside a team.",
  location: "Egypt",
  availability: "Open to remote work",
  relocation: "Open to relocation opportunities in Saudi Arabia and the UAE",
  email: "alkady2019@gmail.com",
  /** E.164 direct line. Also used, digits-only, for the WhatsApp deep link. */
  phone: "+201069683986",
  /** E.164 WhatsApp number (same line). The wa.me path drops the leading `+`. */
  whatsapp: "+201069683986",
  resume: "/documents/Abdalrhman_Alkady_Resume.pdf",
  linkedin: "https://www.linkedin.com/in/alkady22/",
  upwork: "https://www.upwork.com/freelancers/alkady22h/",
  github: "https://github.com/Phoenix-H22/",
} as const;

/** Digits-only E.164 (no `+`) for `https://wa.me/<digits>` deep links. */
export const WHATSAPP_WA_ME_DIGITS = RECRUITER_PROFILE.whatsapp.replace(/\D/g, "");

/**
 * Human-readable rendering of an E.164 number.
 * `+201069683986` -> `+20 10 6968 3986` (Egypt country code + mobile grouping).
 */
export function formatPhoneDisplay(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length === 12) {
    const national = digits.slice(2); // 1069683986
    return `+20 ${national.slice(0, 2)} ${national.slice(2, 6)} ${national.slice(6)}`;
  }
  return e164;
}

export const RECRUITER_CORE_STACK = [
  "Laravel & PHP",
  "Node.js services",
  "APIs & webhooks",
  "Queues, retries & idempotency",
  "Redis, PostgreSQL & MySQL",
  "React, Vue & Livewire when needed",
  "Docker, Linux & deployment",
] as const;
