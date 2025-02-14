---
title: Reviewing for approvers and reviewers
linktitle: For approvers and reviewers
slug: for-approvers
content_type: concept
weight: 20
---

<!-- overview -->

SIG Docs [Reviewers](/docs/contribute/participate/#reviewers) and
[Approvers](/docs/contribute/participate/#approvers) do a few extra things
when reviewing a change.

Every week a specific docs approver volunteers to triage and review pull requests.
This person is the "PR Wrangler" for the week. See the
[PR Wrangler scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers)
for more information. To become a PR Wrangler, attend the weekly SIG Docs meeting
and volunteer. Even if you are not on the schedule for the current week, you can
still review pull requests (PRs) that are not already under active review.

In addition to the rotation, a bot assigns reviewers and approvers
for the PR based on the owners for the affected files.

<!-- body -->

## Reviewing a PR

Kubernetes documentation follows the
[Kubernetes code review process](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process).

Everything described in [Reviewing a pull request](/docs/contribute/review/reviewing-prs)
applies, but Reviewers and Approvers should also do the following:

- Using the `/assign` Prow command to assign a specific reviewer to a PR as needed.
  This is extra important when it comes to requesting technical review from code contributors.

  {{< note >}}
  Look at the `reviewers` field in the front-matter at the top of a Markdown file to see who can
  provide technical review.
  {{< /note >}}

- Making sure the PR follows the [Content](/docs/contribute/style/content-guide/)
  and [Style](/docs/contribute/style/style-guide/) guides; link the author to the
  relevant part of the guide(s) if it doesn't.
- Using the GitHub **Request Changes** option when applicable to suggest changes to the PR author.
- Changing your review status in GitHub using the `/approve` or `/lgtm` Prow commands,
  if your suggestions are implemented.

## Commit into another person's PR

Leaving PR comments is helpful, but there might be times when you need to commit
into another person's PR instead.

Do not "take over" for another person unless they explicitly ask
you to, or you want to resurrect a long-abandoned PR. While it may be faster
in the short term, it deprives the person of the chance to contribute.

The process you use depends on whether you need to edit a file that is already
in the scope of the PR, or a file that the PR has not yet touched.

You can't commit into someone else's PR if either of the following things is
true:

- If the PR author pushed their branch directly to the
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  repository. Only a reviewer with push access can commit to another user's PR.

  {{< note >}}
  Encourage the author to push their branch to their fork before
  opening the PR next time.
  {{< /note >}}

- The PR author explicitly disallows edits from approvers.

## Prow commands for reviewing

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md) is
the Kubernetes-based CI/CD system that runs jobs against pull requests (PRs). Prow
enables chatbot-style commands to handle GitHub actions across the Kubernetes
organization, like [adding and removing labels](#adding-and-removing-issue-labels),
closing issues, and assigning an approver. Enter Prow commands as GitHub comments
using the `/<command-name>` format.

The most common prow commands reviewers and approvers use are:

{{< table caption="Prow commands for reviewing" >}}
Prow Command | Role Restrictions | Description
:------------|:------------------|:-----------
`/lgtm` | Organization members | Signals that you've finished reviewing a PR and are satisfied with the changes.
`/approve` | Approvers | Approves a PR for merging.
`/assign` | Anyone | Assigns a person to review or approve a PR
`/close` | Organization members | Closes an issue or PR.
`/hold` | Anyone | Adds the `do-not-merge/hold` label, indicating the PR cannot be automatically merged.
`/hold cancel` | Anyone | Removes the `do-not-merge/hold` label.
{{< /table >}}

To view the commands that you can use in a PR, see the
[Prow Command Reference](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite).

## Triage and categorize issues

In general, SIG Docs follows the
[Kubernetes issue triage](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md)
process and uses the same labels.

This GitHub Issue [filter](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
finds issues that might need triage.

### Triaging an issue

1. Validate the issue

   - Make sure the issue is about website documentation. Some issues can be closed quickly by
     answering a question or pointing the reporter to a resource. See the
     [Support requests or code bug reports](#support-requests-or-code-bug-reports) section for details.
   - Assess whether the issue has merit.
   - Add the `triage/needs-information` label if the issue doesn't have enough
     detail to be actionable or the template is not filled out adequately.
   - Close the issue if it has both the `lifecycle/stale` and `triage/needs-information` labels.

2. Add a priority label (the
   [Issue Triage Guidelines](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)
   define priority labels in detail)

  {{< table caption="Issue labels" >}}
  Label | Description
  :------------|:------------------
  `priority/critical-urgent` | Do this right now.
  `priority/important-soon` | Do this within 3 months.
  `priority/important-longterm` | Do this within 6 months.
  `priority/backlog` | Deferrable indefinitely. Do when resources are available.
  `priority/awaiting-more-evidence` | Placeholder for a potentially good issue so it doesn't get lost.
  `help` or `good first issue` | Suitable for someone with very little Kubernetes or SIG Docs experience. See [Help Wanted and Good First Issue Labels](https://kubernetes.dev/docs/guide/help-wanted/) for more information.

  {{< /table >}}

  At your discretion, take ownership of an issue and submit a PR for it
  (especially if it's quick or relates to work you're already doing).

If you have questions about triaging an issue, ask in `#sig-docs` on Slack or
the [kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

## Adding and removing issue labels

To add a label, leave a comment in one of the following formats:

- `/<label-to-add>` (for example, `/good-first-issue`)
- `/<label-category> <label-to-add>` (for example, `/triage needs-information` or `/language ja`)

To remove a label, leave a comment in one of the following formats:

- `/remove-<label-to-remove>` (for example, `/remove-help`)
- `/remove-<label-category> <label-to-remove>` (for example, `/remove-triage needs-information`)

In both cases, the label must already exist. If you try to add a label that does not exist, the command is
silently ignored.

For a list of all labels, see the [website repository's Labels section](https://github.com/kubernetes/website/labels).
Not all labels are used by SIG Docs.

### Issue lifecycle labels

Issues are generally opened and closed quickly.
However, sometimes an issue is inactive after its opened.
Other times, an issue may need to remain open for longer than 90 days.

{{< table caption="Issue lifecycle labels" >}}
Label | Description
:------------|:------------------
`lifecycle/stale` | After 90 days with no activity, an issue is automatically labeled as stale. The issue will be automatically closed if the lifecycle is not manually reverted using the `/remove-lifecycle stale` command.
`lifecycle/frozen` | An issue with this label will not become stale after 90 days of inactivity. A user manually adds this label to issues that need to remain open for much longer than 90 days, such as those with a `priority/important-longterm` label.
{{< /table >}}

## Handling special issue types

SIG Docs encounters the following types of issues often enough to document how
to handle them.

### Duplicate issues

If a single problem has one or more issues open for it, combine them into a single issue.
You should decide which issue to keep open (or
open a new issue), then move over all relevant information and link related issues.
Finally, label all other issues that describe the same problem with
`triage/duplicate` and close them. Only having a single issue to work on reduces confusion
and avoids duplicate work on the same problem.

### Dead link issues

If the dead link issue is in the API or `kubectl` documentation, assign them
`/priority critical-urgent` until the problem is fully understood. Assign all
other dead link issues `/priority important-longterm`, as they must be manually fixed.

### Blog issues

We expect [Kubernetes Blog](/blog/) entries to become
outdated over time. Therefore, we only maintain blog entries less than a year old.
If an issue is related to a blog entry that is more than one year old,
close the issue without fixing.

### Support requests or code bug reports

Some docs issues are actually issues with the underlying code, or requests for
assistance when something, for example a tutorial, doesn't work.
For issues unrelated to docs, close the issue with the `kind/support` label and a comment
directing the requester to support venues (Slack, Stack Overflow) and, if
relevant, the repository to file an issue for bugs with features (`kubernetes/kubernetes`
is a great place to start).

Sample response to a request for support:

```none
This issue sounds more like a request for support and less
like an issue specifically for docs. I encourage you to bring
your question to the `#kubernetes-users` channel in
[Kubernetes slack](https://slack.k8s.io/). You can also search
resources like
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
for answers to similar questions.

You can also open issues for Kubernetes functionality in
https://github.com/kubernetes/kubernetes.

If this is a documentation issue, please re-open this issue.
```

Sample code bug report response:

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

### Squashing

As an approver, when you review pull requests (PRs), there are various cases
where you might do the following:

- Advise the contributor to squash their commits.
- Squash the commits for the contributor.
- Advise the contributor not to squash yet.
- Prevent squashing.

**Advising contributors to squash**: A new contributor might not know that they
should squash commits in their pull requests (PRs). If this is the case, advise
them to do so, provide links to useful information, and offer to arrange help if
they need it. Some useful links:

- [Opening pull requests and squashing your commits](/docs/contribute/new-content/open-a-pr#squashing-commits)
  for documentation contributors.
- [GitHub Workflow](https://www.k8s.dev/docs/guide/github-workflow/), including diagrams, for developers.

**Squashing commits for contributors**: If a contributor might have difficulty
squashing commits or there is time pressure to merge a PR, you can perform the
squash for them:

- The kubernetes/website repo is
  [configured to allow squashing for pull request merges](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests).
  Simply select the *Squash commits* button.
- In the PR, if the contributor enables maintainers to manage the PR, you can
  squash their commits and update their fork with the result. Before you squash,
  advise them to save and push their latest changes to the PR. After you squash,
  advise them to pull the squashed commit to their local clone.
- You can get GitHub to squash the commits by using a label so that Tide / GitHub
  performs the squash or by clicking the *Squash commits* button when you merge the PR.

**Advise contributors to avoid squashing**

- If one commit does something broken or unwise, and the last commit reverts this
  error, don't squash the commits. Even though the "Files changed" tab in the PR
  on GitHub and the Netlify preview will both look OK, merging this PR might create
  rebase or merge conflicts for other folks. Intervene as you see fit to avoid that
  risk to other contributors.

**Never squash**

- If you're launching a localization or releasing the docs for a new version,
  you are merging in a branch that's not from a user's fork, _never squash the commits_.
  Not squashing is essential because you must maintain the commit history for those files.
