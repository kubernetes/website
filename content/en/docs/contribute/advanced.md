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

SIG Docs [approvers](/docs/contribute/participating/#approvers) take regular turns as the PR wrangler for the repository and are added to the [PR Wrangler rotation scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers#2019-schedule-q1q2) for weekly rotations. 

The PR wrangler’s duties include:

- Review [open pull requests](https://github.com/kubernetes/website/pulls) daily for quality and adherence to the [style guide](/docs/contribute/style/style-guide/).
    - Review the smallest PRs (`size/XS`) first, then iterate towards the largest (`size/XXL`).
    - Review as many PRs as you can.
- Ensure that the CLA is signed by each contributor.
    - Help new contributors sign the [CLA](https://github.com/kubernetes/community/blob/master/CLA.md).
    - Use [this](https://github.com/zparnold/k8s-docs-pr-botherer) script to automatically remind contributors that haven’t signed the CLA to sign the CLA.
- Provide feedback on proposed changes and help facilitate technical reviews from members of other SIGs.
    - Provide inline suggestions on the PR for the proposed content changes.
    - If you need to verify content, comment on the PR and request more details.
    - Assign relevant `sig/` label(s).
    - If needed, assign reviewers from the `reviewers:` block in the file's front matter.
    - Assign `Docs Review` and `Tech Review` labels to indicate the PR's review status.
    - Assign`Needs Doc Review` or `Needs Tech Review` for PRs that haven't yet been reviewed.
    - Assign `Doc Review: Open Issues` or `Tech Review: Open Issues` for PRs that have been reviewed and require further input or action before merging.
    - Assign `/lgtm` and `/approve` labels to PRs that can be merged. 
- Merge PRs when they are ready, or close PRs that shouldn’t be accepted.
- Triage and tag incoming issues daily. See [Intermediate contributing](/docs/contribute/intermediate/) for guidelines on how SIG Docs uses metadata.

### Helpful GitHub queries for wranglers

The following queries are helpful when wrangling. After working through these three queries, the remaining list of PRs to be
reviewed is usually small. These queries specifically exclude localization PRs, and only include the `master` branch (except for the last one).

- [No CLA, not eligible to merge](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge+label%3Alanguage%2Fen):
  Remind the contributor to sign the CLA. If they have already been reminded by both the bot and a human, close
  the PR and remind them that they can open it after signing the CLA.
  **Do not review PRs whose authors have not signed the CLA!**
- [Needs LGTM](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-label%3Algtm+):
  If it needs technical review, loop in one of the reviewers suggested by the bot. If it needs docs review
  or copy-editing, either suggest changes or add a copyedit commit to the PR to move it along.
- [Has LGTM, needs docs approval](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+label%3Algtm):
  Determine whether any additional changes or updates need to be made for the PR to be merged. If you think the PR is ready to be merged, comment `/approve`.
- [Not against master](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-base%3Amaster): If it's against a `dev-` branch, it's for an upcoming release. Make sure the [release meister](https://github.com/kubernetes/sig-release/tree/master/release-team) knows about it by adding a comment with `/assign @<meister's_github-username>`. If it's against an old branch, help the PR author figure out whether it's targeted against the best branch.

### When to close Pull Requests

Reviews and approvals are one tool to keep our PR queue short and current. Another tool is closure. 

- Close any PR where the CLA hasn’t been signed for two weeks. 
PR authors can reopen the PR after signing the CLA, so this is a low-risk way to make sure nothing gets merged without a signed CLA.

- Close any PR where the author has not responded to comments or feedback in 2 or more weeks.

Don't be afraid to close pull requests. Contributors can easily reopen and resume works in progress. Oftentimes a closure notice is what spurs an author to resume and finish their contribution.

To close a pull request, leave a `/close` comment on the PR.

{{< note >}}

An automated service, [`fejta-bot`](https://github.com/fejta-bot) automatically marks issues as stale after 90 days of inactivity, then closes them after an additional 30 days of inactivity when they become rotten. PR wranglers should close issues after 14-30 days of inactivity.

{{< /note >}}

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

## Serve as a New Contributor Ambassador

SIG Docs [approvers](/docs/contribute/participating/#approvers) can serve as
New Contributor Ambassadors. 

New Contributor Ambassadors work together to welcome new contributors to SIG-Docs, 
suggest PRs to new contributors, and mentor new contributors through their first
few PR submissions.  

Responsibilities for New Contributor Ambassadors include: 

- Being available on the [Kubernetes #sig-docs channel](https://kubernetes.slack.com) to answer questions from new contributors.
- Working with PR wranglers to identify good first issues for new contributors. 
- Mentoring new contributors through their first few PRs to the docs repo. 
- Helping new contributors create the more complex PRs they need to become Kubernetes members.
- [Sponsoring contributors](/docs/contribute/advanced/#sponsor-a-new-contributor) on their path to becoming Kubernetes members. 

Current New Contributor Ambassadors are announced at each SIG-Docs meeting, and in the [Kubernetes #sig-docs channel](https://kubernetes.slack.com). 

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

## Serve as a SIG Co-chair

SIG Docs [approvers](/docs/contribute/participating/#approvers) can serve a term as a co-chair of SIG Docs.

### Prerequisites

Approvers must meet the following requirements to be a co-chair:

- Have been a SIG Docs approver for at least 6 months
- Have [led a Kubernetes docs release](/docs/contribute/advanced/#coordinate-docs-for-a-kubernetes-release) or shadowed two releases
- Understand SIG Docs workflows and tooling: git, Hugo, localization, blog subproject
- Understand how other Kubernetes SIGs and repositories affect the SIG Docs workflow, including: [teams in k/org](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml), [process in k/community](https://github.com/kubernetes/community/tree/master/sig-docs), plugins in [k/test-infra](https://github.com/kubernetes/test-infra/), and the role of [SIG Architecture](https://github.com/kubernetes/community/tree/master/sig-architecture). 
- Commit at least 5 hours per week (and often more) to the role for a minimum of 6 months

### Responsibilities

The role of co-chair is primarily one of service: co-chairs handle process and policy, schedule and run meetings, schedule PR wranglers, and generally do the things that no one else wants to do in order to build contributor capacity. 

Responsibilities include:

- Keep SIG Docs focused on maximizing developer happiness through excellent documentation
- Exemplify the [community code of conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) and hold SIG members accountable to it
- Learn and set best practices for the SIG by updating contribution guidelines
- Schedule and run SIG meetings: weekly status updates, quarterly retro/planning sessions, and others as needed
- Schedule and run doc sprints at KubeCon events and other conferences
- Recruit for and advocate on behalf of SIG Docs with the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} and its platinum partners, including Google, Oracle, Azure, IBM, and Huawei
- Keep the SIG running smoothly

### Running effective meetings

To schedule and run effective meetings, these guidelines show what to do, how to do it, and why.

**Uphold the [community code of conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md)**:

- Hold respectful, inclusive discussions with respectful, inclusive language.

**Set a clear agenda**:

- Set a clear agenda of topics
- Publish the agenda in advance

For weekly meetings, copypaste the previous week's notes into the "Past meetings" section of the notes

**Collaborate on accurate notes**:

- Record the meeting's discussion
- Consider delegating the role of note-taker

**Assign action items clearly and accurately**:

- Record the action item, who is assigned to it, and the expected completion date

**Moderate as needed**:

- If discussion strays from the agenda, refocus participants on the current topic
- Make room for different discussion styles while keeping the discussion focused and honoring folks' time

**Honor folks' time**:

- Begin and end meetings punctually 

**Use Zoom effectively**:

- Familiarize yourself with [Zoom guidelines for Kubernetes](https://github.com/kubernetes/community/blob/master/communication/zoom-guidelines.md)
- Claim the host role when you log in by entering the host key

<img src="/images/docs/contribute/claim-host.png" width="75%" alt="Claiming the host role in Zoom" />

### Recording meetings on Zoom

When you’re ready to start the recording, click Record to Cloud.
    
When you’re ready to stop recording, click Stop.

The video uploads automatically to YouTube.

{{% /capture %}}
