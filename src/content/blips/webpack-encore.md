---
title: Webpack Encore
summary: Legacy front-end build for Symfony projects; do not use it for new work.
quadrant: languages-and-frameworks
tags: [frontend, symfony, build]
links:
  - label: Webpack Encore documentation
    url: https://symfony.com/doc/current/frontend/encore/index.html
evidence:
  description: Depends on Webpack Encore
  npm: ['@symfony/webpack-encore']
  composer: [symfony/webpack-encore-bundle]
history:
  - edition: '2026.1'
    ring: hold
    note: Replaced by AssetMapper for new Symfony projects. Existing projects keep Encore until a natural point to migrate.
---

Webpack Encore wraps webpack with Symfony-friendly defaults and was our
standard way to build front-end assets for years. Many of our older Symfony
projects still use it, together with Babel, Sass loaders and a Node toolchain
in CI.

That toolchain is now the most frequent source of dependency updates in those
projects, while giving us little that [AssetMapper](../symfony-assetmapper/)
does not. Do not start new projects on Encore. When an existing project needs a
larger front-end change or a major upgrade, plan a move to AssetMapper as part
of it.

Hold does not mean "rewrite now". It means the default has changed and new
work should not add to the pile.
