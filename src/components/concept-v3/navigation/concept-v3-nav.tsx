import Link from "next/link";

const links = [
  { href: "#proof-stage", label: "Proof" },
  { href: "/documents/Abdalrhman_Alkady_Resume.pdf", label: "Résumé", external: true },
  { href: "mailto:alkady2019@gmail.com", label: "Contact" },
] as const;

export function ConceptV3Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="concept-v3__shell flex min-h-20 items-center justify-between border-b border-border-subtle">
        <Link
          href="/concept-v3"
          className="inline-flex min-h-11 items-center gap-3 text-sm tracking-tight text-text-secondary transition-colors hover:text-text-primary"
        >
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-md border border-border-medium bg-surface-mid font-mono text-[0.7rem] text-signal-cyan"
          >
            AK
          </span>
          <span className="hidden text-sm tracking-tight text-text-secondary transition-colors hover:text-text-primary min-[420px]:inline">
            Concept V3 · Proof Engine
          </span>
        </Link>

        <nav aria-label="Concept V3" className="flex items-center gap-1 sm:gap-4">
          {links.map((link) => {
            const isExternal = "external" in link && link.external;
            return (
              <a
                key={link.href}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="inline-flex min-h-11 min-w-11 items-center justify-center px-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary sm:px-2"
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
