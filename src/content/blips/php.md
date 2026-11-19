---
title: PHP
summary: The language behind nearly all of our applications and sites; 8.4 is the current baseline.
quadrant: languages-and-frameworks
tags: [language, backend]
links:
  - label: php.net
    url: https://www.php.net/
  - label: Supported versions
    url: https://www.php.net/supported-versions.php
evidence:
  description: Runs on the itkdev PHP 8.4 image
  contents:
    docker-compose.yml: ['itkdev/php8\.4-fpm']
history:
  - edition: '2026.1'
    ring: adopt
    note: PHP 8.4 is the baseline for new projects and the most common runtime image in our repositories. PHP 8.5 is appearing in new work.
---

PHP is the language our team knows best, and both of our main frameworks,
[Symfony](../symfony/) and [Drupal](../drupal/), are built on it. Shared
tooling, base images, coding standards and review habits all assume PHP, so it
is the cheapest language for us to start, staff and maintain a project in.

We run PHP through the `itkdev/php*-fpm` images from
[itkdev-docker](../itkdev-docker/), which pins the version per project in
`docker-compose.yml`. New projects start on **8.4**. Projects on older
versions are upgraded when they are touched, with [Rector](../rector/) doing
most of the mechanical work.

Projects still on PHP 7.x or 8.2 are out of security support upstream. Treat
them as upgrade candidates, not as a reason to keep old images alive.
