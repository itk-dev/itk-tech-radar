import { quadrants, ringIndex, rings, type QuadrantId } from '../data/radar';
import type { Blip } from './blips';

export const RADAR_SIZE = 800;
export const CENTER = RADAR_SIZE / 2;
/** Outer radius of each ring, inside out. The inner rings are wider because they hold more blips. */
export const RING_RADII = [170, 262, 330, 388] as const;
export const BLIP_RADIUS = 12;

/** Minimum distance between blip centres and from a blip centre to any sector edge. */
const SPACING = BLIP_RADIUS * 2 + 6;
const EDGE_PADDING = BLIP_RADIUS + 5;
/** Ring labels sit on the horizontal axis; blips keep this much extra distance from it. */
const LABEL_CLEARANCE = 10;
/** Candidate grid density; finer means smoother placement and a slower build. */
const GRID_STEP = 6;

export interface PlacedBlip extends Blip {
  x: number;
  y: number;
}

interface Candidate {
  x: number;
  y: number;
  r: number;
  angle: number;
  /** Distance from the candidate to the nearest edge of its sector. */
  edge: number;
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

function sectorCandidates(quadrant: QuadrantId, ring: number): Candidate[] {
  const start = toRadians(quadrants.find((q) => q.id === quadrant)!.startAngle);
  const end = start + Math.PI / 2;
  const inner = ring === 0 ? 0 : RING_RADII[ring - 1];
  const outer = RING_RADII[ring];
  const candidates: Candidate[] = [];

  for (let r = inner + EDGE_PADDING; r <= outer - EDGE_PADDING; r += GRID_STEP) {
    const step = GRID_STEP / r;
    for (let angle = start + step / 2; angle < end; angle += step) {
      const x = CENTER + r * Math.cos(angle);
      const y = CENTER + r * Math.sin(angle);
      const edge = Math.min(r - inner, outer - r, Math.abs(x - CENTER), Math.abs(y - CENTER) - LABEL_CLEARANCE);
      if (edge < EDGE_PADDING) continue;
      candidates.push({ x, y, r, angle, edge });
    }
  }
  return candidates;
}

/**
 * Picks `count` points in a sector that are as far as possible from each other
 * and from the sector edges (greedy max–min). Deterministic, so the radar looks
 * the same on every build, and overlap-free as long as the sector has room.
 */
function spreadPoints(candidates: Candidate[], count: number): Candidate[] {
  const chosen: Candidate[] = [];
  for (let i = 0; i < count; i++) {
    let best: Candidate | undefined;
    let bestScore = -Infinity;
    for (const c of candidates) {
      let score = c.edge;
      for (const p of chosen) {
        score = Math.min(score, Math.hypot(c.x - p.x, c.y - p.y) / 2);
      }
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    if (!best || bestScore * 2 < SPACING) {
      throw new Error(`Radar sector is too crowded to place ${count} blips without overlap`);
    }
    chosen.push(best);
  }
  // Read order: clockwise, then inside out, so numbers flow around the sector.
  return chosen.sort((a, b) => a.angle - b.angle || a.r - b.r);
}

export function placeBlips(blips: Blip[]): PlacedBlip[] {
  const placed: PlacedBlip[] = [];
  for (const quadrant of quadrants) {
    for (const ring of rings) {
      const sector = blips.filter((b) => b.quadrant === quadrant.id && b.ring === ring.id);
      if (sector.length === 0) continue;
      const points = spreadPoints(sectorCandidates(quadrant.id, ringIndex(ring.id)), sector.length);
      sector.forEach((blip, i) => placed.push({ ...blip, x: points[i].x, y: points[i].y }));
    }
  }
  return placed;
}
