---
title: MariaDB
summary: Our default relational database for Symfony and Drupal projects.
quadrant: platforms-and-infrastructure
tags: [database]
links:
  - label: mariadb.org
    url: https://mariadb.org/
evidence:
  description: docker-compose.yml runs MariaDB
  contents:
    docker-compose.yml: ['image:\s*(itkdev/)?mariadb']
history:
  - edition: '2026.1'
    ring: adopt
    note: The default database in our project templates and the most common database across our repositories.
---

MariaDB is the database our [itkdev-docker](../itkdev-docker/) templates ship
with, through the `itkdev/mariadb` image, and the one our hosting, backups and
operations routines are built around. Both Doctrine and Drupal support it fully,
and the team has years of experience running and tuning it.

Use it unless a project has a concrete need it cannot meet. A few projects use
PostgreSQL with PostGIS for geographic data. That is a legitimate exception, but
it should be chosen for that reason, not out of preference, because every
second database engine is a second thing for us to operate.
