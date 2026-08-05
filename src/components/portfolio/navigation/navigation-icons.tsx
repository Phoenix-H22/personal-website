import type { SVGProps } from "react";

/**
 * Local navigation icon set — a small, consistent outline family tuned for the
 * Control Deck / dock. Single 24×24 grid, 1.7 stroke, round caps/joins,
 * `currentColor`, decorative (aria-hidden). Sized by the consuming class.
 */

export type NavIconName = "education" | "experience" | "systems" | "contact";

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

const GLYPHS: Record<NavIconName, React.ReactNode> = {
  // Mortarboard — Education
  education: (
    <>
      <path d="M12 4.2 2.8 8.2l9.2 4 9.2-4-9.2-4Z" />
      <path d="M6.2 10.4v3.3c0 1.5 2.6 2.8 5.8 2.8s5.8-1.3 5.8-2.8v-3.3" />
      <path d="M21.2 8.2v4.2" />
      <circle cx="21.2" cy="13.1" r="0.55" fill="currentColor" stroke="none" />
    </>
  ),
  // Briefcase — Experience
  experience: (
    <>
      <rect x="2.6" y="7.6" width="18.8" height="12" rx="2.2" />
      <path d="M8.6 7.6V6.1a2 2 0 0 1 2-2h2.8a2 2 0 0 1 2 2v1.5" />
      <path d="M2.6 12.6h18.8" />
    </>
  ),
  // Hub + satellites — Systems
  systems: (
    <>
      <circle cx="12" cy="12" r="2.35" />
      <circle cx="12" cy="4.6" r="1.75" />
      <circle cx="5.5" cy="18" r="1.75" />
      <circle cx="18.5" cy="18" r="1.75" />
      <path d="M12 6.35v3.3" />
      <path d="M10.15 13.5 7 16.4" />
      <path d="M13.85 13.5 17 16.4" />
    </>
  ),
  // Paper plane / send — Contact
  contact: (
    <>
      <path d="M21.5 3 10.6 13.4" />
      <path d="M21.5 3 14.7 21.5 10.6 13.4 2.5 9.3 21.5 3Z" />
    </>
  ),
};

export function NavIcon({
  name,
  className,
}: {
  name: NavIconName;
  className?: string;
}) {
  return <Icon className={className}>{GLYPHS[name]}</Icon>;
}
