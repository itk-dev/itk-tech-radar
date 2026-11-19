# AGENTS.md — ITK Dev Tech Radar

Instructions for AI coding agents (Claude Code, Codex, omp and others) working
in this repository. Humans: see `README.md`; it covers the same ground in less
detail.

## What this is

A static Astro site that publishes ITK Dev's technology radar to GitHub Pages
(<https://itk-dev.github.io/itk-tech-radar/>). Almost all changes are content
changes: adding, moving or rewriting blips, and publishing editions. The code
(layout, radar drawing, scripts) rarely needs to change for that.

## Commands

Everyday commands are Taskfile tasks that run in Docker (`task` lists them all).
Each wraps an npm script, so without Docker you can run the npm command on Node
22.12+ instead.

| Task | npm (no Docker) | When |
| --- | --- | --- |
| `task check` | `npm run build && npm run format:check` | **The one check.** Content check, type and schema check, build and coding standards. Run it after every change; it must pass before you are done |
| `task content:check` | `npm run check:content` | The content check alone (fast) |
| `task evidence` | `npm run evidence` | Refresh usage figures from GitHub (needs `gh auth login`). Run after adding a blip, changing an `evidence` rule, or before an edition |
| `task coding-standards:apply` | `npm run format` | Fix formatting (Prettier; markdownlint for Markdown) |
| `task start` / `task stop` | `npm run dev` | Dev server at <http://itk-tech-radar.local.itkdev.dk/itk-tech-radar/> (npm: <http://localhost:4321/itk-tech-radar/>) |

## Where things live

| Path | Contents |
| --- | --- |
| `src/content/blips/<id>.md` | One blip: frontmatter + write-up. The file name is the id and the URL |
| `docs/blip-template.md` | Annotated template for a new blip — copy it |
| `src/data/radar.ts` | Quadrants, rings (with their definitions) and `editions` |
| `src/data/evidence.json` | Usage figures. **Generated** by `task evidence`; never edit by hand |
| `src/content.config.ts` | The blip schema; the build rejects invalid frontmatter |
| `scripts/check-content.mjs` | Checks evidence is up to date and blip cross-links resolve |
| `src/components/`, `src/pages/`, `src/lib/`, `src/styles/` | The site. Only touch for layout or behaviour changes |

## Rules that are easy to get wrong

- **The ring lives in `history`.** A blip's ring is the `history` entry for the
  current edition (the last one in `editions`). There is no separate `ring`
  field. A blip with no entry for the current edition is not on the radar, but
  keep its file: its history is the record.
- `history` is oldest first, one entry per edition, edition ids quoted
  (`'2026.1'`). The schema rejects anything else.
- Numbers, positions and the new / moved markers are computed. Never add them
  to content.
- Cross-link blips with relative links: `[PHPStan](../phpstan/)`. The content
  check fails on links to blips that do not exist.
- After touching an `evidence` rule, run `task evidence` and commit the
  regenerated `evidence.json`; the content check fails until you do.
- Usage figures only cover **public** repositories, because repository names
  are published. Never add private repository names anywhere in the content.
- Do not invent facts about how ITK Dev uses something, or a `champion`. If a
  claim needs the team's knowledge, say so in your hand-off instead of
  guessing.

## Recipes

### Add a blip

1. Copy `docs/blip-template.md` to `src/content/blips/<id>.md` and fill it in
   (see [Writing a blip](#writing-a-blip)).
2. Add an `evidence` rule if the technology leaves a trace in repositories
   (package, root file, Docker image, workflow). Omit it otherwise.
3. Give it one `history` entry for the current edition.
4. `task evidence` (if it has a rule), then `task check`.

### Move a blip to another ring

Within the current edition (not yet published): change the `ring` of its
current `history` entry and rewrite the `note`. In a new edition: add a new
`history` entry (see below). Update the write-up's last paragraph so it argues
the new ring.

### Take a blip off the radar

Leave the file. Do not add a `history` entry for the new edition.

### Publish a new edition

1. Append `{ id: 'YYYY.N', published: 'YYYY-MM' }` to `editions` in
   `src/data/radar.ts`.
2. For every blip that stays on the radar, append a `history` entry for the new
   edition (same or new ring) with a note. Blips without one drop off.
3. Add new blips; `task evidence`; `task check`.
4. `CHANGELOG.md`: describe the edition under `[Unreleased]`.
5. Open a pull request. Publishing is a semver release (a new edition is a
   minor release; see "Releasing" in `README.md`), which only a human does.

### Upgrade the design system

Change `config.designSystemVersion` in `package.json` to the new tag of
`itk-dev/itkaarhus-design-system`, run `task restart` (or
`npm run sync:design-system`), then `task check` and look at the site in a browser.

## Writing a blip

- English, plain and direct; written for a developer at ITK who has not used
  the technology. "We" is ITK Dev.
- `summary`: one sentence. `note`: one or two sentences on why this ring, this
  edition.
- Body: three short paragraphs, about 100–200 words in total. First what it is,
  then how we use it (kinds of projects, setup, related blips), then why this
  ring and what would move it.
- No marketing language, no emoji, no version-by-version history (that is what
  `history` is for).
- Rings mean what `rings` in `src/data/radar.ts` says. Trial needs production
  use on at least one project; Hold means "no new work", not "rewrite now".

## Code changes

- Styling uses the ITK Aarhus design system tokens (`--itkaarhus-*`) and its
  `.itkaarhus-*` components; never hardcode a colour, size or radius that exists
  as a token. Follow the design system's rules (blue leads, no gradients, no
  emoji, Lucide icons from its sprite).
- The site has a light and a dark theme (the design system's `data-theme`
  opt-in). Use the semantic tokens — `--itkaarhus-bg*`, `--itkaarhus-text*`,
  `--itkaarhus-border*`, `--itkaarhus-primary` and the other role and `*-soft`
  tokens — never raw scale steps such as `--itkaarhus-gray-700`, which do not
  change with the theme. Check changes in both themes with the header switch.
  To test unreleased design system changes, run `task design-system:local`
  (npm: `ITKAARHUS_DS_DIR=../itkaarhus-design-system npm run dev`).
- The design system is downloaded into `vendor/` by
  `scripts/sync-design-system.mjs`; never edit `vendor/`.
- The radar layout (`src/lib/radar-layout.ts`) is deterministic and throws if a
  sector is too crowded. If that happens after adding blips, adjust
  `RING_RADII` or `BLIP_RADIUS` rather than special-casing a blip.

## Workflow

- Branch from `main` (`feature/<short-slug>` or
  `feature/issue-<n>-<slug>`); never commit to `main`.
- Conventional Commits (`feat:`, `fix:`, `docs:` …); content changes are
  usually `docs:` or `feat:` for a new edition.
- Every pull request adds a `CHANGELOG.md` entry under `[Unreleased]`.
- Pull requests are checked by `.github/workflows/` (build, formatting, Markdown, changelog).
- Never push tags; publishing an edition is a human decision.
