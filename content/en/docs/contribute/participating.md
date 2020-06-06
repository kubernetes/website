---
title: Participating in SIG Docs
content_template: templates/concept
weight: 60
card:
  name: contribute
  weight: 60
---

{{% capture overview %}}

SIG Docs is one of the
[special interest groups](https://github.com/kubernetes/community/blob/master/sig-list.md)
within the Kubernetes project, focused on writing, updating, and maintaining
the documentation for Kubernetes as a whole. See
[SIG Docs from the community github repo](https://github.com/kubernetes/community/tree/master/sig-docs)
for more information about the SIG.

SIG Docs welcomes content and reviews from all contributors. Anyone can open a
pull request (PR), and anyone is welcome to file issues about content or comment
on pull requests in progress.

You can also become a [member](#members),
[reviewer](#reviewers), or [approver](#approvers). These roles require greater
access and entail certain responsibilities for approving and committing changes.
See [community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md)
for more information on how membership works within the Kubernetes community.

The rest of this document outlines some unique ways these roles function within
SIG Docs, which is responsible for maintaining one of the most public-facing
aspects of Kubernetes -- the Kubernetes website and documentation.

{{% /capture %}}

{{% capture body %}}

## Roles and responsibilities

- **Anyone** can contribute to Kubernetes documentation. To contribute, you must [sign the CLA](/docs/contribute/new-content/overview/#sign-the-cla) and have a GitHub account.
- **Members** of the Kubernetes organization are contributors who have spent time and effort on the Kubernetes project, usually by opening pull requests with accepted changes. See [Community membership](https://github.com/kubernetes/community/blob/master/community-membership.md) for membership criteria.
- A SIG Docs **Reviewer** is a member of the Kubernetes organization who has
  expressed interest in reviewing documentation pull requests, and has been
  added to the appropriate GitHub group and `OWNERS` files in the GitHub
  repository by a SIG Docs Approver.
- A SIG Docs **Approver** is a member in good standing who has shown a continued
  commitment to the project. An approver can merge pull requests
  and publish content on behalf of the Kubernetes organization.
  Approvers can also represent SIG Docs in the larger Kubernetes community.
  Some duties of a SIG Docs approver, such as coordinating a release,
  require a significant time commitment.

## Anyone

Anyone can do the following:

- Open a GitHub issue against any part of Kubernetes, including documentation.
- Provide non-binding feedback on a pull request.
- Help to localize existing content
- Bring up ideas for improvement on [Slack](http://slack.k8s.io/) or the [SIG docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
- Use the `/lgtm` Prow command (short for "looks good to me") to recommend the changes in a pull request for merging.
  {{< note >}}
  If you are not a member of the Kubernetes organization, using `/lgtm` has no effect on automated systems.
  {{< /note >}}

After [signing the CLA](/docs/contribute/new-content/overview/#sign-the-cla), anyone can also:
- Open a pull request to improve existing content, add new content, or write a blog post or case study.

## Members

Members are contributors to the Kubernetes project who meet the [membership criteria](https://github.com/kubernetes/community/blob/master/community-membership.md#member). SIG Docs welcomes contributions from all members of the Kubernetes community,
and frequently requests reviews from members of other SIGs for technical accuracy.

Any member of the [Kubernetes organization](https://github.com/kubernetes) can do the following:

- Everything listed under [Anyone](#anyone)
- Use the `/lgtm` comment to add the LGTM (looks good to me) label to a pull request.
- Use the `/hold` command to prevent a pull request from being merged, if the pull request already has the LGTM and approve labels.
- Use the `/assign` comment to assign a reviewer to a pull request.

### Becoming a member

After you have successfully submitted at least 5 substantive pull requests, you
can request [membership](https://github.com/kubernetes/community/blob/master/community-membership.md#member)
in the Kubernetes organization. Follow these steps:

1.  Find two reviewers or approvers to [sponsor](/docs/contribute/advanced#sponsor-a-new-contributor)
    your membership.

      Ask for sponsorship in the [#sig-docs channel on the
      Kubernetes Slack instance](https://kubernetes.slack.com) or on the
      [SIG Docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

      {{< note >}}
      Don't send a direct email or Slack direct message to an individual
      SIG Docs member.
      {{< /note >}}

2.  Open a GitHub issue in the `kubernetes/org` repository to request membership.
    Fill out the template using the guidelines at
    [Community membership](https://github.com/kubernetes/community/blob/master/community-membership.md).

3.  Let your sponsors know about the GitHub issue, either by at-mentioning them
    in the GitHub issue (adding a comment with `@<GitHub-username>`) or by sending them the link directly,
    so that they can add a `+1` vote.

4.  When your membership is approved, the github admin team member assigned to your request updates the
    GitHub issue to show approval and then closes the GitHub issue.
    Congratulations, you are now a member!

If your membership request is not accepted, the
membership committee provides information or steps to take before applying
again.

## Reviewers

Reviewers are members of the
[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)
GitHub group. Reviewers review documentation pull requests and provide feedback on proposed
changes. Reviewers can:

- Do everything listed under [Anyone](#anyone) and [Members](#members)
- Document new features
- Triage and categorize issues
- Review pull requests and provide binding feedback
- Create diagrams, graphics assets, and embeddable screencasts and videos
- Edit user-facing strings in code
- Improve code comments

### Assigning reviewers to pull requests

Automation assigns reviewers to all pull requests. You can request a
review from a specific reviewer with a comment on the pull request: `/assign
[@_github_handle]`. To indicate that a pull request is technically accurate and
requires no further changes, a reviewer adds a `/lgtm` comment to the pull
request.

If the assigned reviewer has not yet reviewed the content, another reviewer can
step in. In addition, you can assign technical reviewers and wait for them to
provide a `/lgtm` comment.

For a trivial change or one that needs no technical review, SIG Docs
[approvers](#approvers) can provide the `/lgtm` as well.

An `/approve` comment from a reviewer is ignored by automation.

### Becoming a reviewer

When you meet the
[requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer),
you can become a SIG Docs reviewer. Reviewers in other SIGs must apply
separately for reviewer status in SIG Docs.

To apply, open a pull request to add yourself to the `reviewers` section of the
[top-level OWNERS file](https://github.com/kubernetes/website/blob/master/OWNERS)
in the `kubernetes/website` repository. Assign the PR to one or more current SIG
Docs approvers.

If your pull request is approved, you are now a SIG Docs reviewer.
[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
will assign and suggest you as a reviewer on new pull requests.

If you are approved, request that a current SIG Docs approver add you to the
[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)
GitHub group. Only members of the `kubernetes-website-admins` GitHub group can
add new members to a GitHub group.

## Approvers

Approvers are members of the
[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
GitHub group. See [SIG Docs teams and automation](#sig-docs-teams-and-automation) for details.

Approvers can do the following:

- Everything listed under [Anyone](#anyone), [Members](#members) and [Reviewers](#reviewers)
- Publish contributor content by approving and merging pull requests using the `/approve` comment.
  If someone who is not an approver leaves the approval comment, automation ignores it.
- Participate in a Kubernetes release team as a docs representative
- Propose improvements to the style guide
- Propose improvements to docs tests
- Propose improvements to the Kubernetes website or other tooling

If the PR already has a `/lgtm`, or if the approver also comments with `/lgtm`,
the PR merges automatically. A SIG Docs approver should only leave a `/lgtm` on
a change that doesn't need additional technical review.

### Becoming an approver

When you meet the
[requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#approver),
you can become a SIG Docs approver. Approvers in other SIGs must apply
separately for approver status in SIG Docs.

To apply, open a pull request to add yourself to the `approvers` section of the
[top-level OWNERS file](https://github.com/kubernetes/website/blob/master/OWNERS)
in the `kubernetes/website` repository. Assign the PR to one or more current SIG
Docs approvers.

If your pull request is approved, you are now a SIG Docs approver.
[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
will assign and suggest you as a reviewer on new pull requests.

If you are approved, request that a current SIG Docs approver add you to the
[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
GitHub group. Only members of the `kubernetes-website-admins` GitHub group can
add new members to a GitHub group.

### Approver responsibilities

Approvers improve the documentation by reviewing and merging pull requests into the website repository. Because this role carries additional privileges, approvers have additional responsibilities:

- Approvers can use the `/approve` command, which merges PRs into the repo.

    A careless merge can break the site, so be sure that when you merge something, you mean it.

- Make sure that proposed changes meet the [contribution guidelines](/docs/contribute/style/content-guide/#contributing-content).

    If you ever have a question, or you're not sure about something, feel free to call for additional review.

- Verify that Netlify tests pass before you `/approve` a PR.

    <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="Netlify tests must pass before approving" />

- Visit the Netlify page preview for a PR to make sure things look good before approving.

- Participate in the [PR Wrangler rotation schedule](https://github.com/kubernetes/website/wiki/PR-Wranglers) for weekly rotations. SIG Docs expects all approvers to participate in this
rotation. See [Be the PR Wrangler for a week](/docs/contribute/advanced#be-the-pr-wrangler-for-a-week)
for more details.

## SIG Docs chairperson

Each SIG, including SIG Docs, selects one or more SIG members to act as
chairpersons. These are points of contact between SIG Docs and other parts of
the Kubernetes organization. They require extensive knowledge of the structure
of the Kubernetes project as a whole and how SIG Docs works within it. See
[Leadership](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
for the current list of chairpersons.

## SIG Docs teams and automation

Automation in SIG Docs relies on two different mechanisms for automation:
GitHub groups and OWNERS files.

### GitHub groups

The SIG Docs group defines two teams on GitHub:

 - [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
 - [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)

Each can be referenced with their `@name` in GitHub comments to communicate with
everyone in that group.

These teams overlap, but do not exactly match, the groups used by the automation
tooling. For assignment of issues, pull requests, and to support PR approvals,
the automation uses information from OWNERS files.

### OWNERS files and front-matter

The Kubernetes project uses an automation tool called prow for automation
related to GitHub issues and pull requests. The
[Kubernetes website repository](https://github.com/kubernetes/website) uses
two [prow plugins](https://github.com/kubernetes/test-infra/tree/master/prow/plugins):

- blunderbuss
- approve

These two plugins use the
[OWNERS](https://github.com/kubernetes/website/blob/master/OWNERS) and
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/master/OWNERS_ALIASES)
files in the top level of the `kubernetes/website` GitHub repository to control
how prow works within the repository.

An OWNERS file contains a list of people who are SIG Docs reviewers and
approvers. OWNERS files can also exist in subdirectories, and can override who
can act as a reviewer or approver of files in that subdirectory and its
descendents. For more information about OWNERS files in general, see
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).

In addition, an individual Markdown file can list reviewers and approvers in its
front-matter, either by listing individual GitHub usernames or GitHub groups.

The combination of OWNERS files and front-matter in Markdown files determines
the advice PR owners get from automated systems about who to ask for technical
and editorial review of their PR.

## How merging works

When a pull request is merged to the branch used to publish content (currently
`master`), that content is published and available to the world. To ensure that
the quality of our published content is high, we limit merging pull requests to
SIG Docs approvers. Here's how it works.

- When a pull request has both the `lgtm` and `approve` labels, has no `hold`
  labels, and all tests are passing, the pull request merges automatically.
- Kubernetes organization members and SIG Docs approvers can add comments to
  prevent automatic merging of a given pull request (by adding a `/hold` comment
  or withholding a `/lgtm` comment).
- Any Kubernetes member can add the `lgtm` label by adding a `/lgtm` comment.
- Only SIG Docs approvers can merge a pull request
  by adding an `/approve` comment. Some approvers also perform additional
  specific roles, such as [PR Wrangler](/docs/contribute/advanced#be-the-pr-wrangler-for-a-week) or
  [SIG Docs chairperson](#sig-docs-chairperson).

{{% /capture %}}

{{% capture whatsnext %}}

For more information about contributing to the Kubernetes documentation, see:

- [Contributing new content](/docs/contribute/overview/)
- [Reviewing content](/docs/contribute/review/reviewing-prs)
- [Documentation style guide](/docs/contribute/style/)

{{% /capture %}}
