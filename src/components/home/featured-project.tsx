import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/content/projects";

function ProjectDiagram({ project }: { project: Project }) {
  return (
    <div
      aria-label={`Architecture diagram for ${project.title}`}
      className="project-diagram"
      role="img"
    >
      <svg
        aria-hidden="true"
        className="project-diagram__svg"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 100 100"
      >
        {project.connections.map((connection) => {
          const from = project.nodes.find((node) => node.id === connection.from);
          const to = project.nodes.find((node) => node.id === connection.to);

          if (!from || !to) return null;

          return (
            <path
              className="project-diagram__path"
              d={`M ${from.x + 10} ${from.y + 4} C ${(from.x + to.x) / 2 + 5} ${from.y + 4}, ${(from.x + to.x) / 2 + 5} ${to.y + 4}, ${to.x} ${to.y + 4}`}
              key={`${connection.from}-${connection.to}`}
            />
          );
        })}

        {project.nodes.map((node) => (
          <g
            className="project-diagram__node"
            key={node.id}
            transform={`translate(${node.x} ${node.y})`}
          >
            <rect height="8" rx="1.2" width="18" />
            <circle cx="2.4" cy="4" r="0.9" />
            <text dominantBaseline="middle" fontSize="2.35" x="5" y="4.3">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="project-cover">
      <div className="project-cover__copy">
        <div>
          <p className="technical-label">
            System {project.index} / {project.visibility}
          </p>
          <h3>{project.title}</h3>
          <p className="project-cover__proposition">{project.proposition}</p>
        </div>

        <div className="project-cover__footer">
          <ul className="project-cover__metrics">
            {project.impact.slice(0, 3).map((metric) => (
              <li key={metric}>{metric}</li>
            ))}
          </ul>
          <span aria-label="Case study is not yet published" className="button">
            Architecture preview
            <ArrowUpRight aria-hidden="true" size={15} />
          </span>
        </div>
      </div>

      <ProjectDiagram project={project} />
    </article>
  );
}
