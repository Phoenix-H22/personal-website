import { RecruiterBriefDialog } from "@/components/portfolio/recruiter/recruiter-brief-dialog";
import { getProjectBySlug } from "@/lib/portfolio/projects";
import styles from "@/styles/portfolio/recruiter-experience.module.scss";

export async function RecruiterBriefSection() {
  const [warqah, nabd, alzahaby] = await Promise.all([
    getProjectBySlug("warqah-store"),
    getProjectBySlug("nabd"),
    getProjectBySlug("alzahaby-loyalty-app"),
  ]);
  if (!warqah || !nabd || !alzahaby) {
    throw new Error("Recruiter brief requires verified flagship proof");
  }
  const proofPoints = [
    ...warqah.verifiedMetrics.slice(0, 2).map((metric) => ({
      ...metric,
      project: warqah.title,
    })),
    { ...nabd.verifiedMetrics[0], project: nabd.title },
    { ...alzahaby.verifiedMetrics[0], project: alzahaby.title },
  ];

  return (
    <section
      id="recruiter-brief"
      className={styles.briefRail}
      aria-label="Recruiter Engineering Brief"
    >
      <div>
        <p>SHORT ON TIME?</p>
        <span>Target role, ownership, production proof, stack, and availability.</span>
      </div>
      <RecruiterBriefDialog proofPoints={proofPoints} />
    </section>
  );
}
