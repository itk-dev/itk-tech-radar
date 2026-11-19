---
title: Woodpecker CI
summary: Runs our release deployments to staging and production servers.
quadrant: platforms-and-infrastructure
tags: [deployment, ci, ansible]
links:
  - label: woodpecker-ci.org
    url: https://woodpecker-ci.org/
evidence:
  description: Has Woodpecker pipelines
  files: [.woodpecker, .woodpecker.yml, .woodpecker.yaml]
history:
  - edition: '2026.1'
    ring: adopt
    note: The deployment pipeline for projects on our servers, triggered by releases and running Ansible playbooks.
---

Pull requests are checked in [GitHub Actions](../github-actions/); deployments
happen in Woodpecker. A project's `.woodpecker/` folder holds one pipeline per
environment (typically `stg.yml` and `prod.yml`). Each pipeline runs on a
release event and calls our Ansible plugin, which pulls the release on the
server and runs the post-deploy steps: migrations, `drush deploy`, cache clears.

Keeping deployment in our own self-hosted CI means server credentials never
leave our infrastructure. It also means a release is deployed the same way no
matter who cuts it.

New projects hosted on our servers should copy the pipelines from a recent
project rather than write deployment scripts of their own.
