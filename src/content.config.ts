import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { editionIds, quadrantIds, ringIds } from './data/radar';

const blips = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blips' }),
  schema: z.object({
    title: z.string(),
    /** One sentence shown in lists and as the page description. */
    summary: z.string(),
    quadrant: z.enum(quadrantIds),
    /** Person who keeps the write-up current and argues its placement. */
    champion: z.string().optional(),
    tags: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    /**
     * How `npm run evidence` recognises this blip in a repository; any match
     * counts. Patterns are case-insensitive regular expressions. Omit for
     * blips with no signal in code (the page then shows no usage figure).
     */
    evidence: z
      .object({
        /** Shown after the count, e.g. "Requires symfony/framework-bundle". */
        description: z.string(),
        /** Composer packages in require or require-dev. */
        composer: z.array(z.string()).optional(),
        /** npm packages in dependencies or devDependencies. */
        npm: z.array(z.string()).optional(),
        /** Files or folders in the repository root. */
        files: z.array(z.string()).optional(),
        /**
         * Patterns matched against the contents of files in the repository
         * root, keyed by file name, e.g. `{ CHANGELOG.md: ['keepachangelog\.com'] }`.
         */
        contents: z.record(z.string(), z.array(z.string())).optional(),
        /** Patterns matched against file names in .github/workflows. */
        workflows: z.array(z.string()).optional(),
      })
      .optional(),
    /**
     * Placement per edition, oldest first. The entry for the current edition
     * decides the ring; a blip without one is not on the current radar.
     */
    history: z
      .array(
        z.object({
          edition: z.enum(editionIds),
          ring: z.enum(ringIds),
          note: z.string(),
        }),
      )
      .min(1)
      .refine(
        (entries) =>
          entries.every(
            (entry, i) => i === 0 || editionIds.indexOf(entry.edition) > editionIds.indexOf(entries[i - 1].edition),
          ),
        { message: 'history must list each edition once, oldest first (see editions in src/data/radar.ts)' },
      ),
  }),
});

export const collections = { blips };
