import { ContactCta } from "@/components/home/contact-cta";
import { FeaturedProject } from "@/components/home/featured-project";
import { Hero } from "@/components/home/hero";
import { ProofRail } from "@/components/home/proof-rail";
import { SiteHeader } from "@/components/layout/site-header";
import {
  getEvidence,
  getFeaturedProjects,
  getProfile,
} from "@/lib/content";

function formatProjectRange(count: number) {
  if (count <= 0) return "00";
  if (count === 1) return "01";
  return `01–${String(count).padStart(2, "0")}`;
}

export default function HomePage() {
  const profile = getProfile();
  const evidence = getEvidence();
  const homepageProjects = getFeaturedProjects()
    .filter((project) => project.nodes.length > 0)
    .slice(0, 1);
  const projectRange = formatProjectRange(homepageProjects.length);

  return (
    <>
      <SiteHeader profile={profile} />
      <main id="main-content">
        <Hero profile={profile} />
        <ProofRail evidence={evidence} />

        <section
          aria-labelledby="selected-work-title"
          className="selected-work"
          id="selected-work"
        >
          <div className="page-shell section-intro">
            <p className="technical-label">Selected systems / {projectRange}</p>
            <div>
              <h2 id="selected-work-title">Built past the interface.</h2>
              <p>
                Products where architecture, third-party behavior, operations,
                and business rules had to work as one system.
              </p>
            </div>
          </div>

          <div className="page-shell">
            {homepageProjects.map((project) => (
              <FeaturedProject key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <ContactCta profile={profile} />
      </main>
    </>
  );
}
