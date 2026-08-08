import { achievements } from "@/content/achievements";
import { education } from "@/content/education";
import {
  CAREER_TIMEFIELD_INDEPENDENT_IDS,
  CAREER_TIMEFIELD_PRIMARY_IDS,
  CAREER_TIMEFIELD_SUPPORTING_IDS,
  careerEras,
  experience,
  type ExperienceKind,
  type ExperiencePublicationLevel,
} from "@/content/experience";
import { evidence, profile } from "@/content/profile";
import { projects } from "@/content/projects";

function bySortOrder<T extends { sortOrder: number }>(a: T, b: T) {
  return a.sortOrder - b.sortOrder;
}

export function getProfile() {
  return profile;
}

export function getEvidence() {
  return evidence;
}

export function getEducation() {
  return [...education].sort(bySortOrder);
}

export function getFeaturedEducation() {
  return getEducation().filter((entry) => entry.featured);
}

/** Full inventory including archive and unpublished. */
export function getAllExperience() {
  return [...experience].sort(bySortOrder);
}

/**
 * Default Career-facing list: primary + supporting only.
 * Archive / unpublished entries stay available via dedicated selectors.
 */
export function getExperience() {
  return getAllExperience().filter(
    (entry) =>
      entry.publicationLevel === "primary" ||
      entry.publicationLevel === "supporting",
  );
}

export function getPrimaryExperience() {
  return getAllExperience().filter(
    (entry) => entry.publicationLevel === "primary",
  );
}

export function getSupportingExperience() {
  return getAllExperience().filter(
    (entry) => entry.publicationLevel === "supporting",
  );
}

export function getArchiveExperience() {
  return getAllExperience().filter(
    (entry) => entry.publicationLevel === "archive",
  );
}

export function getExperienceByPublicationLevel(
  level: ExperiencePublicationLevel,
) {
  return getAllExperience().filter((entry) => entry.publicationLevel === level);
}

export function getExperienceByEra(eraId: string) {
  return getAllExperience().filter((entry) => entry.era === eraId);
}

export function getExperienceByKind(kind: ExperienceKind) {
  return getAllExperience().filter((entry) => entry.kind === kind);
}

export function getCurrentExperience() {
  return getAllExperience().filter((entry) => entry.isCurrent);
}

/** Primary Career company roles marked current (excludes independent/freelance lane). */
export function getCurrentPrimaryExperience() {
  return getAllExperience().filter(
    (entry) =>
      entry.isCurrent &&
      entry.publicationLevel === "primary" &&
      entry.kind !== "independent-company" &&
      entry.kind !== "freelance",
  );
}

/**
 * Full independent-track inventory (includes archived Phoenix Tech’s).
 * Prefer `getCareerTimefieldIndependent()` for recruiter-facing Career UI.
 */
export function getIndependentTrackExperience() {
  return getAllExperience().filter(
    (entry) =>
      entry.era === "independent-track" ||
      entry.kind === "independent-company" ||
      entry.kind === "freelance",
  );
}

/** Recruiter-facing Independent / Freelance lane (curated; excludes archived Phoenix). */
export function getPublicIndependentTrackExperience() {
  return getCareerTimefieldIndependent();
}

export function getEarlyFoundationExperience() {
  return getAllExperience().filter(
    (entry) =>
      entry.era === "engineering-foundations" ||
      entry.kind === "technical-leadership" ||
      entry.kind === "community" ||
      entry.kind === "teaching",
  );
}

export function getExperienceNeedingOwnerConfirmation() {
  return getAllExperience().filter(
    (entry) => entry.needsOwnerConfirmation.length > 0,
  );
}

export function getFeaturedExperience() {
  return getExperience().filter((entry) => entry.featured);
}

export function getCareerEras() {
  return [...careerEras].sort(bySortOrder);
}

/** Chronological eras for the homepage Career Trajectory Map (excludes independent lane). */
export function getCareerTimefieldEras() {
  return getCareerEras().filter((era) => era.id !== "independent-track");
}

export function getCareerTimefieldPrimary() {
  return CAREER_TIMEFIELD_PRIMARY_IDS.map((id) =>
    experience.find((entry) => entry.id === id),
  ).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}

export function getCareerTimefieldIndependent() {
  return CAREER_TIMEFIELD_INDEPENDENT_IDS.map((id) =>
    experience.find((entry) => entry.id === id),
  ).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}

export function getCareerTimefieldSupporting() {
  return CAREER_TIMEFIELD_SUPPORTING_IDS.map((id) =>
    experience.find((entry) => entry.id === id),
  ).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}

/** Trajectory Map aliases — same selectors as Timefield content scope. */
export const getCareerTrajectoryEras = getCareerTimefieldEras;
export const getCareerTrajectoryPrimary = getCareerTimefieldPrimary;
export const getCareerTrajectoryIndependent = getCareerTimefieldIndependent;
export const getCareerTrajectorySupporting = getCareerTimefieldSupporting;

export function getProjects() {
  return [...projects].sort(bySortOrder);
}

export function getFeaturedProjects() {
  return getProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAchievements() {
  return [...achievements];
}
