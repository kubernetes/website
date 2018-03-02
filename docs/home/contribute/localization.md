---
title: Localizing Kubernetes Documentation
approvers:
- chenopis
- zacharysarah
---

We're happy to add localizations (l10n) of Kubernetes documentation to the website!

Localizations must meet the following requirements for _workflow_ (how to localize) and _output_ (what to localize).

## Workflow  

All l10n work must be stored and tracked within the [Kubernetes organization](https://github.com/kubernetes).

### Basis for localizations

Localizations must source from the English files for the [most recent major release](https://kubernetes.io/docs/home/supported-doc-versions/#current-version).

**Note:** To find the most recent release's documentation source files:
1. Navigate to https://github.com/kubernetes/website.
2. Select the `release-1.X` branch for the most recent version.

    For example, the branch for Kubernetes v1.9 docs is `release-1.9`.

Source files reside in the `/docs/` directory.
{: .note}

### Repository

A l10n team will have a repository specifically dedicated to its work, for example: [kubernetes/kubernetes-docs-cn](https://github.com/kubernetes/kubernetes-docs-cn).

**Note:** To open a l10n repository, [contact the SIG docs lead](https://kubernetes.slack.com/messages/C1J0BPD2M) on Slack for assistance.
{: .note}

### Project

Teams must track their overall progress with a [GitHub project](https://help.github.com/articles/creating-a-project-board/).

Projects must include columns for:
- To do
- In progress
- Done

For example: the [Chinese localization project](https://github.com/kubernetes/kubernetes-docs-cn/projects/1).

### Team function

L10n teams must provide a single point of contact: the name and contact information of a person who can respond to or redirect questions or concerns.

L10n teams must provide their own repository maintainers.

All l10n work must be self-sustaining with the team's own resources.

Wherever possible, every localized page must be approved by a reviewer from a different company than the translator.

### Upstream contributions

Upstream contributions are welcome and encouraged!

For the sake of efficiency, limit upstream contributions to a single pull request per week, containing a single squashed commit.

## Output

All localizations must include the following documentation at a minimum:

Description | URLs
-----|-----
Home | [All heading and subheading URLs](https://kubernetes.io/docs/home/)
Setup | [All heading and subheading URLs](https://kubernetes.io/docs/setup/)
Tutorials | [Kubernetes Basics](https://kubernetes.io/docs/tutorials/), [Hello Minikube](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)

## Next steps

Once a l10n meets requirements for workflow and minimum output, SIG docs will:
- Work with the localization team to implement language selection on the website
- Publicize availability through [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) channels.

**Note:** Implementation of language selection is pending Kubernetes' first completed localization project.
{: .note}
