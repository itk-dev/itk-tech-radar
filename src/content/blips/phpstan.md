---
title: PHPStan
summary: Static analysis for PHP, run locally and in every pull request.
quadrant: tools
tags: [php, quality, static-analysis]
links:
  - label: phpstan.org
    url: https://phpstan.org/
evidence:
  description: Configures or requires PHPStan
  composer: [phpstan/phpstan]
  files: [phpstan.neon, phpstan.dist.neon, phpstan.neon.dist]
history:
  - edition: '2026.1'
    ring: adopt
    note: Configured in most of our PHP projects and part of the standard CI workflow.
---

PHPStan finds bugs in PHP code without running it: wrong types, calls to
methods that do not exist, unreachable code. It is configured in most of our
Symfony and Drupal projects (with the Drupal and Symfony extensions) and runs
in the pull request checks from [GitHub Actions](../github-actions/).

In older code we start with a baseline that records the existing errors, then
raise the level step by step. New projects should start at a strict level from
the first commit, when it costs almost nothing.

Static analysis is also what makes large automated changes safe. It is the
safety net under [Rector](../rector/) upgrades.
