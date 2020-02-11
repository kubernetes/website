---
content_template: templates/concept
title: 为 Kubernetes 文档做贡献
linktitle: 贡献
main_menu: true
weight: 80
---

<!--
---
content_template: templates/concept
title: Contribute to Kubernetes docs
linktitle: Contribute
main_menu: true
weight: 80
---
-->

{{% capture overview %}}

<!--
If you would like to help contribute to the Kubernetes documentation or website,
we're happy to have your help! Anyone can contribute, whether you're new to the
project or you've been around a long time, and whether you self-identify as a
developer, an end user, or someone who just can't stand seeing typos.
-->

如果你想帮助对 Kubernetes 文档或网站做出贡献，我们很高兴得到你的帮助！
任何人都可以做出贡献，无论你刚参与项目还是参与了很长时间，无论你是开发人员还是用户，或是无法忍受看到拼写错误的人。

<!--
For more ways to get involved in the Kubernetes community or to learn about us,
also visit the [Kubernetes community site](/community/).
-->

更多途径参与 Kubernetes 社区或了解我们，请访问 [Kubernetes 社区网站](/community/)。

<!--
Looking for the [style guide](/docs/contribute/style/style-guide/) or the
[Kubernetes Community site](/community/)?
-->

查找 [样式指南](/docs/contribute/style/style-guide/) 或者 [Kubernetes 社区网站](/community/)？

{{% /capture %}}

{{% capture body %}}

<!--
## Types of contributor
-->

## 贡献者类型

<!--
- A _member_ of the Kubernetes organization has [signed the CLA](/docs/contribute/start#sign-the-cla)
  and contributed some time and effort to the project. See
  [Community membership](https://github.com/kubernetes/community/blob/master/community-membership.md)
  for specific criteria for membership.
-->

- [签署了 CLA](/docs/contribute/start#sign-the-cla)并为项目贡献了时间和精力的 Kubernetes 组织的_成员_。
  参见 [社区成员](https://github.com/kubernetes/community/blob/master/community-membership.md) 中对于成员资格的具体标准。

<!--
- A SIG Docs _reviewer_ is a member of the Kubernetes organization who has
  expressed interest in reviewing documentation pull requests and who has been
  added to the appropriate Github group and `OWNERS` files in the Github
  repository, by a SIG Docs Approver.
-->

- SIG Docs 的_评审者_是对评审文档 PR 感兴趣，并被 SIG Docs 审批者添加到 Github 群组并在 Github 仓库中 `OWNERS` 文件的 Kubernetes 组织的成员。

<!--
- A SIG Docs _approver_ is a member in good standing who has shown a continued
  commitment to the project and is granted the ability to merge pull requests
  and thus to publish content on behalf of the Kubernetes organization.
  Approvers can also represent SIG Docs in the larger Kubernetes community.
  Some of the duties of a SIG Docs approver, such as coordinating a release,
  require a significant time commitment.
-->

- SIG Docs 的_审批者_是对项目持续贡献，并被授予合并 PR 权限和代表 Kubernetes 组织发布内容的成员。
  批准人也可以在更广泛的 Kubernetes 社区中代表 SIG Docs 团队。
  SIG Docs审批者的一些职责，如协调发布版本，需要大量的时间投入。

<!--
## Ways to contribute
-->

## 贡献途径

<!--
This list is divided into things anyone can do, things Kubernetes organization
members can do, and things that require a higher level of access and familiarity
with SIG Docs processes. Contributing consistently over time can help you
understand some of the tooling and organizational decisions that have already
been made.
-->

以下列表将工作分成了：任何人都可以做的工作、Kubernetes 组织成员可以做的工作，和熟悉 SIG Docs 流程并且有更高访问权限才能做的工作。
持续的贡献可以帮助你理解已有的工具和组织决策。

<!--
This is not an exhaustive list of ways you can contribute to the Kubernetes
documentation, but it should help you get started.
-->

你对 Kubernetes 文档可以做出的贡献不仅限于列表列出的条目，但它可以帮助你开动起来。

<!--
- [Anyone](/docs/contribute/start/)
  - File actionable bugs
-->

- [任何人](/docs/contribute/start/)
  - 登记记录可修正的错误

<!--
- [Member](/docs/contribute/start/)
  - Improve existing docs
  - Bring up ideas for improvement on Slack or SIG docs mailing list
  - Improve docs accessibility
  - Provide non-binding feedback on PRs
  - Write a blog post or case study
-->

- [成员](/docs/contribute/start/)
  - 完善已有文档
  - 在 Slack 或 SIG Docs 邮件列表中提出改进意见
  - 提升文档的易用性
  - 对 PR 提出无约束的反馈
  - 编写博文和案例分析

<!--
- [Reviewer](/docs/contribute/intermediate/)
  - Document new features
  - Triage and categorize issues
  - Review PRs
  - Create diagrams, graphics assets, and embeddable screencasts / videos
  - Localization
  - Contribute to other repos as a docs representative
  - Edit user-facing strings in code
  - Improve code comments, Godoc
-->

- [评审者](/docs/contribute/intermediate/)
  - 为新功能特性编写文档
  - 对 issue 进行筛选和分类
  - 评审 PR
  - 创建图表、图形分析和嵌入式的屏幕/视频
  - 本地化
  - 作为 docs 小组的代表为其他项目仓库做贡献
  - 在代码中编辑面向用户的字符串
  - 改进代码注释和 Godoc

<!--
- [Approver](/docs/contribute/advanced/)
  - Publish contributor content by approving and merging PRs
  - Participate in a Kubernetes release team as a docs representative
  - Propose improvements to the style guide
  - Propose improvements to docs tests
  - Propose improvements to the Kubernetes website or other tooling
-->

- [审批者](/docs/contribute/advanced/)
  - 通过批准和合并 PR 发布贡献成果
  - 作为 docs 团队的代表参与 Kubernetes 发布团队
  - 对样式指南提出改进建议
  - 对文档测试提出改进建议
  - 对 Kubernetes 网站或其他工具提出改进建议

<!--
## Additional ways to contribute
-->

## 其他贡献途径

<!--
- To contribute to the Kubernetes community through online forums like Twitter or Stack Overflow, or learn about local meetups and Kubernetes events, visit the [Kubernetes community site](/community/).
-->

- 如果您要通过 Twitter 或 Stack Overflow 等在线论坛为社区做贡献，或了解本地会议及 Kubernetes 事件，请查看 [Kubernetes 社区网站](/community/).

<!--
- To contribute to feature development, read the [contributor cheatsheet](https://github.com/kubernetes/community/tree/master/contributors/guide/contributor-cheatsheet) to get started.
-->

- 如果您要开发新的特性，请阅读 [contributor cheatsheet](https://github.com/kubernetes/community/tree/master/contributors/guide/contributor-cheatsheet).

{{% /capture %}}
