---
title: Localizing Kubernetes Documentation
content_template: templates/concept
approvers:
- chenopis
- zacharysarah
---

{{% capture overview %}}

The Kubernetes documentation is currently available in [multiple languages](#supported-languages) and we encourage you to add new localizations ([l10n](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/))!

In order for localizations to be accepted, however, they must fulfill some requirements related to [workflow](#workflow) (*how* to localize) and [output](#output) (*what* to localize).

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## Supported languages

The Kubernetes documentation is currently available in the following languages:

{{< languages-list >}}

## Workflow  

All Kubernetes documentation for all languages is built from the [kubernetes/website](https://github.com/kubernetes/website) repository on GitHub. You don't need to create or maintain a separate repository to add a localization.

### Getting started

In order to add a new localization of the Kubernetes documentation, you'll need to make a few modifications to the site's [configuration](#configuration) and [directory structure](#new-directory), and then you can get to work [translating documents](#translating-documents)!

We'll walk you through this whole process by adding support for the German language.

{{< note >}}
For an example localization-related [pull request](../create-pull-request) adding Korean localization to the Kubernetes docs, see [this pull request](https://github.com/kubernetes/website/pull/8636) to the [Kubernetes website repo](https://github.com/kubernetes/website).
{{< /note >}}

To get started, clone the website repo and `cd` into it:

```bash
$ git clone https://github.com/kubernetes/website
$ cd website
```

### Releases

Localizations must use English files from the [most recent major
release](https://kubernetes.io/docs/home/supported-doc-versions/#current-version) as sources.

To find the most recent release's documentation source files:

1. Navigate to the Kubernetes website repository at https://github.com/kubernetes/website.
2. Select the `release-1.X` branch for the most recent version. The branch for Kubernetes v1.9 docs, for example, is `release-1.9`.

### Configuration

The website's configuration is in the [`config.toml`](https://github.com/kubernetes/website/tree/master/config.toml) file. You'll need to add a configuration block for the new language to that file, under the existing `[languages]` blocks. The German block looks like this:

```toml
[languages]
[languages.de]
title = "Kubernetes"
description = "Produktionsreife Container-Verwaltung"
languageName = "Deutsch"
contentDir = "content/de"
weight = 3
```

When assigning a `weight` parameter, make sure to see which of the current languages has the highest weight and simply add 1.

### New directory

In order to begin adding documentation for a new localization, you'll need to add a subdirectory to the

In the configuration example [above](#configuration), for example, the two-letter code for German is `de`. That means that a `de` directory needs to be added to the `content` directory:

```bash
$ mkdir content/de
```

### Translating documents

## Project

Teams must track their overall progress with a [GitHub project](https://help.github.com/articles/creating-a-project-board/).

Projects must include columns for:

- To do
- In progress
- Done

For example: the [Chinese localization project](https://github.com/kubernetes/kubernetes-docs-cn/projects/1).

### Team function

[Teams](#teams-function) working on localization efforts must track their overall progress with a [GitHub project](https://help.github.com/articles/creating-a-project-board/).

l10n teams must provide:

* A single point of contact, including the name and contact information of a person who can respond to or redirect questions or concerns.
* Their own repository maintainers.

In addition, all l10n work must be self-sustaining with the team's own resources.

Wherever possible, every localized page must be approved by a reviewer from a different company than the translator.

### Upstream contributions

Upstream contributions are welcome and encouraged!

For the sake of efficiency, limit upstream contributions to a single pull request per week, containing a single [squashed commit](https://github.com/todotxt/todo.txt-android/wiki/Squash-All-Commits-Related-to-a-Single-Issue-into-a-Single-Commit).

## Output

We understand that localizing *all* of the Kubernetes documentation would be an enormous task. We're okay with localizations smarting small and expanding later.

As an initial requirement, all localizations must include the following documentation at a minimum:

Description | URLs
-----|-----
Home | [All heading and subheading URLs](https://kubernetes.io/docs/home/)
Setup | [All heading and subheading URLs](https://kubernetes.io/docs/setup/)
Tutorials | [Kubernetes Basics](https://kubernetes.io/docs/tutorials/), [Hello Minikube](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)

{{% /capture %}}

{{% capture whatsnext %}}

Once a l10n meets requirements for workflow and minimum output, SIG docs will:

- Work with the localization team to implement language selection on the website.
- Publicize availability through [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) channels.


{{% /capture %}}
