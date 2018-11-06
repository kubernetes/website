---
title: Localizing Kubernetes Documentation
content_template: templates/concept
approvers:
- chenopis
- zacharysarah
- zparnold
---

{{% capture overview %}}

Documentation for Kubernetes is available in multiple languages:

- English
- Chinese
- Japanese
- Korean

We encourage you to add new  [localizations](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)!

{{% /capture %}}


{{% capture body %}}

## Getting started

Localizations must meet some requirements for workflow (*how* to localize) and output (*what* to localize).

To add a new localization of the Kubernetes documentation, you'll need to update the website by modifying the  [site configuration](#modify-the-site-configuration) and [directory structure](#add-a-new-localization-directory). Then you can start [translating documents](#translating-documents)!

{{< note >}}
For an example localization-related [pull request](../create-pull-request), see [this pull request](https://github.com/kubernetes/website/pull/8636) to the [Kubernetes website repo](https://github.com/kubernetes/website) adding Korean localization to the Kubernetes docs.
{{< /note >}}

Let Kubernetes SIG Docs know you're interested in creating a localization! Join the [SIG Docs Slack channel](https://kubernetes.slack.com/messages/C1J0BPD2M/). We're happy to help you get started and answer any questions you have.

All localization teams must be self-sustaining with their own resources. We're happy to host your work, but we can't translate it for you.

### Fork and clone the repo

First, [create your own fork](https://help.github.com/articles/fork-a-repo/) of the [kubernetes/website](https://github.com/kubernetes/website).

Then, clone the website repo and `cd` into it:

```shell
git clone https://github.com/kubernetes/website
cd website
```

{{< note >}}
Contributors to `k/website` must [create a fork](https://kubernetes.io/docs/contribute/start/#improve-existing-content) from which to open pull requests. For localizations, we ask additionally that:

1. Team approvers open development branches directly from https://github.com/kubernetes/website.
2. Localization contributors work from forks, with branches based on the current development branch.

This is because localization projects are collaborative efforts on long-running branches, similar to the development branches for the Kubernetes release cycle. For information about localization pull requests, see ["branching strategy"](#branching-strategy).
{{< /note >}}

### Find your two-letter language code

Consult the [ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php) for your localization's two-letter country code. For example, the two-letter code for German is `de`.

{{< note >}}
These instructions use the [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) language code for German (`de`) as an example.

There's currently no Kubernetes localization for German, but you're welcome to create one!
{{< /note >}}

### Modify the site configuration

The Kubernetes website uses Hugo as its web framework. The website's Hugo configuration resides in the  [`config.toml`](https://github.com/kubernetes/website/tree/master/config.toml) file. To support a new localization, you'll need to modify `config.toml`.

Add a configuration block for the new language to `config.toml`, under the existing `[languages]` block. The German block, for example, looks like:

```toml
[languages.de]
title = "Kubernetes"
description = "Produktionsreife Container-Verwaltung"
languageName = "Deutsch"
contentDir = "content/de"
weight = 3
```

When assigning a `weight` parameter for your block, find the language block with the highest weight and add 1 to that value.

For more information about Hugo's multilingual support, see "[Multilingual Mode](https://gohugo.io/content-management/multilingual/)".

### Add a new localization directory

Add a language-specific subdirectory to the [`content`](https://github.com/kubernetes/website/tree/master/content) folder in the repository. For example, the two-letter code for German is `de`:

```shell
mkdir content/de
```

### Add a localized README

To guide other localization contributors, add a new [`README-**.md`](https://help.github.com/articles/about-readmes/) to the top level of k/website, where `**` is the two-letter language code. For example, a German README file would be `README-de.md`.

Provide guidance to localization contributors in the localized `README-**.md` file. Include the same information contained in `README.md` as well as:

- A point of contact for the localization project
- Any information specific to the localization

After you create the localized README, add a link to the file from the main English file, [`README.md`'s Localizing Kubernetes Documentation] and include contact information in English. You can provide a GitHub ID, email address, [Slack channel](https://slack.com/), or other method of contact.

## Translating documents

Localizing *all* of the Kubernetes documentation is an enormous task. It's okay to start small and expand over time.

At a minimum, all localizations must include:

Description | URLs
-----|-----
Home | [All heading and subheading URLs](https://kubernetes.io/docs/home/)
Setup | [All heading and subheading URLs](https://kubernetes.io/docs/setup/)
Tutorials | [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/), [Hello Minikube](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)
Site strings | [All site strings in a new localized TOML file](https://github.com/kubernetes/website/tree/master/i18n)

Translated documents must reside in their own `content/**/` subdirectory, but otherwise follow the same URL path as the English source. For example, to prepare the [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) tutorial for translation into German, create a subfolder under the `content/de/` folder and copy the English source:

```shell
mkdir -p content/de/docs/tutorials
cp content/en/docs/tutorials/kubernetes-basics.md content/de/docs/tutorials/kubernetes-basics.md
```

For an example of a localization-related [pull request](../create-pull-request), [this pull request](https://github.com/kubernetes/website/pull/10471) to the [Kubernetes website repo](https://github.com/kubernetes/website) added Korean localization to the Kubernetes docs.

### Source Files

Localizations must use English files from the most recent release as their source. The most recent version is **{{< latest-version >}}**.

To find source files for the most recent release:

1. Navigate to the Kubernetes website repository at https://github.com/kubernetes/website.
2. Select the `release-1.X` branch for the most recent version.

The latest version is **{{< latest-version >}}**, so the most recent release branch is [`{{< release-branch >}}`](https://github.com/kubernetes/website/tree/{{< release-branch >}}).

### Site strings in i18n/

Localizations must include the contents of [`i18n/en.toml`](https://github.com/kubernetes/website/blob/master/i18n/en.toml) in a new language-specific file. Using German as an example: `i18n/de.toml`.

Add a new localization file to `i18n/`. For example, with German (`de`):

```shell
cp i18n/en.toml i18n/de.toml
```

Then translate the value of each string:

```TOML
[docs_label_i_am]
other = "ICH BIN..."
```

Localizing site strings lets you customize site-wide text and features: for example, the legal copyright text in the footer on each page.

## Project logistics

### Contact the SIG Docs chairs

Contact one of the chairs of the Kubernetes [SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs#chairs) chairs when you start a new localization.

### Maintainers

Each localization repository must provide its own maintainers. Maintainers can be from a single organization or multiple organizations. Whenever possible, localization pull requests should be approved by a reviewer from a different organization than the translator.

A localization must provide a minimum of two maintainers. (It's not possible to review and approve one's own work.)

### Branching strategy

Because localization projects are highly collaborative efforts, we encourage teams to work from a shared development branch.

To collaborate on a development branch:

1. A team member opens a development branch, usually by opening a new pull request against a source branch on https://github.com/kubernetes/website.

    We recommend the following branch naming scheme:

    `dev-<source version>-<language code>.<team milestone>`

    For example, an approver on a German localization team opens the development branch `dev-1.12-de.1` directly against the k/website repository, based on the source branch for Kubernetes v1.12.

2. Individual contributors open feature branches based on the development branch.

    For example, a German contributor opens a pull request with changes to `kubernetes:dev-1.12-de.1` from `username:local-branch-name`.

3. Approvers review and merge feature branches into the development branch.

4. Periodically, an approver merges the development branch to its source branch.

Repeat steps 1-4 as needed until the localization is complete. For example, subsequent German development branches would be: `dev-1.12-de.2`, `dev-1.12-de.3`, etc.

Teams must merge localized content into the same release branch from which the content was sourced. For example, a development branch sourced from {{< release-branch >}} must be based on {{< release-branch >}}.

An approver must maintain a development branch by keeping it current with its source branch and resolving merge conflicts. The longer a development branch stays open, the more maintenance it typically requires. Consider periodically merging development branches and opening new ones, rather than maintaining one extremely long-running development branch.

While only approvers can merge pull requests, anyone can open a pull request for a new development branch. No special permissions are required.

For more information about working from forks or directly from the repository, see ["fork and clone the repo"](#fork-and-clone-the-repo).

### Upstream contributions

SIG Docs welcomes upstream contributions and corrections to the English source! Open a [pull request](https://kubernetes.io/docs/contribute/start/#improve-existing-content) (from a fork) with any updates.

{{% /capture %}}

{{% capture whatsnext %}}

Once a l10n meets requirements for workflow and minimum output, SIG docs will:

- Enable language selection on the website
- Publicize the localization's availability through [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) channels, including the [Kubernetes blog](https://kubernetes.io/blog/).

{{% /capture %}}
