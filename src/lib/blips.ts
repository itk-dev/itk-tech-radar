import { getCollection, type CollectionEntry } from 'astro:content';
import { currentEdition, editions, quadrants, ringIndex, rings, type QuadrantId, type RingId } from '../data/radar';

/**
 * Movement since the previous edition. `none` is used when there is no
 * previous edition to compare against (the first edition of the radar).
 */
export type BlipStatus = 'new' | 'moved-in' | 'moved-out' | 'unchanged' | 'none';

export interface Blip {
  id: string;
  number: number;
  title: string;
  summary: string;
  quadrant: QuadrantId;
  ring: RingId;
  status: BlipStatus;
  entry: CollectionEntry<'blips'>;
}

export const statusLabels: Record<Exclude<BlipStatus, 'none'>, string> = {
  new: 'New',
  'moved-in': 'Moved in',
  'moved-out': 'Moved out',
  unchanged: 'No change',
};

const previousEdition = editions.length > 1 ? editions[editions.length - 2] : undefined;

const statusOf = (entry: CollectionEntry<'blips'>, ring: RingId): BlipStatus => {
  if (!previousEdition) return 'none';
  const previous = entry.data.history.find((h) => h.edition === previousEdition.id);
  if (!previous) return 'new';
  const delta = ringIndex(ring) - ringIndex(previous.ring);
  if (delta < 0) return 'moved-in';
  if (delta > 0) return 'moved-out';
  return 'unchanged';
};

/** Blips on the current edition, numbered in quadrant → ring → title order. */
export async function getCurrentBlips(): Promise<Blip[]> {
  const entries = await getCollection('blips');
  const placed = entries.flatMap((entry) => {
    const current = entry.data.history.find((h) => h.edition === currentEdition.id);
    if (!current) return [];
    return [{ entry, ring: current.ring }];
  });

  const quadrantIds: QuadrantId[] = quadrants.map((q) => q.id);
  placed.sort(
    (a, b) =>
      quadrantIds.indexOf(a.entry.data.quadrant) - quadrantIds.indexOf(b.entry.data.quadrant) ||
      ringIndex(a.ring) - ringIndex(b.ring) ||
      a.entry.data.title.localeCompare(b.entry.data.title, 'en'),
  );

  return placed.map(({ entry, ring }, index) => ({
    id: entry.id,
    number: index + 1,
    title: entry.data.title,
    summary: entry.data.summary,
    quadrant: entry.data.quadrant,
    ring,
    status: statusOf(entry, ring),
    entry,
  }));
}

/** Blips grouped by ring, keeping ring order and dropping empty rings. */
export const groupByRing = (blips: Blip[]) =>
  rings
    .map((ring) => ({ ring, blips: blips.filter((b) => b.ring === ring.id) }))
    .filter((group) => group.blips.length > 0);
