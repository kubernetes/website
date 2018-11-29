---
title: Participating in SIG-DOCS
---

{% capture overview %}

SIG-DOCS is one of the [special interest groups](https://github.com/kubernetes/community/blob/master/sig-list.md) within the Kubernetes project, focused on writing, updating, and maintaining the documentation for Kubernetes as a whole.

{% endcapture %}

{% capture body %}

SIG Docs welcomes content and reviews from all contributors. Anyone can open a pull request (PR), and anyone is welcome to comment on content or pull requests in progress.

Within the Kubernetes project, you may also become a member, reviewer, or approver.
These roles confer additional privileges and responsibilities when it comes to approving and committing changes.
See [community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md) for more information on how membership works within the Kubernetes community.

## Roles and Responsibilities

The automation reads `/hold`, `/lgtm`, and `/approve` comments and sets labels on the pull request.
When a pull request has the `lgtm` and `approve` labels without any `hold` labels, the pull request merges automatically.
Kubernetes org members, and reviewers and approvers for SIG Docs can add comments to control the merge automation.

- Members

Any member of the [Kubernetes organization](https://github.com/kubernetes) can review a pull request, and SIG Docs team members frequently request reviews from members of other SIGs for technical accuracy.
SIG Docs also welcomes reviews and feedback regardless of Kubernetes org membership.
You can indicate your approval by adding a comment of `/lgtm` to a pull request.

- Reviewers

Reviewers are individuals who review documentation pull requests. 

Automation assigns reviewers to pull requests, and contributors can request a review with a comment on the pull request: `/assign [@_github_handle]`.
To indicate that a pull request requires no further changes, a reviewer should add comment to the pull request `/lgtm`.
A reviewer indicates technical accuracy with a `/lgtm` comment.

Reviewers can add a `/hold` comment to prevent the pull request from being merged.
Another reviewer or approver can remove a hold with the comment: `/hold cancel`.

When a reviewer is assigned a pull request to review it is not a sole responsibility, and any other reviewer may also offer their opinions on the pull request.
If a reviewer is requested, it is generally expected that the PR will be left to that reviewer to do their editorial pass on the content.
If a PR author or SIG Docs maintainer requests a review, refrain from merging or closing the PR until the requested reviewer completes their review.

- Approvers

Approvers have the ability to merge a PR.

Approvers can indicate their approval with a comment to the pull request: `/approve`.
An approver is indicating editorial approval with the an `/approve` comment.

Approvers can add a `/hold` comment to prevent the pull request from being merged.
Another reviewer or approver can remove a hold with the comment: `/hold cancel`.

Approvers may skip further reviews for small pull requests if the proposed changes appear trivial and/or well-understood.
An approver can indicate `/lgtm` or `/approve` in a PR comment to have a pull request merged, and all pull requests require at least one approver to provide their vote in order for the PR to be merged.

**Note:** There is a special case when an approver uses the comment: `/lgtm`. In these cases, the automation will add both `lgtm` and `approve` tags, skipping any further review.
+{: .note }

For PRs that require no review (typos or otherwise trivial changes), approvers can enter an `lgtm` comment, indicating no need for further review and flagging the PR with approval to merge.

### Teams and groups within SIG Docs

You can get an overview of [SIG Docs from the community github repo](https://github.com/kubernetes/community/tree/master/sig-docs). 
The SIG Docs group defines two teams on Github:
 - [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
 - [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)

These groups maintain the [Kubernetes website repository](https://github.com/kubernetes/website), which houses the content hosted at this site.
Both can be referenced with their `@name` in github comments to communicate with everyone in that group.

These teams overlap, but do not exactly match, the groups used by the automation tooling.
For assignment of issues, pull requests, and to support PR approvals, the automation uses information from the OWNERS file.

To volunteer as a reviewer or approver, make a pull request and add your Github handle to the relevant section in the [OWNERS file](https://github.com/kubernetes/community/blob/master/contributors/devel/owners.md).

**Note:** Reviewers and approvers must meet requirements for participation.
For more information, see the [Kubernetes community](https://github.com/kubernetes/community/blob/master/community-membership.md#membership) repository.
{: .note }

Documentation for the [OWNERS](https://github.com/kubernetes/community/blob/master/contributors/devel/owners.md) explains how to maintain OWNERS for each repository that enables it.

The [Kubernetes website repository](https://github.com/kubernetes/website) has two automation (prow) [plugins enabled](https://github.com/kubernetes/test-infra/blob/master/prow/plugins.yaml#L210):
- blunderbuss
- approve

These two plugins use the [OWNERS](https://github.com/kubernetes/website/blob/master/OWNERS) and [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/master/OWNERS_ALIASES) files in our repo for configuration.

{% endcapture %}

{% capture whatsnext %}
For more information about contributing to the Kubernetes documentation, see:

* Review the SIG Docs [Style Guide](/docs/home/contribute/style-guide/).
* Learn how to [stage your documentation changes](/docs/home/contribute/stage-documentation-changes/).
* Learn about [writing a new topic](/docs/home/contribute/write-new-topic/).
* Learn about [using page templates](/docs/home/contribute/page-templates/).
* Learn about [staging your changes](/docs/home/contribute/stage-documentation-changes/).
* Learn about [creating a pull request](/docs/home/contribute/create-pull-request/).
* How to generate documentation:
  * Learn how to [generate Reference Documentation for Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)
  * Learn how to [generate Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/)
  * Learn how to [generate Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
  * Learn how to [generate Reference Pages for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
{% endcapture %}

{% include templates/concept.md %}
