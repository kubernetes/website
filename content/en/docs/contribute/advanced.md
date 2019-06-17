---
title: Advanced contributing
slug: advanced
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

This page assumes that you've read and mastered the
[Start contributing](/docs/contribute/start/) and
[Intermediate contributing](/docs/contribute/intermediate/) topics and are ready
to learn about more ways to contribute. You need to use the Git command line
client and other tools for some of these tasks.

{{% /capture %}}

{{% capture body %}}

## Be the PR Wrangler for a week

SIG Docs [approvers](/docs/contribute/participating/#approvers) can be PR
wranglers.

SIG Docs approvers are added to the
[PR Wrangler rotation scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers)
for weekly rotations. The PR wrangler's duties include:

- Review incoming pull requests daily.
  - Help new contributors sign the CLA, and close any PR where the CLA hasn't
    been signed for two weeks. PR authors can reopen the PR after signing the
    CLA, so this is a low-risk way to make sure nothing gets merged without a
    signed CLA.
  - Provide feedback on proposed changes, including helping facilitate technical
    review from members of other SIGs.
  - Merge PRs when they are ready, or close PRs that shouldn't be accepted.
- Triage and tag incoming issues daily. See
  [Intermediate contributing](/docs/contribute/intermediate/) for guidelines
  about how SIG Docs uses metadata.

### Helpful Github queries for wranglers

The following queries are helpful when wrangling. After working through these three queries, the remaining list of PRs to be
reviewed is usually small. These queries specifically exclude localization PRs, and only include the `master` branch (except for the last one).

- [No CLA, not eligible to merge](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge+label%3Alanguage%2Fen):
  Remind the contributor to sign the CLA. If they've already been reminded by both the bot and a human, close
  the PR and remind them that they can open it after signing the CLA.
  **We can't even review PRs whose authors have not signed the CLA!**
- [Needs LGTM](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-label%3Algtm+):
  If it needs technical review, loop in one of the reviewers suggested by the bot. If it needs docs review
  or copy-editing, either suggest changes or add a copyedit commit to the PR to move it along.
- [Has LGTM, needs docs approval](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+label%3Algtm):
  See if you can figure out what needs to happen for the PR to be merged.
- [Not against master](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-base%3Amaster): If it's against a `dev-` branch, it's for an upcoming release.
  Make sure the [release meister](https://github.com/kubernetes/sig-release/tree/master/release-team) knows about it.
  If it's against an old branch, help the PR author figure out whether it's targeted against the best branch.

## Propose improvements

SIG Docs
[members](/docs/contribute/participating/#members) can propose improvements.

After you've been contributing to the Kubernetes documentation for a while, you
may have ideas for improvement to the style guide, the toolchain used to build
the documentation, the website style, the processes for reviewing and merging
pull requests, or other aspects of the documentation. For maximum transparency,
these types of proposals need to be discussed in a SIG Docs meeting or on the
[kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
In addition, it can really help to have some context about the way things
currently work and why past decisions have been made before proposing sweeping
changes. The quickest way to get answers to questions about how the documentation
currently works is to ask in the `#sig-docs` Slack channel on
[kubernetes.slack.com](https://kubernetes.slack.com)

After the discussion has taken place and the SIG is in agreement about the desired
outcome, you can work on the proposed changes in the way that is the most
appropriate. For instance, an update to the style guide or the website's
functionality might involve opening a pull request, while a change related to
documentation testing might involve working with sig-testing.

## Coordinate docs for a Kubernetes release

SIG Docs [approvers](/docs/contribute/participating/#approvers) can coordinate
docs for a Kubernetes release.

Each Kubernetes release is coordinated by a team of people participating in the
sig-release Special Interest Group (SIG). Others on the release team for a given
release include an overall release lead, as well as representatives from sig-pm,
sig-testing, and others. To find out more about Kubernetes release processes,
refer to
[https://github.com/kubernetes/sig-release](https://github.com/kubernetes/sig-release).

The SIG Docs representative for a given release coordinates the following tasks:

- Monitor the feature-tracking spreadsheet for new or changed features with an
  impact on documentation. If documentation for a given feature won't be ready
  for the release, the feature may not be allowed to go into the release.
- Attend sig-release meetings regularly and give updates on the status of the
  docs for the release.
- Review and copyedit feature documentation drafted by the SIG responsible for
  implementing the feature.
- Merge release-related pull requests and maintain the Git feature branch for
  the release.
- Mentor other SIG Docs contributors who want to learn how to do this role in
  the future. This is known as "shadowing".
- Publish the documentation changes related to the release when the release
  artifacts are published.

Coordinating a release is typically a 3-4 month commitment, and the duty is
rotated among SIG Docs approvers.

## Sponsor a new contributor

SIG Docs [reviewers](/docs/contribute/participating/#reviewers) can sponsor
new contributors.

After a new contributor has successfully submitted 5 substantive pull requests
to one or more Kubernetes repositories, they are eligible to apply for
[membership](/docs/contribute/participating#members) in the Kubernetes
organization. The contributor's membership needs to be backed by two sponsors
who are already reviewers.

New docs contributors can request sponsors by asking in the #sig-docs channel
on the [Kubernetes Slack instance](https://kubernetes.slack.com) or on the
[SIG Docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
If you feel confident about the applicant's work, you volunteer to sponsor them.
When they submit their membership application, reply to the application with a
"+1" and include details about why you think the applicant is a good fit for
membership in the Kubernetes organization.

{{% /capture %}}

