"use client";

import { useMemo, useState } from "react";

import type { CareerEra, ExperienceEntry } from "@/content/experience";

function formatDates(entry: ExperienceEntry) {
  const start = formatMonthYear(entry.startDate);
  const end = entry.isCurrent || !entry.endDate ? "Present" : formatMonthYear(entry.endDate);
  return `${start} – ${end}`;
}

function formatMonthYear(value: string) {
  const [year, month] = value.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const index = Number(month) - 1;
  return `${months[index] ?? month} ${year}`;
}

function companyInitials(entry: ExperienceEntry) {
  const seed = entry.companyShortName ?? entry.company;
  return seed.slice(0, 3).toUpperCase();
}

export function ConceptCareerChapters({
  eras,
  experience,
}: {
  eras: CareerEra[];
  experience: ExperienceEntry[];
}) {
  const erasWithWork = useMemo(
    () => eras.filter((era) => era.experienceIds.length > 0 || era.id === "foundation"),
    [eras],
  );
  const defaultEra =
    erasWithWork.find((era) => era.id === "owning-production-systems") ?? erasWithWork[0];
  const [activeEraId, setActiveEraId] = useState(defaultEra.id);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeEra =
    erasWithWork.find((era) => era.id === activeEraId) ?? erasWithWork[0];
  const entries = experience.filter((entry) =>
    activeEra.experienceIds.includes(entry.id),
  );

  return (
    <section className="c2-section c2-section--paper" id="experience">
      <div className="c2-shell">
        <div className="c2-section__intro">
          <p>Professional experience</p>
          <h2>Built through real work.</h2>
          <p className="c2-lead">
            Career chapters that show increasing ownership — from production
            products to backend systems businesses rely on.
          </p>
        </div>

        <div className="c2-career">
          <div aria-label="Career chapters" className="c2-era-nav" role="tablist">
            {erasWithWork.map((era) => (
              <button
                aria-pressed={era.id === activeEra.id}
                key={era.id}
                onClick={() => {
                  setActiveEraId(era.id);
                  setExpandedId(null);
                }}
                type="button"
              >
                <strong>{era.title}</strong>
                <span>{era.period}</span>
              </button>
            ))}
          </div>

          <div className="c2-era-panel">
            <h3>{activeEra.title}</h3>
            <p>{activeEra.description}</p>

            {entries.length === 0 ? (
              <div className="c2-empty-era">
                Early foundations are covered in Education. Additional early
                contracts and freelance work are pending structured confirmation
                before publication.
              </div>
            ) : (
              <div className="c2-exp">
                {entries.map((entry) => {
                  const isOpen = expandedId === entry.id;
                  return (
                    <article className="c2-exp__item" key={entry.id}>
                      <button
                        aria-controls={`exp-${entry.id}`}
                        aria-expanded={isOpen}
                        className="c2-exp__trigger"
                        onClick={() =>
                          setExpandedId((current) =>
                            current === entry.id ? null : entry.id,
                          )
                        }
                        type="button"
                      >
                        <span aria-hidden="true" className="c2-exp__logo">
                          {companyInitials(entry)}
                        </span>
                        <span className="c2-exp__copy">
                          <h4>{entry.company}</h4>
                          <p className="c2-exp__role">{entry.role}</p>
                          <p className="c2-exp__mission">{entry.mission}</p>
                          {entry.outcomes[0] ? (
                            <p className="c2-exp__result">{entry.outcomes[0]}</p>
                          ) : entry.highlights[0] ? (
                            <p className="c2-exp__result">{entry.highlights[0]}</p>
                          ) : null}
                        </span>
                        <span className="c2-exp__dates">{formatDates(entry)}</span>
                      </button>
                      <div
                        className="c2-exp__details"
                        hidden={!isOpen}
                        id={`exp-${entry.id}`}
                      >
                        <ul>
                          {entry.highlights.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                          {entry.outcomes.slice(1).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <div className="c2-exp__tech">
                          {entry.technologies.slice(0, 6).map((tech) => (
                            <span key={tech}>{tech}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
