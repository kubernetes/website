---
title: Participating in SIG-DOCS
---

{% capture overview %}

SIG-DOCS is one of the [special interest groups](https://github.com/kubernetes/community/blob/master/sig-list.md) within the Kubernetes project, focused on writing, updating, and maintaining the documentation for the project as a whole.

{% endcapture %}

{% capture body %}

Everyone is encouraged to provide content and reviews to support the Kubernetes project documentation. Anyone may open a pull request, and anyone is welcome to provide their opinions and feedback on those pull requests.

Within the Kubernetes project, you may also become a member, reviewer, or approver. These levels confer additional privileges when it comes to approving and committing changes. You may also want to read [community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md) for more details on how membership works within the Kubernetes community.

## Roles and Responsibilities

- Members

Anyone who is a member of the Kubernetes organization can provide a review for a pull request. The SIG-DOCS team will frequently request a review for technical accuracy, and if you are a member, then you can indicate your approval by adding a comment of `/lgtm` to a pull request.

- Reviewers

Reviewers are individuals who have volunteered to provide their time to review documentation pull requests. You become a reviewer by adding your github handle to the [OWNERS file](https://github.com/kubernetes/community/blob/master/contributors/devel/owners.md) within the [website repo](https://github.com/kubernetes/website).

Our automation will reviewers to use for reviews on pull requests, and a contributor may request your review with an `/assign [your_github_handle]` comment in the pull request. To indicate your approval of a pull request, a reviewer should add an `/approve` comment to the pull request. A reviewer may also use add a `/hold` comment on the pull request to prevent the pull request from being merged. Another reviewer or approver may also remove that hold with the comment `/hold cancel`.

When a reviewer is assigned a pull request to review it is not a sole responsibility, and any other reviewer may also offer their opinions on the pull request. If a reviewer is requested, it is generally expected that the PR will be left to that reviewer to do their editorial pass on the content. For small and/or trivial pull requests, the assigned reviewer may be skipped if an approver thinks the content is sufficient and well understood. 

- Approvers

Approvers are the individuals with final approval over a PR for merging. An approver can indicate `/lgtm` or `/approve` to have a pull request merged, and all pull requests require at least one approver to provide their vote for the PR to be merged. In general, this is done with an `/approve` comment, expecting an `/lgtm` to come from another reviewer. 

A special case is where a pull request is a quick fix, typo, etc - in those cases, an approver may enter `lgtm`, which is regarded as a combination of both and accepted without further review.

### Teams and groups within SIG-DOCS

You can get an overview of [SIG-DOCS from the community github repo](https://github.com/kubernetes/community/tree/master/sig-docs). The SIG-DOCS group has two teams defined on github:
 - [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
 - [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)

These groups are used for access to the [website repository](https://github.com/kubernetes/website), which houses the content that hosted at this site. Both can be referenced with their `@name` in github comments to communicate with everyone in that group.

These groups overlap, but aren't identical, to the automation tooling that Kubernetes uses as a project. For assignment of issues, pul requests, and to support PR approvals, the automation uses an OWNERS file for the repository. The approvers and reviewers for PR assignment and automation tooling work from the OWNERS file. 

If you wish to volunteer to be a reviewer or an approver, make a pull request and add your github handle to the relevant section in the OWNERS file.

[Documentation on the OWNERS](https://github.com/kubernetes/community/blob/master/contributors/devel/owners.md) file is available, and explains the groupings, intentions, and how to maintain this file for each repository that has it enabled.

The [website repo](https://github.com/kubernetes/website) has two automation (prow) [plugins enabled](https://github.com/kubernetes/test-infra/blob/master/prow/plugins.yaml#L210):
- blunderbuss
- approve

These two plugins use the [OWNERS](https://github.com/kubernetes/website/blob/master/OWNERS) and [OWNERS_ALIAS](https://github.com/kubernetes/website/blob/master/OWNERS_ALIAS) files in our repo for configuration.

{% endcapture %}

{% capture whatsnext %}
For more information about contributing to the Kubernetes documentation, see:

* Review the SIG-DOCS [Style Guide](/docs/home/contribute/style-guide/).
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
