import Link from "next/link";

export function ConceptNav() {
  return (
    <header className="c2-nav">
      <div className="c2-shell c2-nav__inner">
        <Link className="c2-brand" href="/concept-v2">
          <span aria-hidden="true" className="c2-brand__mark">
            AK
          </span>
          <span>Abdalrhman Alkady</span>
        </Link>
        <nav aria-label="Concept navigation" className="c2-nav__links">
          <a href="#education">Education</a>
          <a href="#experience">Experience</a>
          <a href="#work">Work</a>
          <a className="c2-nav__cta" href="#contact">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
