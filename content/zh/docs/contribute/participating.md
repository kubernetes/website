---
title: 参与 SIG Docs
content_template: templates/concept
card:
  name: contribute
  weight: 40
---

{{% capture overview %}}

<!--
SIG Docs is one of the
[special interest groups](https://github.com/kubernetes/community/blob/master/sig-list.md)
within the Kubernetes project, focused on writing, updating, and maintaining
the documentation for Kubernetes as a whole. See
[SIG Docs from the community github repo](https://github.com/kubernetes/community/tree/master/sig-docs)
for more information about the SIG.
-->
SIG Docs 是 Kubernetes 项目中的一个 [special interest groups](https://github.com/kubernetes/community/blob/master/sig-list.md)，
总的来说，它负责编写、更新和维护 Kubernetes 文档。

<!--
SIG Docs welcomes content and reviews from all contributors. Anyone can open a
pull request (PR), and anyone is welcome to file issues about content or comment
on pull requests in progress.
-->
SIG Docs 欢迎所有贡献者提供内容和检视。任何人可以提交拉取请求（PR），
欢迎对文档内容提交 issue 和 对正在进行中的 PR 进行评论。

<!--
Within SIG Docs, you may also become a [member](#members),
[reviewer](#reviewers), or [approver](#approvers). These roles require greater
access and entail certain responsibilities for approving and committing changes.
See [community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md)
for more information on how membership works within the Kubernetes community.
The rest of this document outlines some unique ways these roles function within
SIG Docs, which is responsible for maintaining one of the most public-facing
aspects of Kubernetes -- the Kubernetes website and documentation.
-->
在 SIG Docs，你可以成为 [member](#members)、[reviewer](#reviewers) 或者 [approver](#approvers)。
这些角色拥有更高的权限，并且需要承担批准和提交更改的责任。
有关 Kubernetes 社区中的成员如何工作的更多信息，请参见 [community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md)。
本文档的其余部分概述了这些角色在 SIG Docs 中发挥作用的一些独特方式，
SIG Docs 负责维护 Kubernetes 最面向公众的方面之一 —— Kubernetes 网站和文档。
{{% /capture %}}

{{% capture body %}}

<!--
## Roles and responsibilities
-->
## 角色和责任

<!--
When a pull request is merged to the branch used to publish content (currently
`master`), that content is published and available to the world. To ensure that
the quality of our published content is high, we limit merging pull requests to
SIG Docs approvers. Here's how it works.
-->

当一个 pull 请求被合并到用于发布内容的分支(当前为“master”)，该内容将发布并向全世界开放。
为了确保发布内容的质量较高，每个 pull 请求需要 SIG Docs 的 approver 审批。
它是这样工作的。

<!--
- When a pull request has both the `lgtm` and `approve` labels and has no `hold`
  labels, the pull request merges automatically. 
- Kubernetes organization members and SIG Docs approvers can add comments to
  prevent automatic merging of a given pull request (by adding a `/hold` comment
  or withholding a `/lgtm` comment).
- Any Kubernetes member can add the `lgtm` label, by adding a `/lgtm` comment.
- Only an approver who is a member of SIG Docs can cause a pull request to merge
  by adding an `/approve` comment. Some approvers also perform additional
  specific roles, such as [PR Wrangler](#pr-wrangler) or
  [SIG Docs chairperson](#sig-docs-chairperson).
-->
- 当某个 pull request 拥有 `lgtm` 和 `approve` 标签， 并且没有 `hold` 标签时，这个 pull request 会自动合入。
- Kubernetes 组织成员 和 SIG Docs 的 approvers 可以通过评论的方式阻止某个 pull request 自动合入（评论中包含 `/hold` 或 取消 `/lgtm` 的内容）。
- 任何 Kubernetes 成员都可以通过在评论回复 `/lgtm` 来增加 `/lgtm` 标签。
- 只有 SIG Docs 的 approver 可以在评论中回复 `/approve` 并触发合并。 
  某些 approver 还兼具其他角色，比如 [PR Wrangler](#pr-wrangler) 或 [SIG Docs chairperson](#sig-docs-chairperson)。

<!--
For more information about expectations and differences between the roles of
Kubernetes organization member and SIG Docs approvers, see
[Types of contributor](/docs/contribute#types-of-contributor). The following
sections cover more details about these roles and how they work within
SIG Docs.
-->
关于 Kubernetes 组织成员和 SIG Docs approver 的区别，请参考 [Types of contributor](/docs/contribute#types-of-contributor)。
以下部分将详细介绍这些角色及其内部的工作方式。

### Anyone

<!--
Anyone can file an issue against any part of Kubernetes, including documentation.
-->
任何人可以针对 Kubernetes 的任何内容（包括文档）提交 issue。

<!--
Anyone who has signed the CLA can submit a pull request. If you cannot sign the
CLA, the Kubernetes project cannot accept your contribution.
-->
任何人想到提交 pull request，必须要签署 CLA。 否则 Kubernetes 项目则不能接受你的贡献。

### Members

<!--
Any member of the [Kubernetes organization](https://github.com/kubernetes) can
review a pull request, and SIG Docs team members frequently request reviews from
members of other SIGs for technical accuracy.
SIG Docs also welcomes reviews and feedback regardless of a person's membership
status in the Kubernetes organization. You can indicate your approval by adding
a comment of `/lgtm` to a pull request. If you are not a member of the
Kubernetes organization, your `/lgtm` has no effect on automated systems.
-->
任何 [Kubernetes 组织成员](https://github.com/kubernetes) 都可以检视 pull request。
SIG Docs 组成员经常需要检视来自其他 SIG 的 pull request，以确保技术上的准确性。

<!--
Any member of the Kubernetes organization can add a `/hold` comment to prevent
the pull request from being merged. Any member can also remove a `/hold` comment
to cause a PR to be merged if it already has both `/lgtm` and `/approve` applied
by appropriate people.
-->
作何 Kubernetes 组织成员都可以在评论中增加 `/hold` 标签来阻止 PR 被合入。
任何 Kubernetes 组织成员都可以移除 `/hold` 标签来让PR 合入（必须此前已有 `/lgtm` 和 `/approve` 标签）。

<!--
#### Becoming a member
-->
#### 成为一个 member

<!--
After you have successfully submitted at least 5 substantive pull requests, you
can request [membership](https://github.com/kubernetes/community/blob/master/community-membership.md#member)
in the Kubernetes organization. Follow these steps:
-->
在你成功的提交至少 5 个PR后，你就可以向 Kubernetes 组织提交申请 [membership](https://github.com/kubernetes/community/blob/master/community-membership.md#member)。
按照如下流程：

<!--
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
-->
1. 找到两个 reviewer 或 approver 为你提名。

     通过 [#sig-docs channel on the Kubernetes Slack instance](https://kubernetes.slack.com) 或者
    [SIG Docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
   来寻找为你提名的人。
    {{< note >}}
    不要单独发送邮件给某个人或在 Slack 中私聊。
    {{< /note >}}

2. 在 `kubernetes/org` 仓库中提交一个 issue 发起请求。
   按照[指导模板](https://github.com/kubernetes/community/blob/master/community-membership.md)填写请求。

3. 告知你的提名人，可以通过在 issue 中 `@<GitHub-username>` 或者直接发送给他们 issue 链接，
   这样他们可以过来投票（`+1`）。
   
4. 当请求被批准后，github 管理员团队成员会告诉你批准加入并且关闭 issue："Congratulations, you are now a member!"。
   
<!--
If for some reason your membership request is not accepted right away, the
membership committee provides information or steps to take before applying
again.
-->
如果因为某些原因你的申请没有被批准，会员委员会成员会告诉你原因并指导你如何继续申请。

### Reviewers

<!--
Reviewers are members of the
[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)
GitHub group. See [Teams and groups within SIG Docs](#teams-and-groups-within-sig-docs).
-->
Reviewers 是 [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews) 成员。

<!--
Reviewers review documentation pull requests and provide feedback on proposed
changes.
-->
Reviewers 负责检视文档的 PR 并提供反馈。

<!--
Automation assigns reviewers to pull requests, and contributors can request a
review from a specific reviewer with a comment on the pull request: `/assign
[@_github_handle]`. To indicate that a pull request is technically accurate and
requires no further changes, a reviewer adds a `/lgtm` comment to the pull
request.
-->
每个 PR 都会自动分配 reviewer，任何贡献者都可以在评论中回复 `/assign [@_github_handle]`
 来请求某个 reviewer 来检视。
如果 reviewer 觉得没有问题且不需要进一步更改时，reviewer 会在评论中回复 `/lgtm` 。

<!--
If the assigned reviewer has not yet reviewed the content, another reviewer can
step in. In addition, you can assign technical reviewers and wait for them to
provide `/lgtm`.
-->
如果自动分配的 reviewer 未能及时检视，其他的 reviewer 也会参与。
此外，你可以指定某个 reviewer 或者等他们回复 `/lgtm`。

<!--
For a trivial change or one that needs no technical review, the SIG Docs
[approver](#approvers) can provide the `/lgtm` as well.
-->
对于不重要的更改或者非技术性的检视，SIG Docs 的 [approver](#approvers) 也可以提供 `/lgtm` 标签。

<!--
A `/approve` comment from a reviewer is ignored by automation.
-->
如果一个 reviewer 在评论中回复 `/approve` 会被自动忽略。

<!--
For more about how to become a SIG Docs reviewer and the responsibilities and
time commitment involved, see
[Becoming a reviewer or approver](#becoming-an-approver-or-reviewer).
-->
关于如何成为 SIG Docs reviewer 以及其责任、时间承诺等更多内容，请参照
[Becoming a reviewer or approver](#becoming-an-approver-or-reviewer)。

<!--
#### Becoming a reviewer
-->
#### 成为 reviewer

<!--
When you meet the
[requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer),
you can become a SIG Docs reviewer. Reviewers in other SIGs must apply
separately for reviewer status in SIG Docs.
-->
当你满足[需求](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer)时，
你就可以成为 SIG Docs 的 reviewer。
其他 SIG 的 reviewer 也需要单独向 SIG Docs 申请。

<!--
To apply, open a pull request to add yourself to the `reviewers` section of the
[top-level OWNERS file](https://github.com/kubernetes/website/blob/master/OWNERS)
in the `kubernetes/website` repository. Assign the PR to one or more current SIG
Docs approvers.
-->
通过提交一个 PR 并把自己加到位于 `kubernetes/website` 仓库顶层的 [top-level OWNERS file](https://github.com/kubernetes/website/blob/master/OWNERS) 文件中的 `reviewers` 部分，指定一个或多个当前 SIG Docs 的 approver。

<!--
If your pull request is approved, you are now a SIG Docs reviewer.
[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
will assign and suggest you as a reviewer on new pull requests.
-->
如果你的 PR 被批准，你就成为了 SIG Docs reviewer 了。
[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home) 会在接下来的 PR 中请求你检视。

<!--
If you are approved, request that a current SIG Docs approver add you to the
[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)
GitHub group. Only members of the `kubernetes-website-admins` GitHub group can
add new members to a GitHub group.
-->
如果您的 PR 被批准，你就会加入 [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews) 组。只有 `kubernetes-website-admins` 组的成员才可以加入新成员。

### Approvers

<!--
Approvers are members of the
[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
GitHub group. See [Teams and groups within SIG Docs](#teams-and-groups-within-sig-docs).
-->
approver 是 GitHub [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers) 组织成员。
参考 [Teams and groups within SIG Docs](#teams-and-groups-within-sig-docs)。

<!--
Approvers have the ability to merge a PR, and thus, to publish content on the
Kubernetes website. To approve a PR, an approver leaves an `/approve` comment on
the PR. If someone who is not an approver leaves the approval comment,
automation ignores it.
-->
approver 有权限合入 PR，这意味着他们可以发布内容到 Kubernetes 网站。
如果一个 approver 留下 `/approve` 评论，则代表他批准了 PR。
如果非 approver 成员尝试批准，则会被自动忽略。

<!--
If the PR already has a `/lgtm`, or if the approver also comments with `/lgtm`,
the PR merges automatically. A SIG Docs approver should only leave a `/lgtm` on
a change that doesn't need additional technical review.
-->
如果某个 PR 已有 `/lgtm` 标签，approver 再回复一个 `/lgtm` ，则这个 PR 会自动合入。
SIG Docs approver 应该只在不需要额外的技术检视的情况下才可以标记 `/lgtm`。

<!--
For more about how to become a SIG Docs approver and the responsibilities and
time commitment involved, see
[Becoming a reviewer or approver](#becoming-an-approver-or-reviewer).
-->
关于如何成为 SIG Docs 的 approver 及其责任和时间承诺等信息，请参考 [Becoming a reviewer or approver](#becoming-an-approver-or-reviewer)。

<!-- 
#### Becoming an approver
-->
#### 成为 approver

<!--
When you meet the
[requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#approver),
you can become a SIG Docs approver. Approvers in other SIGs must apply
separately for approver status in SIG Docs.
-->
当满足[要求](https://github.com/kubernetes/community/blob/master/community-membership.md#approver) 时，你可以成为 SIG Docs 的 approver。其他的 SIG 的 approver 要想成为 SIG Docs 的 approver 需要单独申请。

<!--
To apply, open a pull request to add yourself to the `approvers` section of the
[top-level OWNERS file](https://github.com/kubernetes/website/blob/master/OWNERS)
in the `kubernetes/website` repository. Assign the PR to one or more current SIG
Docs approvers.
-->
通过提交一个 PR 并把自己加到位于 `kubernetes/website` 仓库顶层的 [top-level OWNERS file](https://github.com/kubernetes/website/blob/master/OWNERS) 文件中的 `approvers` 部分，指定一个或多个当前 SIG Docs 的 approver。

<!--
If your pull request is approved, you are now a SIG Docs approver.
[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
will assign and suggest you as a reviewer on new pull requests.
-->
一旦你的 PR 被批准，你就是一个 SIG Docs 的 approver 了。

<!--
If you are approved, request that a current SIG Docs approver add you to the
[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
GitHub group. Only members of the `kubernetes-website-admins` GitHub group can
add new members to a GitHub group.
-->
如果您的 PR 被批准，你就会加入[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers) 组。只有 `kubernetes-website-admins` 组的成员才可以加入新成员。

<!-- 
#### Approver responsibilities
-->
#### Approver 职责

<!-- 
Approvers improve the documentation by reviewing and merging pull requests into the website repository. Because this role carries additional privileges, approvers have additional responsibilities: 
-->
Approvers 通过查看拉取请求（pr）并将其合并到网站仓库中来完善文档。因为此角色具有其他特权，所以 approvers 还具有其他职责：

<!-- 
- Approvers can use the `/approve` command, which merges PRs into the repo.

    A careless merge can break the site, so be sure that when you merge something, you mean it.
    
- Make sure that proposed changes meet the contribution guidelines. 

    If you ever have a question, or you're not sure about something, feel free to call for additional review.

- Verify that netlify tests pass before you `/approve` a PR.

    <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="Netlify tests must pass before approving" />

- Visit the netlify page preview for a PR to make sure things look good before approving. 
-->
- Approvers 可以使用 `/approve` 命令将 PR 合并到仓库中。
    
    粗心的合并会破坏站点，因此请确保在合并某些内容时，您是清楚的。

- 确保建议的更改符合贡献准则。
  
    如果您有任何疑问，或者不确定某个问题，请随时联系他人进行审核。

- 在 `/approve` PR 之前，请验证 netlify 测试是否通过。

     <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="批准之前必须确保 Netlify 测试通过" />

- 请访问 netlify 页面预览 PR，确保批准前一切正常。

<!--
#### PR Wrangler
-->
#### PR 协调者

<!--
SIG Docs approvers participate in the
[PR Wrangler rotation scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers)
for weekly rotations. SIG Docs expects all approvers to participate in this
rotation. See
[Be the PR Wrangler for a week](/docs/contribute/advanced#be-the-pr-wrangler-for-a-week)
for more details.
-->
每个 SIG Docs approver 都会参与 [PR Wrangler rotation scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers)。
所有 SIG Docs approver 都会参与轮值。
更多信息，请参考[做一周的PR协调者](/docs/contribute/advanced#be-the-pr-wrangler-for-a-week)。

<!--
#### SIG Docs chairperson
-->
#### SIG Docs 主席

<!--
Each SIG, including SIG Docs, selects one or more SIG members to act as
chairpersons. These are points of contact between SIG Docs and other parts of
the Kubernetes organization. They require extensive knowledge of the structure
of the Kubernetes project as a whole and how SIG Docs works within it. See
[Leadership](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
for the current list of chairpersons.
-->
每个 SIG，包括 SIG Docs，都会选出 1 位或多位成员作为主席。
主席会成为 SIG Docs 和其他 Kubernetes 组织的联络接口人。
他们需要了解整个 Kubernetes 项目，并明白 SIG Docs 如何运作。
如需查询当前的主席，请查阅 [Leadership](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)。

<!--
## SIG Docs teams and automation
-->
## SIG Docs 团队和自动化

<!--
Automation in SIG Docs relies on two different mechanisms for automation:
GitHub groups and OWNERS files.
-->
SIG 文档中的自动化依赖于两种不同的自动化机制:
GitHub 组和 OWNERS 文件。

### GitHub groups

<!--
The SIG Docs group defines two teams on GitHub:
-->
SIG Docs 组定义了两个 GitHub 组：

 - [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
 - [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)

<!--
Each can be referenced with their `@name` in GitHub comments to communicate with
everyone in that group.
-->
可以在 GitHub 的评论中 `@name` 他们来与他们沟通。

<!--
These teams overlap, but do not exactly match, the groups used by the automation
tooling. For assignment of issues, pull requests, and to support PR approvals,
the automation uses information from OWNERS files.
-->
这些团队与自动化工具使用的组有所重叠，但并不完全匹配。
对于分配 issue、拉请求和批准 PR，自动化使用来自 OWNERS 文件的信息。

<!--
### OWNERS files and front-matter
-->
### OWNERS 文件和扉页

<!--
The Kubernetes project uses an automation tool called prow for automation
related to GitHub issues and pull requests. The
[Kubernetes website repository](https://github.com/kubernetes/website) uses
two [prow plugins](https://github.com/kubernetes/test-infra/blob/master/prow/plugins.yaml#L210):
-->
Kubernetes 项目使用名为 prow 的自动化工具来处理 GitHub issue 和 PR。
[Kubernetes website repository](https://github.com/kubernetes/website) 使用了两个
[prow 插件](https://github.com/kubernetes/test-infra/blob/master/prow/plugins.yaml#L210)：

- blunderbuss
- approve

<!--
These two plugins use the
[OWNERS](https://github.com/kubernetes/website/blob/master/OWNERS) and
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/master/OWNERS_ALIASES)
files in the top level of the `kubernetes/website` GitHub repository to control
how prow works within the repository.
-->
这两个插件使用位于 `kubernetes/website` 仓库顶层的
[OWNERS](https://github.com/kubernetes/website/blob/master/OWNERS) 和
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/master/OWNERS_ALIASES) 来控制工作流程。 

<!--
An OWNERS file contains a list of people who are SIG Docs reviewers and
approvers. OWNERS files can also exist in subdirectories, and can override who
can act as a reviewer or approver of files in that subdirectory and its
descendents. For more information about OWNERS files in general, see
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).
-->
OWNERS 文件包含 SIG Docs reviewer 和 approver 的列表。 
OWNERS 文件也可以存在于子目录中中，可以重写 reviewer 和 approver，并且它自动继承上级。
关于 OWNERS 的更多信息，请参考 [OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md)。

<!--
In addition, an individual Markdown file can list reviewers and approvers in its
front-matter, either by listing individual GitHub usernames or GitHub groups.
-->
此外，一个单独的 Markdown 格式的文件将会列出 reviewer 和 approver（扉页），或者列出
其 GitHub 用户名 或者列出其组名。

<!--
The combination of OWNERS files and front-matter in Markdown files determines
the advice PR owners get from automated systems about who to ask for technical
and editorial review of their PR.
-->
结合 OWNERS 文件及扉页可以给 PR 作者提供向谁请求检视的建议。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
For more information about contributing to the Kubernetes documentation, see:
-->
关于贡献 Kubernetes 的更多文档，请参考：

- [Start contributing](/docs/contribute/start/)
- [Documentation style](/docs/contribute/style/)

{{% /capture %}}


