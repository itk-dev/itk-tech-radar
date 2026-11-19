---
# Copy to src/content/blips/<id>.md. The file name is the blip id and its URL
# (/blips/<id>/): lowercase, hyphenated, stable. Remove these comments.
title: Rector
# One sentence, no trailing jargon. Shown in lists and as the meta description.
summary: Automated refactoring for PHP and framework upgrades.
# languages-and-frameworks | tools | platforms-and-infrastructure | techniques
quadrant: tools
# Optional: the person who keeps the write-up current. Only a real, agreed name.
# champion: Jane Doe
tags: [php, upgrades, refactoring]
links:
  - label: getrector.com
    url: https://getrector.com/
# Optional: how `task evidence` finds it in a repository; any match counts.
# composer/npm: package names. files: names in the repository root.
# contents: root file name → case-insensitive regexes matched against its
# contents. workflows: regexes matched against .github/workflows file names.
# Quote regexes.
evidence:
  description: Configures or requires Rector
  composer: [rector/rector]
  files: [rector.php]
# Oldest first; one entry per edition the blip was on the radar.
history:
  - edition: '2026.1'
    ring: trial
    note: One or two sentences on why it sits in this ring in this edition.
---

First paragraph: what it is, in plain words, for a developer who has not used
it.

Second paragraph: how ITK Dev uses it — which kinds of projects, how it is set
up (link related blips with `[PHPStan](../phpstan/)`).

Last paragraph: why this ring, and what would move it (in or out).
