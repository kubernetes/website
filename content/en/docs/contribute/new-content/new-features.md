---
title: Documenting a new feature
linktitle: New features
content_template: templates/concept
main_menu: true
weight: 20
card:
  name: contribute
  weight: 45
  title: Documenting a new feature
---
{{% capture overview %}}

Each major Kubernetes release includes new features.
Most of these features need documentation to show people how to use them.

Generally, the SIG responsible for a feature submits draft documentation for the
feature as a pull request to the appropriate release branch of
`kubernetes/website` repository, and someone on the SIG Docs team provides
editorial feedback or edits the draft directly. This section covers the branching
conventions and process used by both groups.

{{% /capture %}}

{{% capture body %}}

## For documentation contributors

As stated above, usually the SIG creating a new feature submits draft documentation.
This means that your role may be
more of a shepherding role for a given feature than developing the documentation
from scratch.

After you've chosen a feature to document/shepherd, ask about it in the `#sig-docs`
Slack channel, in a weekly SIG Docs meeting, or directly on the PR filed by the
feature SIG. If you're given the go-ahead, you can edit into the PR using one of
the techniques described in
[Commit into another person's PR](#commit-into-another-persons-pr).

### Find out about upcoming features

To find out about upcoming features, attend the weekly SIG Release meeting (see
the [community](https://kubernetes.io/community/) page for upcoming meetings)
and monitor the release-specific documentation
in the [kubernetes/sig-release](https://github.com/kubernetes/sig-release/)
repository. Each release has a sub-directory in the [/sig-release/tree/master/releases/](https://github.com/kubernetes/sig-release/tree/master/releases)
directory. The sub-directory contains a release schedule, a draft of the release
notes, and a document listing each person on the release team.

The release schedule contains links to all other documents, meetings,
meeting minutes, and milestones relating to the release. It also contains
information about the goals and timeline of the release, and any special
processes in place for this release. Near the bottom of the document, several
release-related terms are defined.

This document also contains a link to the **Feature tracking sheet**, which is
the official way to find out about all new features scheduled to go into the
release.

The release team document lists who is responsible for each release role. If
it's not clear who to talk to about a specific feature or question you have,
either attend the release meeting to ask your question, or contact the release
lead so that they can redirect you.

The release notes draft is a good place to find out a little more about
specific features, changes, deprecations, and more about the release. The
content is not finalized until late in the release cycle, so use caution.

### Feature tracking sheet

The feature tracking sheet
[for a given Kubernetes release](https://github.com/kubernetes/sig-release/tree/master/releases) lists each feature that is planned for a release.
Each line item includes the name of the feature, a link to the feature's main
GitHub issue, its stability level (Alpha, Beta, or Stable), the SIG and
individual responsible for implementing it, whether it
needs docs, a draft release note for the feature, and whether it has been
merged. Keep the following in mind:

- Beta and Stable features are generally a higher documentation priority than
  Alpha features.
- It's hard to test (and therefore, document) a feature that hasn't been merged,
  or is at least considered feature-complete in its PR.
- Determining whether a feature needs documentation is a manual process and
  just because a feature is not marked as needing docs doesn't mean it doesn't
  need them.

## For developers or other SIG members

This section is information for members of other Kubernetes SIGs documenting new features
for a release.

If you are a member of a SIG developing a new feature for Kubernetes, you need
to work with SIG Docs to be sure your feature is documented in time for the
release. Check the
[feature tracking spreadsheet](https://github.com/kubernetes/sig-release/tree/master/releases)
or check in the `#sig-release` Kubernetes Slack channel to verify scheduling details and
deadlines.

### Open a placeholder PR

1. Open a pull request against the
`release-X.Y` branch in the `kubernetes/website` repository, with a small
commit that you will amend later.
2. Use the Prow command `/milestone X.Y` to
assign the PR to the relevant milestone. This alerts the docs person managing
this release that the feature docs are coming.

If your feature does not need
any documentation changes, make sure the sig-release team knows this, by
mentioning it in the `#sig-release` Slack channel. If the feature does need
documentation but the PR is not created, the feature may be removed from the
milestone.

### PR ready for review

When ready, populate your placeholder PR with feature documentation.

Don't worry about polish or formatting, just describe what the
feature does and how to use it. The docs
person managing the release will work with you to get the content into shape
to be published.

If your feature needs documentation and the first draft
content is not received, the feature may be removed from the milestone.

### All PRs reviewed and ready to merge

If your PR has not
yet been merged into the `release-X.Y` branch by this deadline, work with the
docs person managing the release to get it in. If your feature needs
documentation and the docs are not ready, the feature may be removed from the
milestone.

If your feature is an Alpha feature and is behind a feature gate, make sure you
add it to [Feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
as part of your pull request. If your feature is moving out of Alpha, make sure to
remove it from that file.

{{% /capture %}}
