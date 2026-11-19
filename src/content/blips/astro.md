---
title: Astro
summary: Static site framework for documentation, reference sites and small public pages.
quadrant: languages-and-frameworks
tags: [frontend, static-site, javascript]
links:
  - label: astro.build
    url: https://astro.build/
  - label: ITK Aarhus design system
    url: https://itk-dev.github.io/itkaarhus-design-system/
evidence:
  description: Depends on astro
  npm: [astro]
history:
  - edition: '2026.1'
    ring: trial
    note: Used for the ITK Aarhus design system and this radar. A good fit for static sites hosted on GitHub Pages.
---

Astro builds content-driven sites into plain HTML and ships no JavaScript
unless a page asks for it. Markdown content collections with typed frontmatter
make it easy for the whole team to edit content through pull requests, and the
output deploys to GitHub Pages without a server.

We use it for the [ITK Aarhus design system](https://itk-dev.github.io/itkaarhus-design-system/)
and for this radar. Both are small, static and maintained by developers, which
is where Astro fits best.

It is in Trial, not Adopt: so far we have only used it for internal reference
sites. It is not a replacement for [Drupal](../drupal/) when editors need a CMS,
or for [Symfony](../symfony/) when a site needs a backend.
