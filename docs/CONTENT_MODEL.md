# Content model

## Goals

Content is typed, local, and independent from rendering components. A future Laravel API, CMS, or database adapter can implement the same repository contract without rewriting page composition.

## Profile

`Profile` contains:

- Full and short name
- Primary and secondary positioning
- Hero headline and summary
- Location and mobility statement
- Configurable availability object
- Contact and social links

Unknown URLs remain absent. Components must not invent or render placeholder links.

## Evidence

`EvidenceItem` contains a value, label, scope, and optional context. Scope is required so unrelated project metrics cannot be visually combined into one implied total.

## Project

`Project` contains:

- Stable slug and title
- Concise proposition
- Visibility label
- Problem, role, and ownership language
- Architecture nodes and connections
- Decisions and edge cases
- Verified evidence
- Technology list
- Case-study sections
- Optional public URL, repository URL, and media

Unavailable links and imagery are omitted rather than represented by empty placeholders.

## Capability layer

`CapabilityLayer` describes a problem area, ownership statement, and associated tools or practices. The ownership statement is primary; technologies are supporting metadata.

## Principle

`Principle` contains a short position and one concrete example. Principles should be editable without touching the presentation.

## Journey moment

`JourneyMoment` contains a sequence, title, narrative, and optional verified evidence. Dates are optional because the first narrative is about increasing scope, not chronology.

## Content access

Pages import selectors from `src/lib/content`, not raw arrays from component files. The initial implementation can expose synchronous functions:

- `getProfile()`
- `getEvidence()`
- `getFeaturedProjects()`
- `getProjectBySlug(slug)`

The functions may become asynchronous later while preserving the returned domain types.

## Asset status

Genuine missing assets:

- TODO: final résumé PDF and confirmed public download location
- TODO: approved project screenshots, if any can be published
- TODO: final portrait only if an editorial about page later benefits from one
- TODO: confirmed testimonials, if supplied with attribution and permission

Architecture diagrams are the intended primary project imagery and are not temporary placeholders.
