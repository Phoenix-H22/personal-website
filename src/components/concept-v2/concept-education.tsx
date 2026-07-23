import type { EducationEntry } from "@/content/education";

function formatPeriod(startDate: string, endDate: string) {
  const startYear = startDate.slice(0, 4);
  const endYear = endDate.slice(0, 4);
  if (startDate.startsWith("2021-09")) {
    return "September 2021 – August 2025";
  }
  return `${startYear}–${endYear}`;
}

function institutionMark(entry: EducationEntry) {
  if (entry.id.includes("obour")) return "STEM";
  return "USC";
}

export function ConceptEducation({ education }: { education: EducationEntry[] }) {
  return (
    <section className="c2-section c2-section--cream" id="education">
      <div className="c2-shell">
        <div className="c2-section__intro">
          <p>Education</p>
          <h2>Where the engineering mindset started.</h2>
          <p className="c2-lead">
            A continuous path from STEM secondary education to an honors computer
            and AI degree — one foundation story, not a résumé table.
          </p>
        </div>

        <div className="c2-edu">
          {education.map((entry) => (
            <article className="c2-edu__item" key={entry.id}>
              <div aria-hidden="true" className="c2-edu__mark">
                {institutionMark(entry)}
              </div>
              <div className="c2-edu__body">
                <div className="c2-edu__meta">
                  <span>{formatPeriod(entry.startDate, entry.endDate)}</span>
                  <span>{entry.location}</span>
                </div>
                <h3>{entry.institution}</h3>
                <p className="c2-edu__degree">
                  {entry.degree}
                  {entry.fieldOfStudy ? ` · ${entry.fieldOfStudy}` : ""}
                </p>
                <p className="c2-edu__summary">{entry.summary}</p>
                {entry.highlights[0] ? (
                  <span className="c2-edu__highlight">{entry.highlights[0]}</span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
