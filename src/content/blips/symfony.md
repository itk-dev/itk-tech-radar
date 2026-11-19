---
title: Symfony
summary: Our default framework for applications, APIs and integrations.
quadrant: languages-and-frameworks
tags: [framework, php, backend]
links:
  - label: symfony.com
    url: https://symfony.com/
  - label: Release process
    url: https://symfony.com/releases
evidence:
  description: Requires symfony/framework-bundle
  composer: [symfony/framework-bundle]
history:
  - edition: '2026.1'
    ring: adopt
    note: The default for applications that are not primarily content sites, and the base of most of our active repositories.
---

When a project is an application rather than a content site — case handling,
booking, integrations with Serviceplatformen and other municipal systems, APIs
— we build it on Symfony. Doctrine ORM, Messenger for background work, and
EasyAdmin for back-office screens make up the usual stack, with API Platform
where a project exposes a public API.

Symfony's predictable release cycle with long-term support versions fits how we
run software for the municipality: we deliver a system and then maintain it for
years. Because Drupal is built on Symfony components, knowledge carries over
between the two kinds of project.

Start new projects on the current LTS version, and use the matching
`symfony-*` template in [itkdev-docker](../itkdev-docker/) so the project gets
the standard setup, [Taskfile](../taskfile/) and CI workflows from day one.
