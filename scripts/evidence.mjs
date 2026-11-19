// Collects evidence for radar blips from the itk-dev GitHub organisation and
// writes src/data/evidence.json. Run before each edition: `npm run evidence`.
//
// The signals for each blip come from the `evidence` field in its frontmatter
// (src/content/blips/*.md); blips without one are skipped.
//
// Requires an authenticated GitHub CLI (`gh auth login`). Only public,
// non-archived, non-fork repositories with a push inside the window are
// counted, so no private repository names end up on the public site.
//
// Usage: node scripts/evidence.mjs [--months 18]

import { execFile } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { evidencePath, readBlips } from './lib/blips.mjs';

const run = promisify(execFile);
const ORG = 'itk-dev';
const CONCURRENCY = 8;

const monthsArg = process.argv.indexOf('--months');
const months = monthsArg === -1 ? 18 : Number(process.argv[monthsArg + 1]);
if (!Number.isInteger(months) || months < 1) {
  throw new Error('--months must be a positive integer');
}

/** Blip id → its evidence rule, with patterns compiled (case-insensitive). */
const rules = Object.fromEntries(
  readBlips()
    .filter((blip) => blip.data.evidence)
    .map(({ id, data: { evidence } }) => [
      id,
      {
        ...evidence,
        source: evidence,
        contents: Object.entries(evidence.contents ?? {}).map(([file, patterns]) => ({
          file,
          patterns: patterns.map((pattern) => new RegExp(pattern, 'i')),
        })),
        workflows: evidence.workflows?.map((pattern) => new RegExp(pattern, 'i')),
      },
    ]),
);

/** Root files whose contents some rule inspects; each is fetched once per repository. */
const inspectedFiles = [...new Set(Object.values(rules).flatMap((rule) => rule.contents.map((c) => c.file)))];

async function gh(...args) {
  const { stdout } = await run('gh', args, { maxBuffer: 64 * 1024 * 1024 });
  return stdout;
}

/**
 * Contents of a path in a repository: the raw file, or the entry names of a
 * directory. Undefined when the path does not exist (empty repositories too).
 */
async function contents(repo, path, kind) {
  const args = kind === 'file' ? ['-H', 'Accept: application/vnd.github.raw'] : ['--jq', '.[].name'];
  try {
    const body = await gh('api', `repos/${ORG}/${repo}/contents/${path}`, ...args);
    return kind === 'file' ? body : body.split('\n').filter(Boolean);
  } catch (error) {
    if (/HTTP 404/.test(String(error.stderr))) return undefined;
    throw error;
  }
}

async function readJson(repo, file) {
  const body = await contents(repo, file, 'file');
  try {
    return JSON.parse(body);
  } catch {
    console.warn(`Skipping invalid ${file} in ${repo}`);
    return undefined;
  }
}

async function inspect(repo) {
  const files = (await contents(repo, '', 'dir')) ?? [];
  const has = (name) => files.includes(name);
  const composer = has('composer.json') ? await readJson(repo, 'composer.json') : undefined;
  const pkg = has('package.json') ? await readJson(repo, 'package.json') : undefined;
  const fileContents = new Map();
  for (const file of inspectedFiles.filter(has)) {
    fileContents.set(file, await contents(repo, file, 'file'));
  }
  const workflows = has('.github') ? ((await contents(repo, '.github/workflows', 'dir')) ?? []) : [];

  const composerDeps = new Set(Object.keys({ ...composer?.require, ...composer?.['require-dev'] }));
  const npmDeps = new Set(Object.keys({ ...pkg?.dependencies, ...pkg?.devDependencies }));

  const matches = [];
  for (const [id, rule] of Object.entries(rules)) {
    const hit =
      rule.composer?.some((name) => composerDeps.has(name)) ||
      rule.npm?.some((name) => npmDeps.has(name)) ||
      rule.files?.some(has) ||
      rule.contents.some(({ file, patterns }) => {
        const body = fileContents.get(file);
        return body !== undefined && patterns.some((pattern) => pattern.test(body));
      }) ||
      rule.workflows?.some((pattern) => workflows.some((name) => pattern.test(name)));
    if (hit) matches.push(id);
  }
  return matches;
}

const since = new Date();
since.setUTCMonth(since.getUTCMonth() - months);

const repos = JSON.parse(
  await gh(
    'repo',
    'list',
    ORG,
    '--limit',
    '1000',
    '--visibility',
    'public',
    '--no-archived',
    '--source',
    '--json',
    'name,pushedAt',
  ),
)
  .filter((repo) => new Date(repo.pushedAt) >= since)
  .map((repo) => repo.name)
  .sort();

console.log(`Inspecting ${repos.length} public repositories pushed since ${since.toISOString().slice(0, 10)}`);

const signals = Object.fromEntries(Object.keys(rules).map((id) => [id, []]));
let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < repos.length) {
      const repo = repos[next++];
      for (const id of await inspect(repo)) signals[id].push(repo);
    }
  }),
);

const evidence = {
  org: ORG,
  generatedAt: new Date().toISOString().slice(0, 10),
  since: since.toISOString().slice(0, 10),
  repositoryCount: repos.length,
  blips: Object.fromEntries(
    Object.entries(rules).map(([id, rule]) => [id, { rule: rule.source, repositories: signals[id].sort() }]),
  ),
};

await writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
for (const [id, { repositories }] of Object.entries(evidence.blips)) {
  console.log(`${String(repositories.length).padStart(4)}  ${id}`);
}
console.log(`Wrote ${evidencePath}`);
