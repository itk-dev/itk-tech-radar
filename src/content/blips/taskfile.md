---
title: Taskfile
summary: One entry point for the commands a project needs, from setup to coding standards.
quadrant: tools
tags: [developer-experience, automation]
links:
  - label: taskfile.dev
    url: https://taskfile.dev/
evidence:
  description: Has a Taskfile
  files: [Taskfile.yml, Taskfile.yaml]
history:
  - edition: '2026.1'
    ring: adopt
    note: Standard in our project templates. `task --list` is the first thing to run in an unfamiliar project.
---

[Task](https://taskfile.dev/) is a small, YAML-based task runner. Our projects
use a `Taskfile.yml` for the commands everyone needs: bringing the site up,
installing dependencies, running migrations, applying and checking coding
standards, and running the tests.

The value is consistency. A developer new to a project runs `task --list`
instead of reading through a README for the right `docker compose exec`
incantation. CI can call the same tasks a developer runs locally, so the two
stay in sync.

Every project should have a Taskfile, with the standard task names used across
our projects so the same commands work everywhere.
