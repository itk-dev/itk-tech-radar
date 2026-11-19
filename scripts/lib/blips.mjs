// Reads blip files outside Astro (for the evidence and content-check scripts).
// The Astro schema in src/content.config.ts stays the source of truth for
// validation; this only parses frontmatter and body.
import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const blipsDir = join(root, 'src', 'content', 'blips');
export const evidencePath = join(root, 'src', 'data', 'evidence.json');

/** @returns {{ id: string, file: string, data: Record<string, any>, body: string }[]} */
export function readBlips() {
  return readdirSync(blipsDir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const file = join(blipsDir, name);
      const source = readFileSync(file, 'utf8');
      const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(source);
      if (!match) throw new Error(`${name}: missing frontmatter`);
      return { id: basename(name, '.md'), file, data: parse(match[1]) ?? {}, body: match[2] };
    });
}
