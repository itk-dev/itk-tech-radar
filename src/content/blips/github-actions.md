---
title: GitHub Actions
summary: Pull request checks with shared workflow templates for PHP, Twig, JavaScript, Markdown and changelogs.
quadrant: tools
tags: [ci, quality]
links:
  - label: GitHub Actions documentation
    url: https://docs.github.com/actions
  - label: Workflow templates in devops_itkdev-docker
    url: https://github.com/itk-dev/devops_itkdev-docker
evidence:
  description: Has GitHub Actions workflows
  workflows: ['.']
history:
  - edition: '2026.1'
    ring: adopt
    note: Runs the pull request checks in most active repositories, using workflow files shared through itkdev-docker.
---

Every pull request in our repositories is checked by GitHub Actions. The
workflows are not written per project: [itkdev-docker](../itkdev-docker/) ships
a standard set (`php.yaml`, `twig.yaml`, `javascript.yaml`, `markdown.yaml`,
`changelog.yaml` and more) that projects copy and keep up to date. Each
workflow runs the same coding standards and static analysis a developer can run
locally through the [Taskfile](../taskfile/).

Shared workflows mean a reviewer can trust that formatting, linting and
[PHPStan](../phpstan/) are already handled, and can spend the review on the
change itself.

Deployment is deliberately not done in Actions; see
[Woodpecker CI](../woodpecker-ci/).
