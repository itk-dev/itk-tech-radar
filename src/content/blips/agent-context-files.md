---
title: Agent context files and skills
summary: Repository instructions and shared skills that tell AI coding agents how we work.
quadrant: techniques
tags: [ai, developer-experience]
links:
  - label: itkdev-skills on GitHub
    url: https://github.com/itk-dev/itkdev-skills
  - label: AGENTS.md
    url: https://agents.md/
evidence:
  description: Has CLAUDE.md or AGENTS.md
  files: [CLAUDE.md, AGENTS.md]
history:
  - edition: '2026.1'
    ring: trial
    note: Present in a growing number of repositories, backed by shared ITK Dev skills. Practices are still settling.
---

AI coding agents do much better work when they know a project's conventions
before they start. We do this in two layers:

- **Context files** (`CLAUDE.md` / `AGENTS.md`) in the repository describe the
  project: how to run it, where things live, which standards apply.
- **Shared skills** in [itkdev-skills](https://github.com/itk-dev/itkdev-skills)
  hold the conventions that apply to all of our projects: Docker setup, Drupal
  and Symfony practices, release flow, pull request and changelog writing.

Context files are versioned with the code and reviewed like code. A wrong
instruction is a bug that affects every future change.

This is in Trial because practice is still settling: which file name to
standardise on, how much belongs in the repository and how much in shared
skills, and how to keep both current as projects change. The output of an agent
is reviewed like any other contribution.
