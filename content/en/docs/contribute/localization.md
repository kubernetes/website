---
title: Localizing Kubernetes Documentation
content_template: templates/concept
approvers:
- remyleone
- rlenferink
- zacharysarah
card:
  name: contribute
  weight: 30
  title: Translating the docs
---

{{% capture overview %}}

This page shows you how to [localize](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/) the docs for a different language.

{{% /capture %}}

{{% capture body %}}

## Getting started

Because contributors can't approve their own pull requests, you need at least two contributors to begin a localization. 

All localization teams must be self-sustaining with their own resources. We're happy to host your work, but we can't translate it for you.

### Find your two-letter language code

First, consult the [ISO 639-1 standard](https://www.loc.gov/standards/iso639-2/php/code_list.php) to find your localization's two-letter country code. For example, the two-letter code for Korean is `ko`.

### Fork and clone the repo

First, [create your own fork](/docs/contribute/start/#improve-existing-content) of the [kubernetes/website](https://github.com/kubernetes/website) repository.

Then, clone your fork and `cd` into it:

```shell
git clone https://github.com/<username>/website
cd website
```

### Open a pull request

Next, [open a pull request](https://kubernetes.io/docs/contribute/start/#submit-a-pull-request) (PR) to add a localization to the `kubernetes/website` repository. 

The PR must include all of the [minimum required content](#minimum-required-content) before it can be approved.

For an example of adding a new localization, see the PR to enable [docs in French](https://github.com/kubernetes/website/pull/12548).
    
### Join the Kubernetes GitHub organization

Once you've opened a localization PR, you can become members of the Kubernetes GitHub organization. Each person on the team needs to create their own [Organization Membership Request](https://github.com/kubernetes/org/issues/new/choose) in the `kubernetes/org` repository.

### Add your localization team in GitHub

Next, add your Kubernetes localization team to [`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml). For an example of adding a localization team, see the PR to add the [Spanish localization team](https://github.com/kubernetes/org/pull/685). 

Members of `sig-docs-**-owners` can approve PRs that change content within (and only within) your localization directory: `/content/**/`. 

The `sig-docs-**-reviews` team automates review assignment for new PRs.

Members of `sig-docs-l10n-admins` can create new development branches to coordinate translation efforts.

Members of `website-milestone-maintainers` can use the `/milestone` [Prow command](https://prow.k8s.io/command-help) to assign a milestone to issues or PRs.
    
### Configure the workflow

Next, add a GitHub label for your localization in the `kubernetes/test-infra` repository. A label lets you filter issues and pull requests for your specific language.

For an example of adding a label, see the PR for adding the [Italian language label](https://github.com/kubernetes/test-infra/pull/11316).

### Find community

Let Kubernetes SIG Docs know you're interested in creating a localization! Join the [SIG Docs Slack channel](https://kubernetes.slack.com/messages/C1J0BPD2M/). Other localization teams are happy to help you get started and answer any questions you have.

You can also create a Slack channel for your localization in the `kubernetes/community` repository. For an example of adding a Slack channel, see the PR for [adding channels for Indonesian and Portuguese](https://github.com/kubernetes/community/pull/3605). 

## Minimum required content

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

### Localize the Community Code of Conduct 

Open a PR against the [`cncf/foundation`](https://github.com/cncf/foundation/tree/master/code-of-conduct-languages) repository to add the code of conduct in your language.

### Add a localized README

To guide other localization contributors, add a new [`README-**.md`](https://help.github.com/articles/about-readmes/) to the top level of k/website, where `**` is the two-letter language code. For example, a German README file would be `README-de.md`.

Provide guidance to localization contributors in the localized `README-**.md` file. Include the same information contained in `README.md` as well as:

- A point of contact for the localization project
- Any information specific to the localization

After you create the localized README, add a link to the file from the main English `README.md`, and include contact information in English. You can provide a GitHub ID, email address, [Slack channel](https://slack.com/), or other method of contact. You must also provide a link to your localized Community Code of Conduct.

### Setting up the OWNERS files

To set the roles of each user contributing to the localization, create an `OWNERS` file inside the language-specific subdirectory with:

- **reviewers**: A list of kubernetes teams with reviewer roles, in this case, the `sig-docs-**-reviews` team created in [Add your localization team in GitHub](#add-your-localization-team-in-github).
- **approvers**: A list of kubernetes teams with approvers roles, in this case, the `sig-docs-**-owners` team created in [Add your localization team in GitHub](#add-your-localization-team-in-github).
- **labels**: A list of GitHub labels to automatically apply to a PR, in this case, the language label created in [Configure the workflow](#configure-the-workflow).

More information about the `OWNERS` file can be found at [go.k8s.io/owners](https://go.k8s.io/owners).

The [Spanish OWNERS file](https://git.k8s.io/website/content/es/OWNERS), with language code `es`, looks like:

```yaml
# See the OWNERS docs at https://go.k8s.io/owners

# This is the localization project for Spanish.
# Teams and members are visible at https://github.com/orgs/kubernetes/teams.

reviewers:
- sig-docs-es-reviews

approvers:
- sig-docs-es-owners

labels:
- language/es
```

After adding the language-specific `OWNERS` file, update the [root `OWNERS_ALIASES`](https://git.k8s.io/website/OWNERS_ALIASES) file with the new Kubernetes teams for the localization, `sig-docs-**-owners` and `sig-docs-**-reviews`.

For each team, add the list of GitHub users requested in [Add your localization team in GitHub](#add-your-localization-team-in-github), in alphabetical order.

```diff
--- a/OWNERS_ALIASES
+++ b/OWNERS_ALIASES
@@ -48,6 +48,14 @@ aliases:
     - stewart-yu
     - xiangpengzhao
     - zhangxiaoyu-zidif
+  sig-docs-es-owners: # Admins for Spanish content
+    - alexbrand
+    - raelga
+  sig-docs-es-reviews: # PR reviews for Spanish content
+    - alexbrand
+    - electrocucaracha
+    - glo-pena
+    - raelga
   sig-docs-fr-owners: # Admins for French content
     - perriea
     - remyleone
```

## Translating content

Localizing *all* of the Kubernetes documentation is an enormous task. It's okay to start small and expand over time.

At a minimum, all localizations must include:

Description | URLs
-----|-----
Home | [All heading and subheading URLs](/docs/home/)
Setup | [All heading and subheading URLs](/docs/setup/)
Tutorials | [Kubernetes Basics](/docs/tutorials/kubernetes-basics/), [Hello Minikube](/docs/tutorials/stateless-application/hello-minikube/)
Site strings | [All site strings in a new localized TOML file](https://github.com/kubernetes/website/tree/master/i18n)

Translated documents must reside in their own `content/**/` subdirectory, but otherwise follow the same URL path as the English source. For example, to prepare the [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) tutorial for translation into German, create a subfolder under the `content/de/` folder and copy the English source:

```shell
mkdir -p content/de/docs/tutorials
cp content/en/docs/tutorials/kubernetes-basics.md content/de/docs/tutorials/kubernetes-basics.md
```

Translation tools can speed up the translation process. For example, some editors offers plugins to quickly translate text. 

{{< caution >}}
Use translation tools with care. Their output is not always accurate.
{{< /caution >}}

### Source files

Localizations must be based on the English files from the most recent release, {{< latest-version >}}.

To find source files for the most recent release:

1. Navigate to the Kubernetes website repository at https://github.com/kubernetes/website.
2. Select the `release-1.X` branch for the most recent version.

The latest version is {{< latest-version >}}, so the most recent release branch is [`{{< release-branch >}}`](https://github.com/kubernetes/website/tree/{{< release-branch >}}).

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

### Language specific style guide and glossary

Some language teams have their own language-specific style guide and glossary. For example, see the [Korean Localization Guide](/ko/docs/contribute/localization_ko/).

## Branching strategy

Because localization projects are highly collaborative efforts, we encourage teams to work in shared development branches.

To collaborate on a development branch:

1. A team member of [@kubernetes/sig-docs-l10n-admins](https://github.com/orgs/kubernetes/teams/sig-docs-l10n-admins) opens a development branch from a source branch on https://github.com/kubernetes/website.

    Your team approvers joined the `sig-docs-l10n-admins` team when you [added your localization team](#add-your-localization-team-in-github) to the `kubernetes/org` repository. 

    We recommend the following branch naming scheme:

    `dev-<source version>-<language code>.<team milestone>`

    For example, an approver on a German localization team opens the development branch `dev-1.12-de.1` directly against the k/website repository, based on the source branch for Kubernetes v1.12.

2. Individual contributors open feature branches based on the development branch.

    For example, a German contributor opens a pull request with changes to `kubernetes:dev-1.12-de.1` from `username:local-branch-name`.

3. Approvers review and merge feature branches into the development branch.

4. Periodically, an approver merges the development branch to its source branch by opening and approving a new pull request. Be sure to squash the commits before approving the pull request.

Repeat steps 1-4 as needed until the localization is complete. For example, subsequent German development branches would be: `dev-1.12-de.2`, `dev-1.12-de.3`, etc.

Teams must merge localized content into the same release branch from which the content was sourced. For example, a development branch sourced from {{< release-branch >}} must be based on {{< release-branch >}}.

An approver must maintain a development branch by keeping it current with its source branch and resolving merge conflicts. The longer a development branch stays open, the more maintenance it typically requires. Consider periodically merging development branches and opening new ones, rather than maintaining one extremely long-running development branch.

At the beginning of every team milestone, it's helpful to open an issue comparing upstream changes between the previous development branch and the current development branch. 

 While only approvers can open a new development branch and merge pull requests, anyone can open a pull request for a new development branch. No special permissions are required.

For more information about working from forks or directly from the repository, see ["fork and clone the repo"](#fork-and-clone-the-repo).

## Upstream contributions

SIG Docs welcomes [upstream contributions and corrections](/docs/contribute/intermediate#localize-content) to the English source. 

## Help an existing localization

You can also help add or improve content to an existing localization. Join the [Slack channel](https://kubernetes.slack.com/messages/C1J0BPD2M/) for the localization, and start opening PRs to help.

{{% /capture %}}

{{% capture whatsnext %}}

Once a localization meets requirements for workflow and minimum output, SIG docs will:

- Enable language selection on the website
- Publicize the localization's availability through [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) channels, including the [Kubernetes blog](https://kubernetes.io/blog/).

{{% /capture %}}
