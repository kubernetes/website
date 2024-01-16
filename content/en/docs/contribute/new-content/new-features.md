---
title: Documenting a feature for a release
linktitle: Documenting for a release
content_type: concept
main_menu: true
weight: 20
card:
  name: contribute
  weight: 45
  title: Documenting a feature for a release
---
<!-- overview -->

Each major Kubernetes release introduces new features that require documentation. New releases also bring updates to existing features and documentation (such as upgrading a feature from alpha to beta).

Generally, the SIG responsible for a feature submits draft documentation of the
feature as a pull request to the appropriate development branch of the
`kubernetes/website` repository, and someone on the SIG Docs team provides
editorial feedback or edits the draft directly. This section covers the branching
conventions and process used during a release by both groups.



<!-- body -->

## For documentation contributors

In general, documentation contributors don't write content from scratch for a release.
Instead, they work with the SIG creating a new feature to refine the draft documentation and make it release ready.

After you've chosen a feature to document or assist, ask about it in the `#sig-docs`
Slack channel, in a weekly SIG Docs meeting, or directly on the PR filed by the
feature SIG. If you're given the go-ahead, you can edit into the PR using one of
the techniques described in
[Commit into another person's PR](/docs/contribute/review/for-approvers/#commit-into-another-person-s-pr).

### Find out about upcoming features

To find out about upcoming features, attend the weekly SIG Release meeting (see
the [community](/community/) page for upcoming meetings)
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

The release notes draft is a good place to find out about
specific features, changes, deprecations, and more about the release. The
content is not finalized until late in the release cycle, so use caution.

### Feature tracking sheet

The feature tracking sheet [for a given Kubernetes release](https://github.com/kubernetes/sig-release/tree/master/releases)
lists each feature that is planned for a release.
Each line item includes the name of the feature, a link to the feature's main
GitHub issue, its stability level (Alpha, Beta, or Stable), the SIG and
individual responsible for implementing it, whether it
needs docs, a draft release note for the feature, and whether it has been
merged. Keep the following in mind:

- Beta and Stable features are generally a higher documentation priority than
  Alpha features.
- It's hard to test (and therefore to document) a feature that hasn't been merged,
  or is at least considered feature-complete in its PR.
- Determining whether a feature needs documentation is a manual process. Even if
  a feature is not marked as needing docs, you may need to document the feature.

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

1. Open a **draft** pull request against the
`dev-{{< skew nextMinorVersion >}}` branch in the `kubernetes/website` repository, with a small
commit that you will amend later. To create a draft pull request, use the
Create Pull Request drop-down and select **Create Draft Pull Request**,
then click **Draft Pull Request**.
2. Edit the pull request description to include links to [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)
PR(s) and [kubernetes/enhancements](https://github.com/kubernetes/enhancements) issue(s).
3. Leave a comment on the related [kubernetes/enhancements](https://github.com/kubernetes/enhancements)
issue with a link to the PR to notify the docs person managing this release that
the feature docs are coming and should be tracked for the release.

If your feature does not need
any documentation changes, make sure the sig-release team knows this, by
mentioning it in the `#sig-release` Slack channel. If the feature does need
documentation but the PR is not created, the feature may be removed from the
milestone.

### PR ready for review

When ready, populate your placeholder PR with feature documentation and change
the state of the PR from draft to **ready for review**. To mark a pull request
as ready for review, navigate to the merge box and click **Ready for review**.

Do your best to describe your feature and how to use it. If you need help structuring your documentation, ask in the `#sig-docs` Slack channel.

When you complete your content, the documentation person assigned to your feature reviews it.
To ensure technical accuracy, the content may also require a technical review from corresponding SIG(s).
Use their suggestions to get the content to a release ready state.

If your feature needs documentation and the first draft
content is not received, the feature may be removed from the milestone.

#### Feature gates {#ready-for-review-feature-gates}

If your feature is an Alpha or Beta feature and is behind a feature gate,
you need a feature gate file for it inside
`content/en/docs/reference/command-line-tools-reference/feature-gates/`.
The name of the file should be the feature gate, converted from `UpperCamelCase`
to `kebab-case`, with `.md` as the suffix.
You can look at other files already in the same directory for a hint about what yours
should look like. Usually a single paragraph is enough; for longer explanations,
add documentation elsewhere and link to that.

Also,
to ensure your feature gate appears in the [Alpha/Beta Feature gates](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) table, include the following details 
in the [front matter](https://gohugo.io/content-management/front-matter/) of your Markdown
description file:

```yaml
stages:
  - stage: <alpha/beta/stable/deprecated>  # Specify the development stage of the feature gate
    defaultValue: <true or false>     # Set to true if enabled by default, false otherwise
    fromVersion: <Version>            # Version from which the feature gate is available
    toVersion: <Version>              # (Optional) The version until which the feature gate is available
```

With net new feature gates, a separate
description of the feature gate is also required; create a new Markdown file
inside `content/en/docs/reference/command-line-tools-reference/feature-gates/`
(use other files as a template).

When you change a feature gate to disabled-by-default to enabled-by-default,
you may also need to change other documentation (not just the list of
feature gates). Watch out for language such as ”The `exampleSetting` field
is a beta field and disabled by default. You can enable it by enabling the
`ProcessExampleThings` feature gate.”

If your feature is GA'ed or deprecated, 
include an additional `stage` entry within the `stages` block in the description file. 
Ensure that the Alpha and Beta stages remain intact. 
This step transitions the feature gate from the 
[Feature gates for Alpha/Feature](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) table
to [Feature gates for graduated or deprecated features](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features) table. For example:

{{< highlight yaml "linenos=false,hl_lines=10-15" >}}
stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.12"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.13"
    toVersion: "1.18"    
  # Added 'stable' stage block to existing stages.  
  - stage: stable     
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.27"   
{{< / highlight >}}

Eventually, Kubernetes will stop including the feature gate at all. To signify the removal of a feature gate, 
include `removed: true` in the front matter of the respective description file.
This action triggers the transition of the feature gate 
from [Feature gates for graduated or deprecated features](/docs/reference/command-line-tools-reference/feature-gates-removed/#feature-gates-that-are-removed) section to a dedicated page titled 
[Feature Gates (removed)](/docs/reference/command-line-tools-reference/feature-gates-removed/), including its description.

### All PRs reviewed and ready to merge

If your PR has not yet been merged into the `dev-{{< skew nextMinorVersion >}}` branch by the release deadline, work with the
docs person managing the release to get it in by the deadline. If your feature needs
documentation and the docs are not ready, the feature may be removed from the
milestone.