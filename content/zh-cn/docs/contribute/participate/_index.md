---
title: 参与 SIG Docs
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---
<!--
title: Participating in SIG Docs
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
-->

<!-- overview -->

<!--
SIG Docs is one of the
[special interest groups](https://github.com/kubernetes/community/blob/master/sig-list.md)
within the Kubernetes project, focused on writing, updating, and maintaining
the documentation for Kubernetes as a whole. See
[SIG Docs from the community github repo](https://github.com/kubernetes/community/tree/master/sig-docs)
for more information about the SIG.
-->
SIG Docs 是 Kubernetes 项目
[特别兴趣小组](https://github.com/kubernetes/community/blob/master/sig-list.md)
中的一个，负责编写、更新和维护 Kubernetes 的总体文档。
参见[社区 GitHub 仓库中 SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs)
以进一步了解该 SIG。

<!--
SIG Docs welcomes content and reviews from all contributors. Anyone can open a
pull request (PR), and anyone is welcome to file issues about content or comment
on pull requests in progress.
-->
SIG Docs 欢迎所有贡献者提供内容和审阅。任何人可以提交拉取请求（PR）。
欢迎所有人对文档内容创建 Issue 和对正在处理中的 PR 进行评论。

<!--
You can also become a [member](/docs/contribute/participate/roles-and-responsibilities/#members),
[reviewer](/docs/contribute/participate/roles-and-responsibilities/#reviewers), or [approver](/docs/contribute/participate/roles-and-responsibilities/#approvers). These roles require greater
access and entail certain responsibilities for approving and committing changes.
See [community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md)
for more information on how membership works within the Kubernetes community.

The rest of this document outlines some unique ways these roles function within
SIG Docs, which is responsible for maintaining one of the most public-facing
aspects of Kubernetes - the Kubernetes website and documentation.
-->
你也可以成为[成员（member）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#members)、
[评阅人（reviewer）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#reviewers) 或者
[批准人（approver）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#approvers)。
这些角色拥有更高的权限，且需要承担批准和提交变更的责任。
有关 Kubernetes 社区中的成员如何工作的更多信息，请参见
[社区成员身份](https://github.com/kubernetes/community/blob/master/community-membership.md)。

本文档的其余部分概述了这些角色在 SIG Docs 中发挥作用的一些独特方式。
SIG Docs 负责维护 Kubernetes 最面向公众的方面之一 —— Kubernetes 网站和文档。

<!-- body -->

<!--
#### SIG Docs chairperson

Each SIG, including SIG Docs, selects one or more SIG members to act as
chairpersons. These are points of contact between SIG Docs and other parts of
the Kubernetes organization. They require extensive knowledge of the structure
of the Kubernetes project as a whole and how SIG Docs works within it. See
[Leadership](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
for the current list of chairpersons.
-->
## SIG Docs 主席   {#sig-docs-chairperson}

每个 SIG，包括 SIG Docs，都会选出一位或多位成员作为主席。
主席会成为 SIG Docs 和其他 Kubernetes 组织的联络接口人。
他们需要了解整个 Kubernetes 项目的架构，并明白 SIG Docs 如何在其中运作。
如需查询当前的主席名单，请查阅
[领导人员](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)。

<!--
## SIG Docs teams and automation

Automation in SIG Docs relies on two different mechanisms:
GitHub teams and OWNERS files.
-->
## SIG Docs 团队和自动化 {#sig-docs-teams-and-automation}

SIG 文档中的自动化服务依赖于两种不同的机制:
GitHub 团队和 OWNERS 文件。

<!--
### GitHub teams

There are two categories of SIG Docs [teams](https://github.com/orgs/kubernetes/teams?query=sig-docs) on GitHub:

- `@sig-docs-{language}-owners` are approvers and leads
- `@sig-docs-{language}-reviews` are reviewers

Each can be referenced with their `@name` in GitHub comments to communicate with
everyone in that group.

Sometimes Prow and GitHub teams overlap without matching exactly. For assignment of issues, pull requests, and to support PR approvals,
the automation uses information from `OWNERS` files.
-->
### GitHub 团队 {#github-teams}

GitHub 上有两类 SIG Docs 团队：

- `@sig-docs-{language}-owners` 包含批准人和牵头人
- `@sig-docs-{language}-reviews` 包含评阅人

可以在 GitHub 的评论中使用团队的名称 `@name` 来与团队成员沟通。

有时候 Prow 所定义的团队和 GitHub 团队有所重叠，并不完全一致。
对于指派 Issue、PR 和批准 PR，自动化工具使用来自 `OWNERS` 文件的信息。

<!--
### OWNERS files and front-matter

The Kubernetes project uses an automation tool called prow for automation
related to GitHub issues and pull requests. The
[Kubernetes website repository](https://github.com/kubernetes/website) uses
two [prow plugins](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins):
-->
### OWNERS 文件和扉页   {#owners-files-and-front-matter}

Kubernetes 项目使用名为 prow 的自动化工具来自动处理 GitHub issue 和 PR。
[Kubernetes website 仓库](https://github.com/kubernetes/website) 使用了两个
[prow 插件](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins)：

- blunderbuss
- approve

<!--
These two plugins use the
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) and
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
files in the top level of the `kubernetes/website` GitHub repository to control
how prow works within the repository.
-->
这两个插件使用位于 `kubernetes/website` 仓库顶层的
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) 文件和
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
文件来控制 prow 在仓库范围的工作方式。

<!--
An OWNERS file contains a list of people who are SIG Docs reviewers and
approvers. OWNERS files can also exist in subdirectories, and can override who
can act as a reviewer or approver of files in that subdirectory and its
descendants. For more information about OWNERS files in general, see
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).
-->
OWNERS 文件包含 SIG Docs 评阅人和批准人的列表。
OWNERS 文件也可以存在于子目录中，可以在子目录层级重新设置哪些人可以作为评阅人和
批准人，并将这一设定传递到下层子目录。
关于 OWNERS 的更多信息，请参考
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md)
文档。

<!--
In addition, an individual Markdown file can list reviewers and approvers in its
front-matter, either by listing individual GitHub usernames or GitHub groups.

The combination of OWNERS files and front-matter in Markdown files determines
the advice PR owners get from automated systems about who to ask for technical
and editorial review of their PR.
-->
此外，每个独立的 Markdown 文件都可以在其前言部分列出评阅人和批准人，
每一项可以是 GitHub 用户名，也可以是 GitHub 组名。

结合 OWNERS 文件及 Markdown 文件的前言信息，自动化系统可以给 PR 作者可以就应该
向谁请求技术和文字评阅给出建议。

<!--
## How merging works

When a pull request is merged to the branch used to publish content, that content
is published to http://kubernetes.io. To ensure that
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
  specific roles, such as [PR Wrangler](/docs/contribute/participate/pr-wranglers/) or
  [SIG Docs chairperson](#sig-docs-chairperson).
-->
## PR 是怎样被合并的 {#how-merging-works}

当某个拉取请求（PR）被合并到用来发布内容的分支，对应的内容就会被发布到 http://kubernetes.io。
为了确保我们所发布的内容的质量足够好，合并 PR 的权限仅限于
SIG Docs 批准人。下面是合并的工作机制：

- 当某个 PR 同时具有 `lgtm` 和 `approve` 标签，没有 `hold` 标签且通过所有测试时，
  该 PR 会被自动合并。
- Kubernetes 组织的成员和 SIG Docs 批准人可以添加评论以阻止给定 PR 的自动合并，
  即通过 `/hold` 评论或者收回某个 `/lgtm` 评论实现这点。
- 所有 Kubernetes 成员可以通过 `/lgtm` 评论添加 `lgtm` 标签。
- 只有 SIG Docs 批准人可以通过评论 `/approve` 合并 PR。
  某些批准人还会执行一些其他角色，例如
  [PR 管理者](/zh-cn/docs/contribute/participate/pr-wranglers/) 或
  [SIG Docs 主席](#sig-docs-chairperson)等。

## {{% heading "whatsnext" %}}

<!--
For more information about contributing to the Kubernetes documentation, see:

- [Contributing new content](/docs/contribute/new-content/)
- [Reviewing content](/docs/contribute/review/reviewing-prs)
- [Documentation style guide](/docs/contribute/style/)
-->
关于贡献 Kubernetes 文档的更多信息，请参考：

- [贡献新内容](/zh-cn/docs/contribute/new-content/)
- [评阅内容](/zh-cn/docs/contribute/review/reviewing-prs)
- [文档样式指南](/zh-cn/docs/contribute/style/)
