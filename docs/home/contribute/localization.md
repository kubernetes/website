---
title: Localizing Kubernetes Documentation
---

To add a localization of Kubernetes documentation to the Kubernetes website, localizations must meet the following requirements for _workflow_ (how to localize) and _output_ (what to localize).

## Workflow  

- All localization work must happen within a Kubernetes organization repository specifically dedicated to localization.

    For example: https://github.com/kubernetes/kubernetes-docs-cn

    To open a localization repository, [contact the SIG docs lead](https://kubernetes.slack.com/messages/C1J0BPD2M) on Slack for assistance.

- Teams must track their overall progress with a GitHub project.

    Projects must include columns for pending work, work in progress, and completed work.

- L10n teams must provide their own repository maintainers.

- All localization work must be self-sustaining with the team's own resources.

- Upstream contributions are limited to a maximum of one PR with squashed commits per week.

## Output

All localizations must include the following documentation at a minimum:

Description | URLs
-----|-----
Home | [All heading and subheading URLs](https://kubernetes.io/docs/home/)
Setup | [All heading and subheading URLs](https://kubernetes.io/docs/setup/)
Tutorials | [Kubernetes Basics](https://kubernetes.io/docs/tutorials/), [Hello Minikube](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)

## Next steps

Once a localization project meets requirements for workflow and minimum output, SIG docs will work with the localization team to implement a language selector on the website and publicize availability through [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) channels.

**Note:** Implementation of a language selector is pending Kubernetes' first completed localization project.
