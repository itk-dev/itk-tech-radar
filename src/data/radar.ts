// Radar structure: quadrants, rings and editions. Blips reference these by id.

export const quadrants = [
  {
    id: 'languages-and-frameworks',
    name: 'Languages & Frameworks',
    description: 'The languages and frameworks we write our applications and sites in.',
    // Angular span in SVG coordinates (degrees, clockwise from 3 o'clock).
    startAngle: 180,
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Development, quality and automation tools we rely on day to day.',
    startAngle: 270,
  },
  {
    id: 'platforms-and-infrastructure',
    name: 'Platforms & Infrastructure',
    description: 'What our software runs on, and how it is built and deployed.',
    startAngle: 90,
  },
  {
    id: 'techniques',
    name: 'Techniques',
    description: 'Practices and ways of working that shape how we build software.',
    startAngle: 0,
  },
] as const;

export const rings = [
  {
    id: 'adopt',
    name: 'Adopt',
    description: 'Our default. Proven in production across many projects; choosing something else needs a reason.',
  },
  {
    id: 'trial',
    name: 'Trial',
    description: 'In production on at least one project and worth using where it fits, but not yet our default.',
  },
  {
    id: 'assess',
    name: 'Assess',
    description:
      'Worth exploring with a prototype or spike to understand how it would affect us. Not for production yet.',
  },
  {
    id: 'hold',
    name: 'Hold',
    description: 'Do not start new work with it. Existing projects keep it until there is a natural point to migrate.',
  },
] as const;

/** Editions in chronological order; the last one is the current edition. */
export const editions = [{ id: '2026.1', published: '2026-11' }] as const;

export type QuadrantId = (typeof quadrants)[number]['id'];
export type RingId = (typeof rings)[number]['id'];
export type EditionId = (typeof editions)[number]['id'];
export type Quadrant = (typeof quadrants)[number];
export type Ring = (typeof rings)[number];

export const quadrantIds = quadrants.map((q) => q.id) as [QuadrantId, ...QuadrantId[]];
export const ringIds = rings.map((r) => r.id) as [RingId, ...RingId[]];
export const editionIds = editions.map((e) => e.id) as [EditionId, ...EditionId[]];

export const currentEdition = editions[editions.length - 1];

export const getQuadrant = (id: QuadrantId): Quadrant => quadrants.find((q) => q.id === id)!;
export const getRing = (id: RingId): Ring => rings.find((r) => r.id === id)!;
export const ringIndex = (id: RingId): number => rings.findIndex((r) => r.id === id);

export const formatEditionDate = (published: string): string =>
  new Date(`${published}-01T00:00:00Z`).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
