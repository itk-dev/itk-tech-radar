// Content checks the Astro schema cannot do. Runs as part of `npm run build`.
//
// - Usage figures: src/data/evidence.json must have been collected with the
//   current `evidence` rules in the blips. Fix: `npm run evidence`.
// - Cross-links: relative links to other blips (`../slug/`) must point to an
//   existing blip.
import { existsSync, readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { evidencePath, readBlips, root } from './lib/blips.mjs';

const blips = readBlips();
const ids = new Set(blips.map((blip) => blip.id));
const errors = [];

const evidence = existsSync(evidencePath) ? JSON.parse(readFileSync(evidencePath, 'utf8')) : { blips: {} };
for (const { id, file, data } of blips) {
  const recorded = evidence.blips[id];
  if (data.evidence && !recorded) {
    errors.push(`${relative(root, file)}: has an evidence rule but no usage figures. Run \`npm run evidence\`.`);
  } else if (data.evidence && JSON.stringify(recorded.rule) !== JSON.stringify(data.evidence)) {
    errors.push(
      `${relative(root, file)}: evidence rule changed since the figures were collected. Run \`npm run evidence\`.`,
    );
  } else if (!data.evidence && recorded) {
    errors.push(
      `${relative(root, file)}: no evidence rule, but evidence.json has figures for it. Run \`npm run evidence\`.`,
    );
  }
}
for (const id of Object.keys(evidence.blips)) {
  if (!ids.has(id)) {
    errors.push(`src/data/evidence.json: figures for "${id}", which is not a blip. Run \`npm run evidence\`.`);
  }
}

for (const { file, body } of blips) {
  for (const [, target] of body.matchAll(/\]\(\.\.\/([^/)#]+)\/?(?:#[^)]*)?\)/g)) {
    if (!ids.has(target)) {
      errors.push(`${relative(root, file)}: links to "../${target}/", but there is no blip "${target}".`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Content check failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`Content check passed (${blips.length} blips).`);
