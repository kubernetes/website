---
title: Localizing Kubernetes Documentation
---

We're happy to add localizations of Kubernetes documentation to the website!

Localizations must meet the following requirements for _workflow_ (how to localize) and _output_ (what to localize).

## Workflow  

All localization work must be stored and tracked within the [Kubernetes organization](https://github.com/kubernetes).

#### Repository

A localization team will have a repository specifically dedicated to its work, for example: [kubernetes/kubernetes-docs/cn](https://github.com/kubernetes/kubernetes-docs-cn).

**Note:** To open a localization repository, [contact the SIG docs lead](https://kubernetes.slack.com/messages/C1J0BPD2M) on Slack for assistance.
{: .note}

#### Project

Teams must track their overall progress with a [GitHub project](https://help.github.com/articles/creating-a-project-board/).

Projects must include columns for:
- pending work
- work in progress
- completed work

#### Team function

L10n teams must provide their own repository maintainers.

All localization work must be self-sustaining with the team's own resources.

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

Once a localization project meets requirements for workflow and minimum output, SIG docs will:
- Work with the localization team to implement a language selector on the website
- Publicize availability through [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) channels.

**Note:** Implementation of a language selector is pending Kubernetes' first completed localization project.
{: .note}
