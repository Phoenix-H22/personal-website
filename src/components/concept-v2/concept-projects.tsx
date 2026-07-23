import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/content/projects";

const visualClass: Record<string, string> = {
  "merchant-operations-salla-automation": "commerce",
  "your-obour-guide": "city",
  "nabd-messaging-platform": "message",
  "smart-vending-medication-dispensing": "vending",
  "virtual-clinic-dr-robot": "clinic",
  "ai-pdf-extraction": "ai",
};

function resultLine(project: Project) {
  return project.impact[0] ?? project.results[0] ?? "Architecture and impact available";
}

export function ConceptSelectedProjects({ projects }: { projects: Project[] }) {
  return (
    <section className="c2-section c2-section--paper" id="work">
      <div className="c2-shell">
        <div className="c2-section__intro">
          <p>Selected projects</p>
          <h2>Products, platforms, and systems shipped.</h2>
          <p className="c2-lead">
            Distinct product stories — commerce operations, mobile ecosystems,
            messaging platforms, physical machines, and AI workflows.
          </p>
        </div>

        <div className="c2-projects">
          {projects.map((project) => {
            const tone = visualClass[project.slug] ?? "commerce";
            return (
              <article className="c2-project" key={project.slug}>
                <div className="c2-project__copy">
                  <p>{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="c2-project__summary">{project.proposition}</p>
                  <div className="c2-project__meta">
                    <span>
                      Role: <strong>{project.exactRole}</strong>
                    </span>
                    <span>
                      Result: <strong>{resultLine(project)}</strong>
                    </span>
                    <span>{project.visibility}</span>
                  </div>
                </div>
                <div className={`c2-project__visual c2-project__visual--${tone}`}>
                  <div className="c2-project__poster">
                    <span>Art-directed cover</span>
                    <strong>{project.title}</strong>
                    <p>{project.proposition}</p>
                    <div aria-hidden="true" className="c2-project__pattern">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="c2-cta-row">
          <span className="c2-button c2-button--ghost">
            View all projects
            <ArrowUpRight aria-hidden="true" size={16} />
          </span>
        </div>
      </div>
    </section>
  );
}
