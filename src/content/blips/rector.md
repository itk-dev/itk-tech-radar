---
title: Rector
summary: Automated refactoring for PHP and framework upgrades.
quadrant: tools
tags: [php, upgrades, refactoring]
links:
  - label: getrector.com
    url: https://getrector.com/
evidence:
  description: Configures or requires Rector
  composer: [rector/rector]
  files: [rector.php]
history:
  - edition: '2026.1'
    ring: trial
    note: Configured in a growing share of our PHP projects. Promising for PHP and framework upgrades, but not yet used consistently.
---

Rector rewrites PHP code from rules: upgrade to a new PHP version, replace
deprecated Symfony or Drupal APIs, add type declarations. A `rector.php` in the
project lists the rule sets, and a dry run shows the diff before anything
changes.

With many long-lived projects and a steady stream of PHP and framework
releases, upgrades are a large part of our maintenance work. Rector turns most
of the mechanical part into a reviewable diff, and [PHPStan](../phpstan/) checks
the result.

It stays in Trial because usage varies between projects: some run it in CI,
others only during upgrades, and rule sets differ. Next step: agree on a
standard configuration and decide whether it belongs in the shared CI
workflows.
