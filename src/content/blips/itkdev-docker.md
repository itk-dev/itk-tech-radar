---
title: itkdev-docker
summary: Our shared Docker Compose setup, images and project templates, used locally and on servers.
quadrant: platforms-and-infrastructure
tags: [docker, traefik, local-development, hosting]
links:
  - label: devops_itkdev-docker on GitHub
    url: https://github.com/itk-dev/devops_itkdev-docker
evidence:
  description: docker-compose.yml uses itkdev images
  contents:
    docker-compose.yml: ['image:\s*itkdev/']
history:
  - edition: '2026.1'
    ring: adopt
    note: The standard for every project. Templates for Symfony, Drupal and Python keep local and server setups the same.
---

[devops_itkdev-docker](https://github.com/itk-dev/devops_itkdev-docker) gives
every project the same shape: a `docker-compose.yml` for local development, a
`docker-compose.server.yml` for our servers, Traefik in front, and the
`itkdev/*` images for PHP, [MariaDB](../mariadb/) and supporting tools. The
`itkdev-docker-compose` wrapper and the project templates turn starting a new
project into a single command.

Because local and server environments use the same images and Compose files,
"works on my machine" problems are rare. Any developer can pick up any project
without first learning its setup.

Use the matching template for new projects and keep projects in line with it
when they are upgraded. Deviations should be documented in the project README.
