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

## Propose improvements

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

After discussion has taken place and the sig is in agreement about the desired
outcome, you can work on the proposed changes in the way that is the most
appropriate. For instance, an update to the style guide or the website's
functionality might involve opening a pull request, while a change related to
documentation testing might involve working with sig-testing.

## Coordinate docs for a Kubernetes release

Each Kubernetes release is coordinated by a team of people participating in the
sig-release special interest group (SIG). Others on the release team for a given
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
- Review and copyedit feature documentation drafted by the sig responsible for
  implementing the feature.
- Merge release-related pull requests and maintain the Git feature branch for
  the release.
- Mentor other SIG Docs contributors who want to learn how to do this role in
  the future. This is known as "shadowing".
- Publish the documentation changes related to the release when the release
  artifacts are published.

Coordinating a release is typically a 3-4 month commitment, and the duty is
rotated among SIG Docs approvers.

{{% /capture %}}

