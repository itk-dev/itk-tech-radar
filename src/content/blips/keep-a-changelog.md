---
title: Keep a Changelog
summary: The changelog convention we follow in every project, with an entry added in each pull request.
quadrant: techniques
tags: [process, releases, conventions]
links:
  - label: keepachangelog.com
    url: https://keepachangelog.com/
evidence:
  description: CHANGELOG.md follows Keep a Changelog
  contents:
    CHANGELOG.md: ['keepachangelog\.com']
history:
  - edition: '2026.1'
    ring: adopt
    note: Our standard changelog format, and enforced in pull requests by the shared changelog workflow.
---

[Keep a Changelog](https://keepachangelog.com/) is a widely used convention for
a human-written `CHANGELOG.md`: the newest release first, changes grouped as
Added, Changed, Fixed and so on, and an `[Unreleased]` section at the top that
collects changes until the next release.

We follow it in our projects. Every pull request adds a short entry under
`[Unreleased]`, and the shared `changelog.yaml` workflow in
[GitHub Actions](../github-actions/) fails the pull request if it did not. At
release time the section is renamed to the version and date.

Following a published convention, rather than a format of our own, means
anyone can read our changelogs without learning a house style, and tooling
that understands the format works out of the box. Writing the entry while the
change is fresh is cheap, and gives the municipality's project owners release
notes they can read. Entries describe what changed for a user or operator, not
how it was implemented.
