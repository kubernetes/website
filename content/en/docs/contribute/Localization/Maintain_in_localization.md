---
title: Maintain an Existing Localization
content_type: concept
approvers:
- remyleone
- rlenferink
weight: 50
card:
  name: contribute
  weight: 50
  title: Localizing the docs
---

<!-- overview -->

This page shows you how to Contribute in Existing
[localization](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/).
You can help add or improve the content of an existing localization. In
[Kubernetes Slack](https://slack.k8s.io/), you can find a channel for each
localization. There is also a general
[SIG Docs Localizations Slack channel](https://kubernetes.slack.com/messages/sig-docs-localizations)
where you can say hello.

{{< note >}}
For extra details on how to contribute to a specific localization,
look for a localized version of this page.
{{< /note >}}


<!-- body -->

### Language-specific localization guide

As a localization team, you can formalize the best practices your team follows
by creating a language-specific localization guide.

For example, see the
[Korean Localization Guide](/ko/docs/contribute/localization_ko/), which
includes content on the following subjects:

- Sprint cadence and releases
- Branch strategy
- Pull request workflow
- Style guide
- Glossary of localized and non-localized terms
- Markdown conventions
- Kubernetes API object terminology

## Language-specific Zoom meetings

If the localization project needs a separate meeting time, contact a SIG Docs
Co-Chair or Tech Lead to create a new reoccurring Zoom meeting and calendar
invite. This is only needed when the team is large enough to sustain and require
a separate meeting.

Per CNCF policy, the localization teams must upload their meetings to the SIG
Docs YouTube playlist. A SIG Docs Co-Chair or Tech Lead can help with the
process until SIG Docs automates it.

## Branch strategy

Because localization projects are highly collaborative efforts, we
encourage teams to work in shared localization branches - especially
when starting out and the localization is not yet live.

To collaborate on a localization branch:

1. A team member of
   [@kubernetes/website-maintainers](https://github.com/orgs/kubernetes/teams/website-maintainers)
   opens a localization branch from a source branch on
   https://github.com/kubernetes/website.

   Your team approvers joined the `@kubernetes/website-maintainers` team when
   you [added your localization team](#add-your-localization-team-in-github) to
   the [`kubernetes/org`](https://github.com/kubernetes/org) repository.

   We recommend the following branch naming scheme:

   `dev-<source version>-<language code>.<team milestone>`

   For example, an approver on a German localization team opens the localization
   branch `dev-1.12-de.1` directly against the `kubernetes/website` repository,
   based on the source branch for Kubernetes v1.12.

1. Individual contributors open feature branches based on the localization
   branch.

   For example, a German contributor opens a pull request with changes to
   `kubernetes:dev-1.12-de.1` from `username:local-branch-name`.

1. Approvers review and merge feature branches into the localization branch.

1. Periodically, an approver merges the localization branch with its source
   branch by opening and approving a new pull request. Be sure to squash the
   commits before approving the pull request.

Repeat steps 1-4 as needed until the localization is complete. For example,
subsequent German localization branches would be: `dev-1.12-de.2`,
`dev-1.12-de.3`, etc.

Teams must merge localized content into the same branch from which the content
was sourced. For example:

- A localization branch sourced from `main` must be merged into `main`.
- A localization branch sourced from `release-{{% skew "prevMinorVersion" %}}`
  must be merged into `release-{{% skew "prevMinorVersion" %}}`.

{{< note >}}
If your localization branch was created from `main` branch, but it is not merged
into `main` before the new release branch `{{< release-branch >}}` created,
merge it into both `main` and new release branch `{{< release-branch >}}`. To
merge your localization branch into the new release branch
`{{< release-branch >}}`, you need to switch the upstream branch of your
localization branch to `{{< release-branch >}}`.
{{< /note >}}

At the beginning of every team milestone, it's helpful to open an issue
comparing upstream changes between the previous localization branch and the
current localization branch. There are two scripts for comparing upstream
changes.

- [`upstream_changes.py`](https://github.com/kubernetes/website/tree/main/scripts#upstream_changespy)
  is useful for checking the changes made to a specific file. And
- [`diff_l10n_branches.py`](https://github.com/kubernetes/website/tree/main/scripts#diff_l10n_branchespy)
  is useful for creating a list of outdated files for a specific localization
  branch.

While only approvers can open a new localization branch and merge pull requests,
anyone can open a pull request for a new localization branch. No special
permissions are required.

For more information about working from forks or directly from the repository,
see ["fork and clone the repo"](#fork-and-clone-the-repo).




## Source files

Localizations must be based on the English files from a specific release
targeted by the localization team. Each localization team can decide which
release to target, referred to as the _target version_ below.

To find source files for your target version:

1. Navigate to the Kubernetes website repository at
   https://github.com/kubernetes/website.

1. Select a branch for your target version from the following table:

Target version | Branch
-----|-----
Latest version | [`main`](https://github.com/kubernetes/website/tree/main)
Previous version | [`release-{{< skew prevMinorVersion >}}`](https://github.com/kubernetes/website/tree/release-{{< skew prevMinorVersion >}})
Next version | [`dev-{{< skew nextMinorVersion >}}`](https://github.com/kubernetes/website/tree/dev-{{< skew nextMinorVersion >}})

The `main` branch holds content for the current release `{{< latest-version >}}`.
The release team creates a `{{< release-branch >}}` branch before the next
release: v{{< skew nextMinorVersion >}}.