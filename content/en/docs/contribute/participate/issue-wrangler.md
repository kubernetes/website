---
title: Issue Wranglers
content_type: concept
weight: 20
---

<!-- overview -->

In order to reduce the burden on the [PR Wrangler](/docs/contribute/participate/pr-wrangler), formal approvers, and reviewers, members of SIG Docs take week long shifts [triaging and categorising issues](/docs/contribute/review/for-approvers.md/#triage-and-categorize-issues) for the repository.

<!-- body -->

## Duties

Each day in a week-long shift as Issue Wrangler:

- Triage and tag incoming issues daily. See [Triage and categorize issues](https://github.com/kubernetes/website/blob/main/docs/contribute/review/for-approvers/#triage-and-categorize-issues) for guidelines on how SIG Docs uses metadata.
- Identifying whether the issue falls under the support category and assigning a "triage/accepted" status.
- Assuring the issue is tagged with the appropriate sig/area/kind labels.
- Keeping an eye on stale & rotten issues within the kubernetes/website repository.
- [Issues board](https://github.com/orgs/kubernetes/projects/72/views/1) maintenance would be nice

### Requirements

- Must be an active member of the Kubernetes organization.
- A minimum of 15 quality contributions to Kubernetes (of which a certain amount should be directed towards kubernetes/website).
- Performing the role in an informal capacity already

### Helpful Prow commands for wranglers

```
# reopen an issue
/reopen

# transfer issues that don't fit in k/website to another repository
/transfer[-issue]

# change the state of rotten issues
/remove-lifecycle rotten
```

### When to close Issues

For an open source project to succeed, good issue management is crucial. But it is also critical to resolve issues in order to maintain the repository and communicate clearly with contributors and users.

Close issues when:

- A similar issue has been reported more than once. It is also advisable to direct the users to the original issue.
- It is very difficult to understand and address the issue presented by the author with the information provided.
  However, encourage the user to provide more details or reopen the issue if they can reproduce it later.
- Having implemented the same functionality elsewhere. One can close this issue and direct user to the appropriate place.
- Feature requests that are not currently planned or aligned with the project's goals.
- If the assignee has not responded to comments or feedback in more than two weeks
  The issue can be assigned to someone who is highly motivated to contribute.
- In cases where an issue appears to be spam and is clearly unrelated.
- If the issue is related to an external limitation or dependency and is beyond the control of the project.

To close an issue, leave a `/close` comment on the issue.
