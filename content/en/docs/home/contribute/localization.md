---
title: Localizing Kubernetes Documentation
content_template: templates/concept
approvers:
- chenopis
- zacharysarah
---

{{% capture overview %}}

The Kubernetes documentation is currently available in [multiple languages](#supported-languages) and we encourage you to add new localizations ([l10n](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/))!

Currently available languages:

{{< language-repos-list >}}

In order for localizations to be accepted, however, they must fulfill some requirements related to workflow (*how* to localize) and output (*what* to localize).

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## Workflow

The Kubernetes documentation for all languages is built from the [kubernetes/website](https://github.com/kubernetes/website) repository on GitHub. Most day-to-work work on translations, however, happens in separate translation repositories. Changes to those repositories are then [periodically](#upstream-contributions) synced to the main kubernetes/website repository via [pull request](../create-pull-request).

Work on the Chinese translation, for example, happens in the [kubernetes/kubernetes-docs-zh](https://github.com/kubernetes/kubernetes-docs-zh) repository.

{{< note >}}
**Note**: For an example localization-related [pull request](../create-pull-request), see [this pull request](https://github.com/kubernetes/website/pull/8636) to the [Kubernetes website repo](https://github.com/kubernetes/website) adding Korean localization to the Kubernetes docs.
{{< /note >}}

## Source Files

Localizations must use English files from the most recent major release as sources. To find the most recent release's documentation source files:

1. Navigate to the Kubernetes website repository at https://github.com/kubernetes/website.
2. Select the `release-1.X` branch for the most recent version, which is currently **{{< latest-version >}}**, making the most recent release branch [`{{< release-branch >}}`](https://github.com/kubernetes/website/tree/{{< release-branch >}}).

## Getting started

In order to add a new localization of the Kubernetes documentation, you'll need to make a few modifications to the site's [configuration](#configuration) and [directory structure](#new-directory), and then you can get to work [translating documents](#translating-documents)!

To get started, clone the website repo and `cd` into it:

```shell
git clone https://github.com/kubernetes/website
cd website
git checkout {{< release-branch >}}
```

## Configuration

We'll walk you through the configuration process using the German language (language code `de`) as an example.

There's currently no translation for German, but you're welcome to create one using the instructions here.

The Kubernetes website's configuration is in the [`config.toml`](https://github.com/kubernetes/website/tree/master/config.toml) file. You need to add a configuration block for the new language to that file, under the existing `[languages]` block. The German block, for example, looks like this:

```toml
[languages.de]
title = "Kubernetes"
description = "Produktionsreife Container-Verwaltung"
languageName = "Deutsch"
contentDir = "content/de"
weight = 3
```

When assigning a `weight` parameter, see which of the current languages has the highest weight and add 1 to that value.

Now add a language-specific subdirectory to the [`content`](https://github.com/kubernetes/website/tree/master/content) folder. The two-letter code for German is `de`, so add a `content/de` directory:

```shell
mkdir content/de
```

## Translating documents

We understand that localizing *all* of the Kubernetes documentation would be an enormous task. We're okay with localizations smarting small and expanding over time.

As an initial requirement, all localizations must include the following documentation at a minimum:

Description | URLs
-----|-----
Home | [All heading and subheading URLs](https://kubernetes.io/docs/home/)
Setup | [All heading and subheading URLs](https://kubernetes.io/docs/setup/)
Tutorials | [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/), [Hello Minikube](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)

Translated documents should have the same URL endpoint as the English docs (substituting the subdirectory of the `content` folder). To translate the [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) doc into German, for example, create the proper subfolder under the `content/de` folder and copy the English doc:

```shell
mkdir -p content/de/docs/tutorials
cp content/en/docs/tutorials/kubernetes-basics.md content/de/docs/tutorials/kubernetes-basics.md
```

## Project logistics

### Contact with project chairs

When starting a new localization effort, you should get in touch with one of the chairs of the Kubernetes [SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs) organization. The current chairs are listed [here](https://github.com/kubernetes/community/tree/master/sig-docs#chairs).

### Project information

Teams working on localization efforts must provide a single point of contact, including the name and contact information of a person who can respond to or redirect questions or concerns, listed in the translation repository's main [`README`](https://help.github.com/articles/about-readmes/). You can provide an email address, email list, [Slack channel](https://slack.com/), or some other method of contact.

### Maintainers

Each localization repository must select its own maintainers. Maintainers can be from a single organization or multiple organizations.

In addition, all l10n work must be self-sustaining with the team's own resources.

Wherever possible, every localized page must be approved by a reviewer from a different company than the translator.

### GitHub project

Each Kubernetes localization repository must track its overall progress with a [GitHub project](https://help.github.com/articles/creating-a-project-board/).

Projects must include at least these columns:

- To Do
- In Progress
- Done

{{< note >}}
**Note**: For an example GitHub project, see the [Chinese localization project](https://github.com/kubernetes/kubernetes-docs-zh/projects/1).
{{< /note >}}

### Repository structure

Each l10n repository must have branches for the different Kubernetes documentation release versions, matching the branches in the main [kubernetes/website](https://github.com/kubernetes/website) documentation repository. For example, the kubernetes/website `release-1.10` branch (https://github.com/kubernetes/website/tree/release-1.10) has a corresponding branch in the kubernetes/kubernetes-docs-zh repository (https://github.com/kubernetes/kubernetes-docs-zh/tree/release-1.10). These version branches keep track of the differences in the documentation between Kubernetes versions.

### Upstream contributions

Upstream contributions are welcome and encouraged!

For the sake of efficiency, limit upstream contributions to a single pull request per week, containing a single [squashed commit](https://github.com/todotxt/todo.txt-android/wiki/Squash-All-Commits-Related-to-a-Single-Issue-into-a-Single-Commit).

{{% /capture %}}

{{% capture whatsnext %}}

Once a l10n meets requirements for workflow and minimum output, SIG docs will:

- Work with the localization team to implement language selection on the website.
- Publicize availability through [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) channels.

{{% /capture %}}
