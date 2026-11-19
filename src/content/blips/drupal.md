---
title: Drupal
summary: Our platform for content-heavy sites and OS2 solutions; new work starts on Drupal 11.
quadrant: languages-and-frameworks
tags: [framework, cms, php]
links:
  - label: drupal.org
    url: https://www.drupal.org/
  - label: OS2Forms
    url: https://github.com/OS2Forms
evidence:
  description: Requires Drupal core
  composer: [drupal/core, drupal/core-recommended]
history:
  - edition: '2026.1'
    ring: adopt
    note: Drupal 11 is the target for new and upgraded sites. Drupal 9 and 10 sites are on the upgrade path.
---

Drupal is what we use when editors are at the centre of a project: content
sites, self-service portals and the shared OS2 solutions we build with other
municipalities, such as OS2Forms. Its configuration management, translation
support and large module ecosystem let us deliver a lot without custom code.

We run Drupal sites from the `drupal-11` template in
[itkdev-docker](../itkdev-docker/), deploy with Drush, and keep custom code to
the same standards as our Symfony projects: [PHPStan](../phpstan/),
PHP-CS-Fixer and the Drupal coding standard in CI.

Sites still on Drupal 9 or 10 should be planned for an upgrade. Drupal 9 is end
of life, and staying on an old major makes every later upgrade harder.
