import evidence from '../data/evidence.json';

export interface BlipEvidence {
  /** The `evidence` rule from the blip's frontmatter at collection time. */
  rule: { description: string };
  repositories: string[];
}

export const evidenceMeta = {
  org: evidence.org,
  generatedAt: evidence.generatedAt,
  since: evidence.since,
  repositoryCount: evidence.repositoryCount,
};

export const evidenceFor = (id: string): BlipEvidence | undefined =>
  (evidence.blips as Record<string, BlipEvidence>)[id];

export const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
