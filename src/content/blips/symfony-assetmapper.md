---
title: AssetMapper and Stimulus
summary: Front-end assets for Symfony apps with import maps instead of a JavaScript build step.
quadrant: languages-and-frameworks
tags: [frontend, symfony, javascript]
links:
  - label: AssetMapper documentation
    url: https://symfony.com/doc/current/frontend/asset_mapper.html
  - label: Stimulus
    url: https://stimulus.hotwired.dev/
evidence:
  description: Requires symfony/asset-mapper
  composer: [symfony/asset-mapper]
history:
  - edition: '2026.1'
    ring: trial
    note: In production on several Symfony projects. Use it for new Symfony apps with modest front-end needs.
---

Symfony's AssetMapper serves JavaScript and CSS straight to the browser using
native import maps, so a typical Symfony application no longer needs Node,
webpack or a bundling step in its build. Stimulus controllers cover the
interactivity most of our back-office screens need.

Fewer moving parts means fewer dependency updates, a faster CI run and one
less toolchain to keep alive over a project's lifetime. It is the reason we put
[Webpack Encore](../webpack-encore/) on hold.

It stays in Trial because we have not yet used it on a project with a heavy
front end. Applications that need a component framework or a lot of client-side
state may still be better served by a dedicated build tool.
