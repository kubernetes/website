---
title: PR wranglers
content_type: concept
weight: 20
---

<!-- overview -->

SIG Docs [approvers](/docs/contribute/participate/roles-and-responsibilities/#approvers)
take week-long shifts [managing pull requests](https://github.com/kubernetes/website/wiki/PR-Wranglers)
for the repository.

This section covers the duties of a PR wrangler. For more information on giving good reviews,
see [Reviewing changes](/docs/contribute/review/).

<!-- body -->

## Duties

Each day in a week-long shift as PR Wrangler:

- Review [open pull requests](https://github.com/kubernetes/website/pulls) for quality
  and adherence to the [Style](/docs/contribute/style/style-guide/) and
  [Content](/docs/contribute/style/content-guide/) guides.
    - Start with the smallest PRs (`size/XS`) first, and end with the largest (`size/XXL`). Review as many PRs as you can.
- Make sure PR contributors sign the [CLA](https://github.com/kubernetes/community/blob/master/CLA.md).
    - Use [this](https://github.com/zparnold/k8s-docs-pr-botherer) script to remind contributors
      that haven't signed the CLA to do so.
- Provide feedback on changes and ask for technical reviews from members of other SIGs.
    - Provide inline suggestions on the PR for the proposed content changes.
    - If you need to verify content, comment on the PR and request more details.
    - Assign relevant `sig/` label(s).
    - If needed, assign reviewers from the `reviewers:` block in the file's front matter.
    - You can also tag a [SIG](https://github.com/kubernetes/community/blob/master/sig-list.md)
      for a review by commenting `@kubernetes/<sig>-pr-reviews` on the PR.
- Use the `/approve` comment to approve a PR for merging. Merge the PR when ready.
    - PRs should have a `/lgtm` comment from another member before merging.
    - Consider accepting technically accurate content that doesn't meet the
      [style guidelines](/docs/contribute/style/style-guide/). As you approve the change,
      open a new issue to address the style concern. You can usually write these style fix
      issues as [good first issues](https://kubernetes.dev/docs/guide/help-wanted/#good-first-issue).
    - Using style fixups as good first issues is a good way to ensure a supply of easier tasks
      to help onboard new contributors.
- Also check for pull requests against the [reference docs generator](https://github.com/kubernetes-sigs/reference-docs) code, and review those (or bring in help).
- Support the [issue wrangler](/docs/contribute/participate/issue-wrangler/) to
  triage and tag incoming issues daily.
  See [Triage and categorize issues](/docs/contribute/review/for-approvers/#triage-and-categorize-issues)
  for guidelines on how SIG Docs uses metadata.

{{< note >}}
PR wrangler duties do not apply to localization PRs (non-English PRs). 
Localization teams have their own processes and teams for reviewing their language PRs. 
However, it's often helpful to ensure language PRs are labeled correctly, 
review small non-language dependent PRs (like a link update), 
or tag reviewers or contributors in long-running PRs (ones opened more than 6 months ago and have not been updated in a month or more).
{{< /note >}}


### Helpful GitHub queries for wranglers

The following queries are helpful when wrangling.
After working through these queries, the remaining list of PRs to review is usually small.
These queries exclude localization PRs. All queries are against the main branch except the last one.

- [No CLA, not eligible to merge](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3Alanguage%2Fen):
  Remind the contributor to sign the CLA. If both the bot and a human have reminded them, close
  the PR and remind them that they can open it after signing the CLA.
  **Do not review PRs whose authors have not signed the CLA!**
- [Needs LGTM](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+-label%3Algtm):
  Lists PRs that need an LGTM from a member. If the PR needs technical review,
  loop in one of the reviewers suggested by the bot. If the content needs work,
  add suggestions and feedback in-line.
- [Has LGTM, needs docs approval](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+label%3Algtm+):
  Lists PRs that need an `/approve` comment to merge.
- [Quick Wins](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amain+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3A%22cncf-cla%3A+yes%22+label%3A%22size%2FXS%22+label%3A%22language%2Fen%22):
  Lists PRs against the main branch with no clear blockers.
  (change "XS" in the size label as you work through the PRs [XS, S, M, L, XL, XXL]).
- [Not against the primary branch](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3Alanguage%2Fen+-base%3Amain):
  If the PR is against a `dev-` branch, it's for an upcoming release. Assign the
  [docs release manager](https://github.com/kubernetes/sig-release/tree/master/release-team#kubernetes-release-team-roles)
  using: `/assign @<manager's_github-username>`. If the PR is against an old branch,
  help the author figure out whether it's targeted against the best branch.

### Helpful Prow commands for wranglers

```
# add English label
/language en

# add squash label to PR if more than one commit
/label tide/merge-method-squash

# retitle a PR via Prow (such as a work-in-progress [WIP] or better detail of PR)
/retitle [WIP] <TITLE>
```

### When to close Pull Requests

Reviews and approvals are one tool to keep our PR queue short and current. Another tool is closure.

Close PRs where:
- The author hasn't signed the CLA for two weeks.

    Authors can reopen the PR after signing the CLA. This is a low-risk way to make
    sure nothing gets merged without a signed CLA.

- The author has not responded to comments or feedback in 2 or more weeks.

Don't be afraid to close pull requests. Contributors can easily reopen and resume works in progress.
Often a closure notice is what spurs an author to resume and finish their contribution.

To close a pull request, leave a `/close` comment on the PR.

{{< note >}}

The [`k8s-triage-robot`](https://github.com/k8s-triage-robot) bot marks issues
as stale after 90 days of inactivity. After 30 more days it marks issues as rotten
and closes them. PR wranglers should close issues after 14-30 days of inactivity.

{{< /note >}}

## PR Wrangler shadow program

In late 2021, SIG Docs introduced the PR Wrangler Shadow Program.
The program was introduced to help new contributors understand the PR wrangling process.

### Become a shadow

- If you are interested in shadowing as a PR wrangler, please visit the
  [PR Wranglers Wiki page](https://github.com/kubernetes/website/wiki/PR-Wranglers)
  to see the PR wrangling schedule for this year and sign up.

- Others can reach out on the [#sig-docs Slack channel](https://kubernetes.slack.com/messages/sig-docs)
  for requesting to shadow an assigned PR Wrangler for a specific week. Feel free to reach out to
  Brad Topol (`@bradtopol`) or one of the
  [SIG Docs co-chairs/leads](https://github.com/kubernetes/community/tree/master/sig-docs#leadership).

- Once you've signed up to shadow a PR Wrangler, introduce yourself to the PR Wrangler on the
  [Kubernetes Slack](https://slack.k8s.io).
